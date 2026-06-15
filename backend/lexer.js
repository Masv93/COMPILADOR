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

        const expectedParts = (command.includes("GIRAR_")) ? 3 : 2;
        if (parts.length !== expectedParts) {
            errors.push({
                line: lineNumber,
                type: "ERROR_LEXICO",
                message: "Formato de instrucción inválido"
            });
            return;
        }

        if (!validCommands.includes(command)) {
            errors.push({
                line: lineNumber,
                type: "ERROR_LEXICO",
                message: `Comando no reconocido: ${command}`
            });
            return;
        }

        if (!/^\d+$/.test(value)) {
            errors.push({
                line: lineNumber,
                type: "ERROR_LEXICO",
                message: `Valor no numérico: ${value}`
            });
            return;
        }

        const numericValue = parseInt(value, 10);

        // Validaciones de rango
        if (command === "AVANZAR" || command === "RETROCEDER") {
            if (numericValue < 0 || numericValue > 400) {
                errors.push({
                    line: lineNumber,
                    type: "ERROR_SEMANTICO",
                    message: `${command} admite valores entre 0 y 400`
                });
                return;
            }
        } else if (command === "GIRAR_IZQUIERDA" || command === "GIRAR_DERECHA") {
            if (numericValue < 0 || numericValue > 360) {
                errors.push({
                    line: lineNumber,
                    type: "ERROR_SEMANTICO",
                    message: `${command} admite valores entre 0 y 360`
                });
                return;
            }
        }

        tokens.push({
            type: command,
            value: numericValue,
            line: lineNumber
        });

        robotMoves.push({
            action: command,
            value: numericValue
        });
    });

    return {
        tokens,
        errors,
        robotMoves
    };
}

module.exports = { analisislexico };