import Bee from 'bee-queue';

import redisConfig from '../config/redis';
import CancellationMail from '../app/jobs/CancellationMail';

const jobs = [CancellationMail];

class Queue {
  constructor() {
    // Cada trabalho/trabalhos em brackground terá uma fila própria
    this.queues = {};

    this.init();
  }

  init() {
    // Detalhe, geralmente o map é utilizado para retornar um valor, já o
    // forEach é utilizado apenas para percorrer o vetor

    // O key e o hande foram desestruturados da classe, podendo ser acessados
    // de forma mais rápida de dinâmica, sem a necessidade de realizar um
    // 'job.handle' ou 'job.key'
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        // Configurando as filas no banco
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        // Método que executa o job em si
        handle,
      };
    });
  }

  // Adicionando os jobs à fila de execução
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      // Pegando o dado de dentro de queues filtrando pela key do job
      const { bee, handle } = this.queues[job.key];
      // Mandando o processo ser executado de dentro do objeto que armazena as
      // queues

      // Escutando um processo do bee queue
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
