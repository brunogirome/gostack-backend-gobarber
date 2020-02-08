// Detalhe: Sequelize é importado como default dentro do sequelize
import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
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
