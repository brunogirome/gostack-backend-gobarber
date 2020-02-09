import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';
// Biblioteca de língua portuguesa do date-fns
import pt_BR from 'date-fns/locale/pt-BR';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

class AppointmentController {
  async index(req, res) {
    // Descontruindo a query pegando o valor page, e caso esse valor não exista,
    // é possível setar um valor default para ele, no caso, 1
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      // Trazendo até 20 itens
      limit: 20,
      // Quantidade de itens que serão pulados
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              // Importante que é necessário passar o 'path' dentro dos
              // attributes, já que a variável 'url' é gerada com o dado do
              // path, e como ela é Virtual, ela não é um dado fixo dentro
              // do banco
              attributes: ['id', 'url', 'name', 'path'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    // Checando se o provider existe
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    // Checando se a hora é válida

    // Variável que armazena a hora, onde parseISO converte a string de data
    // em uma varíavel compatível com o Date do Javascript, e startOfHour pega
    // apenas o valor da hora
    const hourStart = startOfHour(parseISO(date));

    // Checando se o horário não está antes do horário atual
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past date are not permitted' });
    }

    // Checando se o provider já não possui um appointment no horário
    const checkAvailability = await Appointment.findOne({
      where: { provider_id, canceled_at: null, date: hourStart },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date already occupied' });
    }

    if (!isProvider) {
      // Lembrando que Status 401: Não autorizado
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    // Checando se o provider não é ele mesmo
    if (provider_id === req.userId) {
      // Lembrando de novo que 401 significa bad request! 😝
      return res
        .status(401)
        .json({ error: 'You can not create a appointment for yourself' });
    }

    // Criando agendamento
    const appointment = await Appointment.create({
      // Quando o usuário passa pelo middleware de authentication, lá dentro
      // do middleware, é criada a variável userId dentro de 'req', e ela
      // mode ser acessa em toda rota que programada após a utilização desse
      // middelware
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    // Notificando o provider
    const user = await User.findByPk(req.userId);
    // Criando data customizada
    // Neste caso, os dados que estão entre aspas simples (como o 'dia'), será
    // transcrito como a pópria palavra. dd é o dia, MMMM é o mês por extenso,
    // H hora e mm minutos
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      // Lembrando que esse pt é um import separado do date-fns
      { locale: pt_BR }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
