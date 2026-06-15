const codeInput = document.getElementById('codeInput');
const compileBtn = document.getElementById('compileBtn');
const outputArea = document.getElementById('outputArea');
const tokensPre = document.getElementById('tokensPre');
const errorsPre = document.getElementById('errorsPre');
const movesPre = document.getElementById('movesPre');

// Modales
const commandsModal = document.getElementById('commandsModal');
const errorsModal = document.getElementById('errorsModal');
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
    outputArea.textContent = 'Analizando léxicamente...';
    try {
        const response = await fetch('/analizar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo })
        });
        const data = await response.json();
        // Mostrar salida general
        const hasErrors = data.errors && data.errors.length > 0;
        if (hasErrors) {
            outputArea.textContent = '❌ Se encontraron errores léxicos. Revisa el panel de errores.';
        } else {
            outputArea.textContent = '✅ Análisis léxico completado. Tokens generados correctamente.';
        }
        // Actualizar paneles
        tokensPre.textContent = JSON.stringify(data.tokens, null, 2);
        errorsPre.textContent = data.errors.length ? JSON.stringify(data.errors, null, 2) : 'No hay errores';
        movesPre.textContent = JSON.stringify(data.robotMoves, null, 2);
        // Guardar movimientos en sessionStorage para la simulación del robot
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
    };
});
window.onclick = (e) => {
    if (e.target === commandsModal) commandsModal.style.display = 'none';
    if (e.target === errorsModal) errorsModal.style.display = 'none';
};

// Ver movimiento del robot (abrir nueva ventana con simulación)
document.getElementById('robotBtn').onclick = () => {
    window.open('robot.html', '_blank', 'width=900,height=700');
};

cargarComandos();
cargarErrores();