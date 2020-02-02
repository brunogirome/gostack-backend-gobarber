# Modulo 02 GoStack Rocketseat

Este é um readme temporário que estarei utilizando para fazer as anotações mais relevantes. Importante depois lembrar de separar cada readme em uma pasta mais apropriada, para evitar poluição na home da aplicação.

## Quick Notes

- É interessante trabalhar com classes dentro do backend.

- Ao se utilizar classes, fica bem mais fácil e viável criar testes para a aplicação.

- Lembrando que no JavaScript, quando se declara alguma variável com _this_ dentro do constructor (se eu não me engano é só no constructor), o JavaScript automaticamente reconhece aquela variável como uma variável pública da classe, exemplo:

```javascript
class App {
  constructor() {
    this.url = 'http://localhost:3333/';
    // Automaticamente o JavaScript irá reconhecer a variável url como uma
    // variável pública da classe
  }
}
```

---

## App

O App acaba sendo a estrutura da aplicação backend.
Neste caso, o App foi programado como classe, e todas as configurações do `express` ficaram aqui dentro (ao invés de jogar todo no arquivo `server.js`, como era feito antes, todos middlewares e rotas ficam organizadas em métodos próprios).
No App, jogamos todas as configurações do `express` dentro de uma variável `server`, e então a exportamos:

```javascript
module.exports = new App().server;
```

> Ou seja, instânciamos a própria classe no arquivo e tornamos apenas uma variável pública. JavaScript é magico! 🎩 ✨

---

## Lib Sucrase

Lib que permite utilizar as funções mais recentes do JavaScript, e não ficar "preso" no "common JS", que é a sintaxe mais antiga da linguagem.

```javascript
yarn add sucrase -D
```

> **Nota:** A flag `-D` indica que essa será uma dependecia de desenvolvimento, e não será utilizada no ambiente de produção.
> **Outra Nota:** Ao se instalar o `sucrase`, não é mais possível executar o comando `node server.js`, pois ele não irá reconhecer a sintaxe nova. Esse comando é substituído por `yarn sucrase-node server.js`.

---

## Nodemon & Surcrase

Para "bindar" o nodemon ao `sucrase`, é necessário criar um arquivo chamado `nodemon.json` na raiz, e passar as seguintes configurações:

```json
{
  "execMap": {
    "js": "node -r sucrase/register"
  }
}
```

Esse processo é necessário para evitar que o `nodemon` rode o comando `node server.js` toda vez que a aplicação for reiniciada.

---

## Debugging NodeJS com o VSCode

É interessante incluir um script exclusivo para debugs que rode com `nodemon`, para isso, dentro da tag `"scripts"` do `package.json`, é interessante incluir a seguinte linha:

```json
"scripts": {
  "dev:debug": "nodemon --inspect server.js"
}
```

### Configurações do VSCode

É necesário criar um novo arquivo de configurações para debugs do VSCode, para isso, basta entrar na aba de **Debug** e clicar na opção de **criar um arquivo launch.json**.

> Detalhe que o VSCode irá criar uma pasta `.vscode` na raiz do projeto, e lá ficará o `launch.json`.

Ao criar o arquivo, é importante ajustar algumas coisas:

```json
{
  "request": "attach",
  "protocol": "inspector"
}
```

> Com essa configurações, a ferramenta de Deubg irá ler a aplicação e não executá-la. Lembrando que a tag `"program"` pode ser removida, e a `"protocol"` geralmente não vem por padrão.

---

## PENDENTE ADICIONAR DESCRIÇÕES DA ALTERAÇÃO DE CONFIGURAÇÃO DO .editorconfig, .eslint e do .prettierrc

## PENDENTE TAMBÉM ADICIONAR DESCRIÇÕES DO VÍDEO DE CONFIGURAÇÕES DO SEQUELIZE

## Sequelize

### Models

Quando se cria o model, não é necessário incluir colunas como *primary key*, *foreing keys* e *created_at*/*updated_at*.

### PENDENTE FALAR SOBRE CONFIGURAÇÕES DO BANCO

## PENDENTE ANOTAR SOBRE O BYCRYTPT

## PENDENTE FALAR SOBRE O PASSWORD, VIRUTAL, E ATRIBUTOS DO MODEL, MODULO 2 3:50 DE VÍDEO, GERANDO HASH DE SENHA

## PENDENTE JWT

## PENDENTE AUTENTICAÇÃO

## Gerando um Middleware no arquivos `routes.js`

É possívem definir um middleware para diversas rotas, caso antes dessas rotas, seja defindo um `routes.use(nomeDoMiddleware)`:

```javascript
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Setando um Middleware global para todas as rotas seguintes
routes.use(authMiddleware);

routes.put('/users', UserController.update);
```

> A pela lógica, tudo o que vir depois de `routes.use(authMiddleware);` passará pelo `authMiddleware`.

## Desestruturação com arrays ignorando posições no JavaScript

Na desestruturação com arrays, é possível ignorar algumas casas colocando uma vírgula dentro do array:

```javascript
const [, token] = authHeader.split(' ');
```

> `authHeader.split(' ');` é um método do JavaScript que divide uma String por um caractere passado por parâmetro. Nesse caso, foi o espaço (' ').

Neste caso, foi retornado o seguinte array:

```javascript
[
  'Bearer',
  'hashMd5DoUsuario'
]
```

E a desestruturação considerou apenas a variável `token`, já que foi colocado a vírgula para a primeira posição.

> JavaScript é magico! 🎩 ✨

## Lib promisify do NodeJS

Com o promisify, é possível converter funções que usam a sintaxe antiga de `callback` do JavaScript, com a mais moderna de `async/await`:

```javascript
await promisify(jwt.verify)(token, authConfig.secret);
```

> Primeiro, o promisify pede como parâmetro a função que utiliza o callback, nesse caso, a `jwt.verify`, e já retorna a função convertida como uma função assíncrona que pode receber um `await`. Por isso, a sintaxe fica como `promisify.(callBackFunction)()`, onde o segundo parênteses é referente a função que está sendo retornada pelo promisify.

## Validando dados de entrada com o `yup`

Yup é uma lib de validação que utiliza um *Schema validation* para chegar o json que é enviado pela requisição.
