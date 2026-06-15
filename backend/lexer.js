function analisislexico(sourceCode) {
    const tokens = [];
    const errors = [];
    const robotMoves = [];

    const lines = sourceCode.split("\n");
    const validCommands = [
        "AVANZAR",
        "RETROCEDER",
        "GIRAR_IZQUIERDA",
        "GIRAR_DERECHA"
    ];

    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        line = line.trim();

        if (line === "") return;
        if (line.startsWith("#")) return;

        // Separar por espacios
        const parts = line.split(/\s+/);
        let command, value;

        // Detectar comando compuesto: "girar derecha" o "girar izquierda"
        if (parts[0].toLowerCase() === "girar" && parts[1] && 
            (parts[1].toLowerCase() === "derecha" || parts[1].toLowerCase() === "izquierda")) {
            command = (parts[0] + "_" + parts[1]).toUpperCase();
            value = parts[2];
        } else {
            command = parts[0].toUpperCase();
            value = parts[1];
        }

        // Validar que la estructura sea correcta (2 o 3 partes según el comando)
        const expectedParts = (command.includes("GIRAR_")) ? 3 : 2;
        if (parts.length !== expectedParts) {
            errors.push({
                line: lineNumber,
                type: "ERROR_LEXICO",
                message: "Formato de instrucción inválido"
            });
            return;
        }

        // Validar comando
        if (!validCommands.includes(command)) {
            errors.push({
                line: lineNumber,
                type: "ERROR_LEXICO",
                message: `Comando no reconocido: ${command}`
            });
            return;
        }

        // Validar que el valor sea numérico positivo
        if (!/^\d+$/.test(value)) {
            errors.push({
                line: lineNumber,
                type: "ERROR_LEXICO",
                message: `Valor no numérico: ${value}`
            });
            return;
        }

        const numValue = parseInt(value, 10);

        tokens.push({
            type: command,
            value: numValue,
            line: lineNumber
        });

        robotMoves.push({
            action: command,
            value: numValue
        });
    });

    return {
        tokens,
        errors,
        robotMoves
    };
}

module.exports = { analisislexico };