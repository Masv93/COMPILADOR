const { analisislexico } = require('./lexer');

const code = `
avanzar 100
girar derecha 90
retroceder 50
`;

const resultado = analisislexico(code);
console.log(JSON.stringify(resultado, null, 2));