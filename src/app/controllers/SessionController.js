import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Méotodo criado no Model de Usuários para verificar se a senha enviada
    // bate com a senha o hash de senha do Banco de Dados
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // Desconstruindo os parâmetros que restaram
    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      // Lembrando que o jwt.sign({ id }) é o 'payload' da aplicação.
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
