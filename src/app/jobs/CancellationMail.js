import { format, parseISO } from 'date-fns';
import pt_BR from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';

class CancellationMail {
  // Método get do ES6, onde apenas por declarar um método com get, é possível
  // acessálo com, por exemplo, CancellationMail.key
  get key() {
    // Chave única do job
    return 'CancellationMail';
  }

  // Manipulador do Job
  async handle({ data }) {
    // O appointment será passado com parâmetro junto de outras informações
    const { appointment } = data;

    // Lembrando que o primeiro parâmetro do sendMail era message, e aqui nós
    // estamos passando vários atributos para o objeto de configuração via o
    // comando ...message
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      // Nome do template hbs
      template: 'cancellation',
      // Variáveis que o template pede
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt_BR,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
