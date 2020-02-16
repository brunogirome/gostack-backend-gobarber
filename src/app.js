// Jogando o arquivo .env em um processo do node chamado process.env
import 'dotenv/config';

import express from 'express';
import path from 'path';
import * as Sentry from '@sentry/node';
// Lib que gera mensagens de erros mais interessantes
import Youch from 'youch';

import 'express-async-errors';

import routes from './routes';

import sentryConfig from './config/sentry';
// Lib que permite o express enviar erros em funções que são do tipo async, já
// que por padrão ele não enviará erros para o Sentry em funções assíncronas

import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // De acordo com a documentação do Sentry, o requestHandler deve vir antes
    // de todos as outras requisições
    this.server.use(Sentry.Handlers.requestHandler());
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
    // Novamente, de acordo com a documentação do Sentry, o errorHandler tem que
    // vir depois das rotas
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    // Quando um middleware possui 4 parâmentros no express, ele é
    // automaticamente reconhecido como um middleware de tratamento de excessões
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        // Lembrando que o Youch possui um método chamado toHTML
        const errors = await new Youch(err, req).toJSON();
        // Status 500: Internal server error
        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
