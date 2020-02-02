// Detalhe: Sequelize é importado como default dentro do sequelize
import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    // Hooks no node/sequelize são ações que executam automáticamente em
    // determinada situação
    this.addHook('beforeSave', async user => {
      // Checando se a requisção está enviando uma nova senha, se não, acredito
      // que o sequelize irá gerar um hash de 'null' ou 'undefined'
      // Este segundo parâmetro é quantidade de vezes que o hash é "re-gerado"
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    // Não sei porque utilizar o return this aqui...
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
