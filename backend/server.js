const express = require("express");
const cors = require("cors");
const { analisislexico } = require("./lexer");
const parse = require("./parser");   // ← nuevo

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("frontend/public"));

// Endpoint completo (léxico + sintáctico)
app.post("/compile-full", (req, res) => {
    const sourceCode = req.body.codigo;
    if (!sourceCode) {
        return res.status(400).json({ error: "Falta el campo 'codigo'" });
    }

    // 1. Análisis léxico
    const lexResult = analisislexico(sourceCode);
    const { tokens, errors: lexicalErrors, robotMoves } = lexResult;

    // 2. Análisis sintáctico (AST)
    const parserResult = parse(tokens);
    const { ast, errors: syntacticErrors } = parserResult;

    // 3. Combinar errores
    const allErrors = [...lexicalErrors, ...syntacticErrors];

    res.json({
        tokens,
        lexicalErrors,
        robotMoves,
        ast,
        syntacticErrors,
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