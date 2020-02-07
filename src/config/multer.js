import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  // Maneira que o multer irá armazenar os dados, neste caso, no disco.
  // Entretanto, é possível configurar aqui um servidor Online, como o Amazon S3
  storage: multer.diskStorage({
    // É necessário usar o path.resolve por se tratar de um caminho que o sitema
    // irá utilizar, então devido as diferentes formas de se escrever um path
    // no windows e no Linux, por exemplo, sendo / ou \\, é necessáiro utilizar
    // o path. Lembrando que pra imports não é necessário porque quem resolve
    // o caminho de path é o próprio JavaScript, e não o sistema
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // req: é de fato a requisição do express
    // file: dados do arquivo que está sendo feito o upload
    filename: (req, file, cb) => {
      // O crypto gera diversos tipoes de dados aleatórios.
      // A função, segundo parâmetro, é o callback do randomBytes. Por não
      // utilizar async await, o callbic acaba ficando na segunda função, e é
      // executado pelo parâmetro cb
      crypto.randomBytes(16, (err, res) => {
        // Se erro, o callback da função é o 'err'
        if (err) return cb(err);

        // Primeiro parâmetro do cb é error, e nesse caso, já foi feita uma
        // trativa para o erro
        // Segundo parâmetro pega os bytes aleatórios do crypto e transforma
        // em uma string. Nesse caso, é o nome do arquivo que será concatenado
        // com a exetnsão
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
