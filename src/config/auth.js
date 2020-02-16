// O scret é uma palavra que torna o token único, evitando qualquer tipo de
// burlamento do token.
// Gerado no 'md5decrypt.net/'. Talvez no futuro você lembre a palavra :)
export default {
  secret: process.env.APP_SECRET,
  expiresIn: '7d',
};
