const { analisislexico } = require('./lexer');
const parse = require('./parser');

const code = `
AVANZAR 100
GIRAR_DERECHA 90
RETROCEDER 50
`;

const lexResult = analisislexico(code);
console.log("🔍 Resultado léxico:");
console.log(JSON.stringify(lexResult, null, 2));

const parserResult = parse(lexResult.tokens);
console.log("\n📐 Resultado sintáctico (AST):");
console.log(JSON.stringify(parserResult, null, 2));