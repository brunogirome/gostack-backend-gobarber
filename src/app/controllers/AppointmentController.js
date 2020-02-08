import * as Yup from 'yup';

import User from '../models/User';
import Appointment from '../models/Appointment';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    // Checando se o usuário existe
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      // Lembrando que Status 401: Não autorizado
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    // Criando agendamento
    const appointment = await Appointment.create({
      // Quando o usuário passa pelo middleware de authentication, lá dentro
      // do middleware, é criada a variável userId dentro de 'req', e ela
      // mode ser acessa em toda rota que programada após a utilização desse
      // middelware
      user_id: req.userId,
      provider_id,
      date,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
