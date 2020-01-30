# Modulo 02 GoStack Rocketseat

## Quick Notes

- É interessante trabalhar com classes dentro do app.

- A vantagem de utilizar classes é que futuramente facilita a realização de testes.

- Lembrando que no `JavaScript`, quando se declara alguma variável com *this* dentro do constructor (se eu não me engano é só no constructor), o `JavaScript` automaticamente reconhece aquela variável como uma variável pública da classe, exemplo:

```javascript
class App {
  constructor() {
    this.url = 'http://localhost:3333/'
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
module.exports = new App().server
```

> JavaScript é magico! 🎩

---
