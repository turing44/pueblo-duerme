// ICONOS
const imgMuerto = "https://img.icons8.com/?size=100&id=5DxlE3Q32K0Q&format=png&color=000000";
const imgOjo = "https://img.icons8.com/?size=100&id=60022&format=png&color=000000";

// ELEMENTOS DEL DOM
const contenedorPrincipal = document.getElementById("contenedor-principal");
const cabeceraFase = document.getElementById("fase");


// INSTANCIA DEL JUEGO
const juego = new Juego();
juego.iniciarJuego();
mostrarJugadores();
cabeceraFase.innerHTML = "VER ROLES";


//ocultar checkbox votar
let faseVerRoles = true;
const jugadoresQueVieronRol = new Set();

document.getElementById("boton-matar").innerHTML = "COMENZAR";



// FUNCIONES PRINCIPALES
function mostrarJugadores() {
    contenedorPrincipal.innerHTML = "";

    const formulario = crearFormularioVotacion();

    for (let jugador of juego.getListaJugadores()) {
        const cuadroJugador = crearCuadroJugador(jugador, formulario.listaCheckboxes);
        formulario.elemento.appendChild(cuadroJugador);
    }

    const boton = crearBotonMatar(formulario.listaCheckboxes);
    formulario.elemento.appendChild(boton);

    contenedorPrincipal.appendChild(formulario.elemento);
}

function logicaElegido(nombre) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: "¿Estás seguro/a?",
        text: `¿Quieres matar a ${nombre}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "¡Sí, matar!",
        cancelButtonText: "No, he cambiado de opinión",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Llamamos correctamente a matar() sin modificar el estado directamente.
            juego.matarJugador(nombre);

            swalWithBootstrapButtons.fire({
                title: "¡Asesinato completado!",
                text: `${nombre} ha muerto`,
                icon: "success"
            }).then(() => {
                // Ejecutamos siguienteFase después del mensaje de éxito
                siguienteFase();
            });

        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                title: "Cancelado",
                text: "Dale otra vuelta a la elección tu víctima",
                icon: "error"
            });
        }
    });
}



function siguienteFase() {
    const estado = juego.comprobarVictoria();

    if (estado === "AUN HAY LOBOS") {
        if (!["NOCHE", "DIA"].includes(cabeceraFase.innerHTML)) { // para la primera fase de ver roles
            activarModoNoche();
        } else if (cabeceraFase.innerHTML === "NOCHE") {
            activarModoDia();
        } else if (cabeceraFase.innerHTML === "DIA") {
            activarModoNoche();
        }

        mostrarJugadores();
    } else {
        contenedorPrincipal.innerHTML = `<h1><center>${estado}</center></h1>`;
    }
}

// COMPONENTES DEL JUEGO

function crearFormularioVotacion() {
    const form = document.createElement("form");
    const listaCheckboxes = [];
    return { elemento: form, listaCheckboxes };
}

function crearCuadroJugador(jugador, listaCheckboxes) {
    const nombre = jugador.getNombre();
    const estaVivo = jugador.estaVivo();

    const contenedor = document.createElement("div");
    contenedor.id = `cuadro-${nombre}`;
    contenedor.innerHTML = estaVivo
        ? nombre
        : `<img src="${imgMuerto}" alt="muerto"> ${nombre}`;

    const checkbox = crearCheckbox(nombre, estaVivo, listaCheckboxes);
    const botonVerRol = crearBotonVerRol(nombre, jugador);

    contenedor.appendChild(checkbox);
    contenedor.appendChild(botonVerRol);

    return contenedor;
}

function crearCheckbox(nombre, estaVivo, listaCheckboxes) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "voto";
    checkbox.className = "boton-votar"
    checkbox.id = `voto-${nombre}`;
    checkbox.disabled = !estaVivo;

    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            listaCheckboxes.forEach(cb => {
                if (cb !== checkbox) cb.checked = false;
            });
        }
    });

    if (!["NOCHE", "DIA"].includes(cabeceraFase.innerHTML)) {
        checkbox.style.display = 'none';
    }

    listaCheckboxes.push(checkbox);
    return checkbox;
}

function crearBotonVerRol(nombre, jugador) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.innerHTML = `<img src="${imgOjo}" alt="ver rol">`;
    boton.addEventListener("click", () => {
        if (faseVerRoles && !jugadoresQueVieronRol.has(nombre)) {
            Swal.fire(`${nombre} es ${jugador.getRol()}`);
            jugadoresQueVieronRol.add(nombre);
            boton.disabled = true; //Desactiva el botón después de verlo
        } else if (faseVerRoles) {
            Swal.fire({
                icon: "info",
                title: "Ya viste tu rol",
                text: "Solo puedes verlo una vez."
            });
        }
    });
    return boton;
}

function crearBotonMatar(listaCheckboxes) {
    const boton = document.createElement("button");
    boton.type = "submit";
    boton.id = "boton-matar";
    boton.textContent = "MATAR";

    boton.addEventListener("click", (e) => {
        e.preventDefault();

        const seleccionado = listaCheckboxes.find(cb => cb.checked);

        if (seleccionado) {
            const nombre = seleccionado.id.replace("voto-", "");
            logicaElegido(nombre);
        } else {
            // controlo aqui que no sea la primera fase, la de ver roles
            if (boton.textContent === "MATAR") {
                Swal.fire({
                    icon: "error",
                    title: "Selecciona a alguien",
                    text: "Debes seleccionar a alguien para votar",
                });
            }
            else {
                siguienteFase();
                faseVerRoles = false;
            }

        }
    });

    return boton;
}

// MODOS DE FASE

function activarModoNoche() {
    cabeceraFase.innerHTML = "NOCHE";
    setTimeout(() => {
        document.getElementById("sonidoLobo").play()
    },1000);
}

function activarModoDia() {
    cabeceraFase.innerHTML = "DIA";
    setTimeout(() => {
        document.getElementById("sonidoAldeano").play()
    },1000);

}

