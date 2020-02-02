// Importando tudo de de 'yup' jogando dentro da variável Yup, já que a lib do
// up não possui um objeto único de import default
import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    // O Yup shape reflete os campos que serão validades pelo próprio shcema.
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    // Realizando a verificação do Yup
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User alredy exists' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        // O .when retorna um campo caso uma condição seja atendida. No caso,
        // caso 'oldPassowrd' exista, ele faz uma verificação: se oldPassword
        // existir, esse campo é obrigatório, se não, ele apenas permanece da
        // maneira original
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      // Mesmo esquema de validação do anterior
      confirmPassword: Yup.string().when('password', (password, field) =>
        // Caso password exista, ele se torna obrigatório, e ele pode receber
        // um 'enum', no caso, ele só pode ser um dos valores passado no array.
        // Neste caso, foi utilizado o 'Yup.ref()', função que referencia outro
        // campo do shape, então, nesse caso, ele tem que ser igual ao campo
        // 'password' referênciado no Yup.ref
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    // Caso o usuário queira alterar o email
    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User alredy exists' });
      }
    }

    // Caso o usuário tiver enviado um "oldPassword", ou seja esteja tentando
    // alterar a senha, já que essa atributo só será enviado CASO ela seja
    // requesitada
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
