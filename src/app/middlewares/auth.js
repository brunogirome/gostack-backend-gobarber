import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // Token do usuário que vem dentro da tag "authorization" no header da
  // requesição
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided ' });
  }

  // Dividindo uma string pelo espaço (' '), assim dividindo a palavra 'Bearer'
  // e o token, já que o formato do token de autenticação é:
  // 'Bearer hashdeautenticaçãodousuário'
  const [, token] = authHeader.split(' ');

  try {
    // O método 'jwt.verify'
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(400).json({ error: 'Token invalid ' });
  }
};
