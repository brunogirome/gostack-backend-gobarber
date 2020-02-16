import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    // Aqui, está sendo executado meio que dois .maps em cascata, onde é
    // executado o primeiro e depois o segundo
    models
      .map(model => model.init(this.connection))
      // Aqui, caso método model.associate exista, ele executa o
      // model.associate(). Acredito que seja uma feature do Ecmascript, não
      // deve ter uma lógica de comparação real
      // Nesse caso, o this.connection.models está referenciando os models que
      // estão dentro de connection, e não o array local models
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
  }
}

export default new Database();
