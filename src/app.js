import express from 'express';
import path from 'path';

import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    // Primeiro, foi setada uma rota que "receberá" o middeware, e depois
    // foi adicionado de fato o middleware que será exectuado. Nesse caso,
    // foi utilizado o static, middelware que permite o acesso a arquivos
    // que estão salvos no backend, ou alguma coisa assim :)
    //
    // No exeplo, foi dado também a possibilidade de acessar, por exemplo,
    // arquivos .css ou .html
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
