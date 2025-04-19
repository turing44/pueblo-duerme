// limpiamos si hay algo de la partida anterior
localStorage.clear();


function abrirModalNormas(event) {
    event.preventDefault();
    const modalNormas = new bootstrap.Modal(document.getElementById('normasModal'));
    modalNormas.show();
}

function marcarCheck() {
    const check = document.getElementById('checkNormas');
    check.checked = true;
    actualizarBoton();
}

function desmarcarCheck() {
    const check = document.getElementById('checkNormas');
    check.checked = false;
    actualizarBoton();
}

function actualizarBoton() {
    const check = document.getElementById('checkNormas');
    const boton = document.getElementById('jugarBtn');
    boton.disabled = !check.checked;
}

function irAJugar() {
    const check = document.getElementById('checkNormas');
    if (check.checked) {
        window.location.href = './src/pages/eleccionNombres.html';
    }
}
