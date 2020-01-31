# Modulo 02 GoStack Rocketseat

## Quick Notes

- É interessante trabalhar com classes dentro do app.

- A vantagem de utilizar classes é que futuramente facilita a realização de testes.

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

Local onde fica as configurações da aplicação.
É interessante no server, fazer todas aquelas configurações básicas do express, e então, exportar uma nova instância do App, porém, apenas do atributo server:

```javascript
module.exports = new App().server;
```

> `JavaScript` é magico! 🎩 ✨

---

## Lib Sucrase

Lib que permite utilizar as funções mais recentes do `JavaScript`, e não ficar "preso" no "common JS", que é a síntaxe mais antiga da linguagem.

```javascript
yarn add sucrase -D
```

> **Nota:** A flag `-D` indica que essa será uma dependecia de desenvolvimento, e não será utilizada no ambiente de produção.
> **Outra Nota:** Ao se instalar o `sucrase`, não é mais possível executar o comando `node server.js`, pois ele não irá reconhecer a síntaxe nova. Esse comando é substituído por `yarn sucrase-node server.js`.

### 2:22 de vídeo aproximadamente, ver como é feito a configração de DEBUG e anotar!

---

## Nodemon

Para "bindar" o nodemon ao `sucrase`, é necessário criar um arquivo chamado `nodemon.json` na raiz, e passar as seguintes configurações:

```json
{
  "execMap": {
    "js": "node -r sucrase/register"
  }
}
```

> **Nota:** 3:20 de vídeo left. FAZER ESSA ANOTAÇÃO!

---

## PENDENTE ADICIONAR DESCRIÇÕES DA ALTERAÇÃO DE CONFIGURAÇÃO DO .editorconfig, .eslint e do .prettierrc
