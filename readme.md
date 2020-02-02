# Modulo 02 GoStack Rocketseat

## Quick Notes

- É interessante trabalhar com classes dentro do backend.

- Ao se utilizar classes, fica bem mais fácil e viável criar testes para a aplicação.

- Lembrando que no `JavaScript`, quando se declara alguma variável com _this_ dentro do constructor (se eu não me engano é só no constructor), o `JavaScript` automaticamente reconhece aquela variável como uma variável pública da classe, exemplo:

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

> Ou seja, instânciamos a própria classe no arquivo e tornamos apenas uma variável pública. `JavaScript` é magico! 🎩 ✨

---

## Lib Sucrase

Lib que permite utilizar as funções mais recentes do `JavaScript`, e não ficar "preso" no "common JS", que é a síntaxe mais antiga da linguagem.

```javascript
yarn add sucrase -D
```

> **Nota:** A flag `-D` indica que essa será uma dependecia de desenvolvimento, e não será utilizada no ambiente de produção.
> **Outra Nota:** Ao se instalar o `sucrase`, não é mais possível executar o comando `node server.js`, pois ele não irá reconhecer a síntaxe nova. Esse comando é substituído por `yarn sucrase-node server.js`.

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
