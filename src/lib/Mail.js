import nodemailer from 'nodemailer';
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
