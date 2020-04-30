import { startOfDay, endOfDay, parseISO } from 'date-fns';
// importando os operadores de query do sequelize
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      // Lembrando de novo, 401: bad request!
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const { date } = req.query;
    const parseDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          // Transformando o retorno de 'Op.between' no nome/chave do atribuito
          // do objeto do Javascript
          // Já que o Between compara dois intervalos, é passado um array com
          // o início e o fim do valor desejado
          // O 'date-fns' faz a mágia de pegar a hora 00:00:00 e a hora
          // 23:59:59, que são a inicial e final, respectivamente
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
        },
      },
      include: [
        {
          model: User,
          ase: 'user',
          attributes: ['name'],
        },
      ],
      order: ['date'],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
