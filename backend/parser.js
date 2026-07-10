function parse(tokens) {
    const ast = {
        type: "Program",
        body: []
    };
    const errors = [];

    const validTypes = ["AVANZAR", "RETROCEDER", "GIRAR_DERECHA", "GIRAR_IZQUIERDA"];

    for (const token of tokens) {
        // Validar estructura del token
        if (!token.type || token.value === undefined) {
            errors.push({
                line: token.line || 0,
                message: "Token inválido: falta tipo o valor"
            });
            continue;
        }

        // Validar tipo de comando
        if (!validTypes.includes(token.type)) {
            errors.push({
                line: token.line,
                message: `Tipo de comando no válido: ${token.type}`
            });
            continue;
        }

        // Validar valor numérico (ya debería serlo por el léxico)
        if (typeof token.value !== 'number' || isNaN(token.value)) {
            errors.push({
                line: token.line,
                message: `Valor no numérico para ${token.type}: ${token.value}`
            });
            continue;
        }

        // Crear nodo AST
        ast.body.push({
            type: "MoveCommand",
            command: token.type,
            value: token.value,
            line: token.line
        });
    }

    return { ast, errors };
}

module.exports = parse;