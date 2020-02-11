import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';

class AvaliableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    // Convertendo a data
    // Convertido para, exemplo: 2020-07-13 11:12:05
    const searchDate = Number(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: { [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)] },
      },
    });

    const schedule = [
      '07:00',
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
      '22:00',
    ];

    const avaiables = schedule.map(time => {
      // Desconstruindo e criando virável hour e minute a partir do split das
      // strings do schedule
      const [hour, minute] = time.split(':');
      // Transformando cada valor do vetor schedule em '2020-07-13 11:12:05'
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      return {
        // Dado de dentro do schedule
        time,
        // Formatando a data com geolocalização
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        // Variável que retorna true ou false para o horário selecionado
        avaiable:
          // Verificando se o horário está disponível em relação a hora atual
          isAfter(value, new Date()) &&
          !appointments.find(
            a =>
              // Pegando apenas a hora e minuto dos appointments do provider
              format(a.date, 'HH:mm') === time
          ),
      };
    });

    return res.json(avaiables);
  }
}

export default new AvaliableController();
