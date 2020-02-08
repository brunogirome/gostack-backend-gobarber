// Detalhe: Sequelize é importado como default dentro do sequelize
import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          // Lembrando que campos virtuais não existem no banco, mas o model é
          // capaz de enviá-lo no momento que é feita uma requsição
          // O get referencia a ação quando é executada um método get
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3333/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File;
