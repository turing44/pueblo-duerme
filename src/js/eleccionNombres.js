const jugadoresMinimosParaEmpezar = 5;

const inputsJugadores = document.getElementById("inputs-jugadores");
const btnAgregarNuevoJugador = document.getElementById("agregar-nuevo-jugador");
const formulario = document.getElementById("formulario-jugadores");
const botonEnviarFormulario = document.getElementById("boton-enviar-formulario");


let contadorJugadores = 0;
botonEnviarFormulario.style.display = 'none';

btnAgregarNuevoJugador.addEventListener("click", () => {
    const nuevoCampo = document.createElement("nuevoCampo");

    contadorJugadores++;

    // le especifico la clase para luego meter en un array todos los inputs que tenga esa clase
    nuevoCampo.innerHTML =
        `<input 
        type="text" 
        placeholder="Nombre del jugador ${contadorJugadores}" 
        class="input-nombre" 
        id="jugador-${contadorJugadores}" 
        required>
        `;

    inputsJugadores.appendChild(nuevoCampo);

    if (contadorJugadores >= jugadoresMinimosParaEmpezar) {
        botonEnviarFormulario.style.display = 'block';
    }
});

formulario.addEventListener("submit", e => {
    e.preventDefault(); // los formularios por defecto al hacer submit recargan la pagina,
                        // ponemos esto para que no lo haga


    const inputs = document.querySelectorAll(".input-nombre");

    const listaNombres = Array.from(inputs)
        .map(input => input.value.trim());

    localStorage.setItem("listaNombres", JSON.stringify(listaNombres));


    console.log("Nombres: ", localStorage.listaNombres);
    window.location.href = "./dashboardPersonajes.html";
});
