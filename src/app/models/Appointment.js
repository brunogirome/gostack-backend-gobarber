// Detalhe: Sequelize é importado como default dentro do sequelize
import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          // Verificando se este não é um appointment antigo
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          // Tirando 2 horas do horário do agendamento e verificando se
          // ele fica antes do horário atual
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    // Lembrando que nesse caso, ele pega os models que estão sendo
    // inicializados dentro do index do database!
    // OBS: Quando criamos um relacionamento duas vezes com o mesmo model, é
    // necessário no sequelize
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
