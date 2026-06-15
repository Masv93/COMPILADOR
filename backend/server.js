const express = require("express");
const cors = require("cors");
const { analisislexico } = require("./lexer");

const app = express();
app.use(cors());
app.use(express.json());

// SIRVE LOS ARCHIVOS ESTÁTICOS (IMPORTANTE: va antes de las rutas)
app.use(express.static("frontend/public"));  // ← ruta correcta

// Endpoint para el análisis léxico (usado por el frontend)
app.post("/analizar", (req, res) => {
    const sourceCode = req.body.codigo;
    if (!sourceCode) {
        return res.status(400).json({ error: "Falta el campo 'codigo'" });
    }
    const result = analisislexico(sourceCode);
    res.json(result);
});

// Endpoints para las tablas de comandos y errores
app.get("/comandos", (req, res) => {
    res.json({ comandos: ["AVANZAR", "RETROCEDER", "GIRAR_IZQUIERDA", "GIRAR_DERECHA"] });
});
app.get("/errores", (req, res) => {
    res.json({ errores: [
        "Comando no reconocido",
        "Formato de instrucción inválido",
        "Valor no numérico",
        "Valor fuera de rango (0-400 o 0-360)"
    ] });
});

// (Opcional) Para compatibilidad con Thunder Client/Postman
app.post("/compile", (req, res) => {
    const sourceCode = req.body.code;
    if (!sourceCode) return res.status(400).json({ error: "Falta 'code'" });
    res.json(analisislexico(sourceCode));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));