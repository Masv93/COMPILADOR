const codeInput = document.getElementById('codeInput');
const compileBtn = document.getElementById('compileBtn');
const outputArea = document.getElementById('outputArea');
const tokensPre = document.getElementById('tokensPre');
const astPre = document.getElementById('astPre');
const movesPre = document.getElementById('movesPre');

// Nuevos paneles de errores
const lexicalErrorsPre = document.getElementById('lexicalErrorsPre');
const syntacticErrorsPre = document.getElementById('syntacticErrorsPre');
const semanticErrorsPre = document.getElementById('semanticErrorsPre');

// Modales
const commandsModal = document.getElementById('commandsModal');
const errorsModal = document.getElementById('errorsModal');
const robotModal = document.getElementById('robotModal');
const commandsList = document.getElementById('commandsList');
const errorsList = document.getElementById('errorsList');

// Cargar comandos y tipos de error
async function cargarComandos() {
    const res = await fetch('/comandos');
    const data = await res.json();
    commandsList.innerHTML = data.comandos.map(c => `<li>${c}</li>`).join('');
}
async function cargarErrores() {
    const res = await fetch('/errores');
    const data = await res.json();
    errorsList.innerHTML = data.errores.map(e => `<li>${e}</li>`).join('');
}

compileBtn.onclick = async () => {
    const codigo = codeInput.value;
    if (!codigo.trim()) {
        outputArea.textContent = '⚠️ Ingrese instrucciones.';
        return;
    }
    outputArea.textContent = 'Analizando léxico y sintáctico...';
    try {
        const response = await fetch('/compile-full', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo })
        });
        const data = await response.json();
        // Salida general
        if (data.success) {
            outputArea.textContent = '✅ Análisis completo exitoso. AST generado.';
        } else if (data.allErrors.length > 0) {
            outputArea.textContent = `❌ Se encontraron ${data.allErrors.length} error(es). Revisa los paneles de errores.`;
        } else {
            outputArea.textContent = '❌ Ocurrió un error desconocido.';
        }
        // Paneles de resultados
        tokensPre.textContent = JSON.stringify(data.tokens, null, 2);
        astPre.textContent = JSON.stringify(data.ast, null, 2);
        movesPre.textContent = JSON.stringify(data.robotMoves, null, 2);
        // Paneles de errores
        if (lexicalErrorsPre) {
            lexicalErrorsPre.textContent = data.lexicalErrors.length ? JSON.stringify(data.lexicalErrors, null, 2) : 'Sin errores léxicos.';
        }
        if (syntacticErrorsPre) {
            syntacticErrorsPre.textContent = data.syntacticErrors.length ? JSON.stringify(data.syntacticErrors, null, 2) : 'Sin errores sintácticos.';
        }

        if (semanticErrorsPre) {
            // Se asegura que el panel de errores semánticos se actualice correctamente,
            // mostrando el mensaje esperado cuando no hay errores.
            if (data.semanticErrors && data.semanticErrors.length > 0) {
                semanticErrorsPre.textContent = JSON.stringify(data.semanticErrors, null, 2);
            } else {
                semanticErrorsPre.textContent = 'Sin errores semánticos.';
            }
        }
        // Guardar movimientos para simulación
        if (data.robotMoves) {
            sessionStorage.setItem('robotMoves', JSON.stringify(data.robotMoves));
        }
    } catch (err) {
        outputArea.textContent = 'Error de conexión con el servidor.';
        console.error(err);
    }
};

// Botones de tablas
document.getElementById('commandsBtn').onclick = () => commandsModal.style.display = 'block';
document.getElementById('errorsBtn').onclick = () => errorsModal.style.display = 'block';
document.querySelectorAll('.close').forEach(btn => {
    btn.onclick = () => {
        commandsModal.style.display = 'none';
        errorsModal.style.display = 'none';
        robotModal.style.display = 'none';
        document.getElementById('robotFrame').src = 'about:blank'; // Detiene la simulación
    };
});
window.onclick = (e) => {
    if (e.target === commandsModal) commandsModal.style.display = 'none';
    if (e.target === errorsModal) errorsModal.style.display = 'none';
    if (e.target === robotModal) {
        robotModal.style.display = 'none';
        document.getElementById('robotFrame').src = 'about:blank'; // Detiene la simulación
    }
};

// Ver movimiento del robot
document.getElementById('robotBtn').onclick = () => {
    document.getElementById('robotFrame').src = 'robot.html'; // Carga la simulación
    robotModal.style.display = 'block';
};

cargarComandos();
cargarErrores();