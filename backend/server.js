const express = require("express");
const cors = require("cors");
const { analisislexico } = require("./lexer");
const parse = require("./parser");   // ← nuevo
const { analyze } = require("./semantic"); // <-- nuevo

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("frontend/public"));

// Endpoint completo (léxico + sintáctico + semántico)
app.post("/compile-full", (req, res) => {
    const sourceCode = req.body.codigo;
    if (typeof sourceCode !== 'string') {
        return res.status(400).json({ error: "Falta el campo 'codigo' o no es un string" });
    }

    // 1. Análisis léxico
    const { tokens, errors: lexicalErrors } = analisislexico(sourceCode);

    // 2. Análisis sintáctico (AST)
    const { ast, errors: syntacticErrors } = parse(tokens);

    // 3. Análisis Semántico
    // Solo analizar si no hay errores previos para evitar resultados inconsistentes
    let semanticResult = { robotMoves: [], errors: [] };
    if (lexicalErrors.length === 0 && syntacticErrors.length === 0) {
        semanticResult = analyze(ast);
    }
    const { robotMoves, errors: semanticErrors } = semanticResult;

    // 4. Combinar errores
    const allErrors = [...lexicalErrors, ...syntacticErrors, ...semanticErrors];

    res.json({
        tokens,
        lexicalErrors,
        robotMoves,
        ast,
        syntacticErrors,
        semanticErrors,
        allErrors,
        success: allErrors.length === 0
    });
});

// Endpoints para tablas (sin cambios)
app.get("/comandos", (req, res) => {
    res.json({ comandos: ["AVANZAR", "RETROCEDER", "GIRAR_IZQUIERDA", "GIRAR_DERECHA"] });
});
app.get("/errores", (req, res) => {
    res.json({ errores: [
        "Comando no reconocido",
        "Formato de instrucción inválido",
        "Valor no numérico",
        "Valor fuera de rango (0-400 o 0-360)",
        "Token inválido (sintáctico)",
        "Tipo de comando no válido (sintáctico)"
    ] });
});

// Endpoint antiguo /compile (para compatibilidad con Postman/Thunder)
app.post("/compile", (req, res) => {
    const sourceCode = req.body.code || req.body.codigo;
    if (!sourceCode) return res.status(400).json({ error: "Falta 'code'" });
    res.json(analisislexico(sourceCode));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));