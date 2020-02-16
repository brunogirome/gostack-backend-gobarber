import 'dotenv/config';

import Queue from './lib/Queue';

// Tada, a fila é executada fora do mesmo processo que o node, para não
// comprometer a perfmace do backend, e é por isso que o processQueue roda em
// um arquivo separado 😊
Queue.processQueue();
