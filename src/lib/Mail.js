import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';

import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      // Verificando se existe um usuário no envio do email, se não, não
      // utilizar autenticação
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    // Local da viewpaths para facilitar a navegação no resto do código
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    // Forma da qual será compilada o template de email
    this.transporter.use(
      'compile',
      nodemailerhbs({
        // Criando a view engine com a as configurações da pasta views/emails
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: resolve(viewPath, 'layouts', 'default'),
          extname: '.hbs',
        }),
        // Path das views
        viewPath,
        // Extensão dos arquivos
        extName: '.hbs',
      })
    );
  }

  sendMail(message) {
    return this.transporter.sendMail({
      // Pegando todos os dados de default, de dentro do arquivo de configuração
      // do nodemailer
      ...mailConfig.default,
      // Pegando tudo de dentro da mensage. Provavelmente a mensagem terá
      // alguns atributos 🤔
      ...message,
    });
  }
}

export default new Mail();
