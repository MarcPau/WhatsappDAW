import * as app from '../funciones/app.js';
import {lista} from '../funciones/lista.js';
import {eliminarYoGrupo} from '../funciones/eliminarYoGrupo.js';
import {menuCrearGrupo} from '../modificadores_DOM/menuCrearGrupo.js';
import {menuAddUsuarios} from '../modificadores_DOM/menuAddUsuarios.js';
import {menuEliminarUsuario} from '../modificadores_DOM/menuEliminarUsuarios.js';
import {menuAddAdmin} from '../modificadores_DOM/menuAddAdmin.js';
import {menuCambioNombre} from '../modificadores_DOM/menuCambioNombre.js';
import {logout} from '../funciones/logout.js';
import {WebSocketClient} from '../funciones/webSocket.js'

export let wsClient;
document.addEventListener("DOMContentLoaded", async () => {
    if(!localStorage.getItem("mi-id")){
        window.location.href = "./login.html";
    }
    // Elementos del DOM
    let menuButton = document.getElementById("menuButton");
    let menuButton2 = document.getElementById("menuButton2");
    let menuButtonAccessibilidad = document.getElementById("menuButtonAccessibilidad");
    let darkButton = document.getElementById("darkButton");
    let searchButton = document.getElementById("searchButton");
    let searchQuery = document.getElementById("searchBar");
    let svgIcon = document.querySelector("#nuevoGrupoButton svg");
    let botonCancelar = document.getElementById("botonCancelar");
    let menuGrupo = document.getElementById("nuevoGrupoButton");
    let chatHeader = document.getElementById("chat-header").lastElementChild.lastElementChild;
    let CambioFuente = menuButtonAccessibilidad.nextElementSibling.firstElementChild;
    let CambioContraste = menuButtonAccessibilidad.nextElementSibling.lastElementChild;
    // Event Listeners
    menuButton.addEventListener("click", cambiarMenu);
    menuButton2.addEventListener("click", cambiarMenu);
    menuButtonAccessibilidad.addEventListener("click", cambiarMenu);
    darkButton.addEventListener("click", cambiarModoOscuro);
    searchButton.addEventListener("click", cambiarBarraBusqueda);
    searchQuery.addEventListener("keyup", (event) => filtrarUsuarios(event, "#listaGeneral"));
    botonCancelar.addEventListener("click", cerrarMenu);
    menuGrupo.addEventListener("click", menuCrearGrupo);
    chatHeader.previousElementSibling.addEventListener("click", eliminarYoGrupo);
    document.addEventListener("click", clicarFuera);
    chatHeader.addEventListener('click', closeChat);
    menuButton2.nextElementSibling.firstElementChild.addEventListener("click", menuAddUsuarios);
    menuButton2.nextElementSibling.querySelectorAll("button")[1].addEventListener("click", menuEliminarUsuario);
    menuButton2.nextElementSibling.querySelectorAll("button")[2].addEventListener("click", menuAddAdmin);
    menuButton2.nextElementSibling.querySelectorAll("button")[3].addEventListener("click", menuCambioNombre);
    menuButton.nextElementSibling.lastElementChild.addEventListener("click", logout);
    CambioFuente.addEventListener("click",cambiarTamañoFuente);
    CambioContraste.addEventListener("click" , cambiarModoAltoContraste);
    // Cargamos funciones por defecto
    await lista();
    await app.putApi("cambio-estado");
    await app.putApi("cambio-estado-grupo");

    // Aplicar el modo guardado al cargar la página
    aplicarModoGuardado();
    sessionStorage.clear();
    sessionStorage.setItem("size",1.0);

    // Actualizar el icono del SVG según el modo actual
    cambiarColorSVG();

    // Iniciar el cambio de fondo
    iniciarCambioFondo();

    // Ejemplo de inicialización
    let userId = localStorage.getItem("mi-id");
    let lis = document.querySelectorAll(`li[id-grupo]`);
    let userGroups = [];
    lis.forEach(li => {
        userGroups.push(`grupo_${li.getAttribute("id-grupo")}`);
    });
     wsClient = new WebSocketClient(userId, userGroups);

});

// Hace que al clicar fuera se cierre el menu de settings
function clicarFuera(event) {
    let menuButton = document.getElementById("menuButton");
    let menuButton2 = document.getElementById("menuButton2");
    let menuButtonAccessibilidad = document.getElementById("menuButtonAccessibilidad");
    let menu = menuButton.nextElementSibling;
    let menu2 = menuButton2.nextElementSibling;
    let menuAccessibilidad =menuButtonAccessibilidad.nextElementSibling;
    if ((!menu.contains(event.target) && event.target !== menuButton) && (!menu2.contains(event.target) && event.target !== menuButton2)) {
        menu.classList.add("hidden");
        menu2.classList.add("hidden");
    }
    if (!menuAccessibilidad.contains(event.target.closest("button")) && event.target.closest("button") !== menuButtonAccessibilidad) {
        menuAccessibilidad.classList.add("hidden");
    }
    let menuEstado = document.getElementById("menuEstado");
    if (!menuEstado.contains(event.target)){
        document.getElementById("cortina2").classList.add("hidden");
    }
}

// Función para cambiar el modo oscuro y actualizar el botón
function cambiarModoOscuro() {
    let $darkButton = $('#darkButton');
    let $htmlElement = $('html');

    // Si está en modo alto contraste, solo cambia el estado sin aplicarlo visualmente
    if ($htmlElement.hasClass("high-contrast")) {
        let nuevoModo = localStorage.getItem("modoAntesAltoContraste") === "oscuro" ? "claro" : "oscuro";
        localStorage.setItem("modoAntesAltoContraste", nuevoModo);

        // 🔹 ACTUALIZA EL TEXTO DEL BOTÓN INCLUSO SI ESTÁ EN ALTO CONTRASTE
        actualizarBotonModo();
        cambiarColorSVG();
        return; // Salimos sin aplicar visualmente el cambio
    }

    // Cambio de modo real cuando NO está en alto contraste
    let isDarkMode = $htmlElement.toggleClass('dark').hasClass('dark');
    localStorage.setItem('tema', isDarkMode ? 'oscuro' : 'claro');

    actualizarBotonModo();
    cambiarColorSVG();
}



// Actualizar el texto del botón según el modo
function actualizarBotonModo() {
    let $darkButton = $('#darkButton');
    let tema = localStorage.getItem("tema");

    // 🔹 SI ESTAMOS EN ALTO CONTRASTE, LEEMOS EL MODO GUARDADO
    if (tema === "alto-contraste") {
        let modoAnterior = localStorage.getItem("modoAntesAltoContraste") || "claro";
        $darkButton.html(modoAnterior === "oscuro" ? "🌙 Oscuro" : "☀️ Claro");
        return;
    }

    // 🔹 SI NO ESTAMOS EN ALTO CONTRASTE, SE ACTUALIZA NORMALMENTE
    if ($('html').hasClass('dark')) {
        $darkButton.html('🌙 Oscuro');
    } else {
        $darkButton.html('☀️ Claro');
    }
}


// Aplicar el modo guardado al cargar
function aplicarModoGuardado() {
    let tema = localStorage.getItem("tema");

    if (tema === "alto-contraste") {
        $("html").addClass("high-contrast").removeClass("dark");
    } else {
        $("html").removeClass("high-contrast").toggleClass("dark", tema === "oscuro");
    }

    actualizarBotonModo();
}



// Función para cerrar el menú flotante
function cerrarMenu() {
    document.getElementById("cortina").classList.add("hidden");
}
// Cambiar color del SVG según el modo
function cambiarColorSVG() {
    let svgIcon = document.querySelector("#nuevoGrupoButton svg");
    if (document.documentElement.classList.contains("dark")) {
        svgIcon.style.stroke = "#ffffff";
        svgIcon.style.fill = "#ffffff";
    } else {
        svgIcon.style.stroke = "#000000";
        svgIcon.style.fill = "#000000";
    }
}

// Mostrar/ocultar barra de búsqueda
function cambiarBarraBusqueda() {
    let searchBar = document.getElementById("searchBar");
    searchBar.classList.toggle("hidden");
    if (!searchBar.classList.contains("hidden")) {
        searchBar.focus();
    }
    searchBar.value = "";
    searchBar.dispatchEvent(new Event("keyup"));
}

// Mostrar/ocultar menú de configuración
function cambiarMenu(event) {
    let menu = event.target.closest("button").nextElementSibling;
    menu.classList.toggle("hidden");
}

// Filtrar amigos en la lista
export function filtrarUsuarios(event, identificador) {
    let searchQuery = event.target.value.toLowerCase();
    identificador = `${identificador} li`;
    let lista = document.querySelectorAll(identificador);

    lista.forEach(elemento => {
        let nombre = elemento.getElementsByTagName("p")[0].innerText.toLowerCase();
        elemento.classList.toggle("hidden", !nombre.includes(searchQuery));
    });
}


function cambiarTamañoFuente() {
    let menuButtonAccessibilidad = document.getElementById("menuButtonAccessibilidad");
    let CambioFuente = menuButtonAccessibilidad.nextElementSibling.firstElementChild;
    let newSize;
    switch (parseFloat(sessionStorage.getItem("size"))) {
        case 1.0:
            sessionStorage.setItem("size",1.1);
            newSize = 1.1;
            CambioFuente.innerText = "aA - Grande";
            break;

        case 1.1:
            sessionStorage.setItem("size",1.2);
            newSize = 1.2;
            CambioFuente.innerText = "aA - Gigante";
            break;

        case 1.2:
            sessionStorage.setItem("size",0.9);
            newSize = 0.9;
            CambioFuente.innerText = "aA - Pequeño";
            break;

        default:
            sessionStorage.setItem("size",1.0);
            newSize = 1.0 ;
            CambioFuente.innerText = "aA - Normal";
            break;
    }
    
    let root = document.documentElement;

    // Aplicar el nuevo tamaño
    root.style.setProperty("--font-size", `${newSize}rem`);

}

function cambiarModoAltoContraste() {
    let root = document.documentElement;
    let isHighContrast = root.classList.toggle("high-contrast"); // Activa o desactiva el modo

    if (isHighContrast) {
        // Guardar el estado real antes de aplicar el alto contraste
        let modoActual = localStorage.getItem("tema");
        if (modoActual !== "alto-contraste") {
            localStorage.setItem("modoAntesAltoContraste", modoActual);
        }
        localStorage.setItem("tema", "alto-contraste");

        // Asegurarse de que se quite el modo oscuro para evitar conflictos
        root.classList.remove("dark");
    } else {
        // Obtener el modo que estaba antes del alto contraste
        let modoAnterior = localStorage.getItem("modoAntesAltoContraste") || "claro";

        // Restaurar el modo anterior (oscuro o claro)
        root.classList.toggle("dark", modoAnterior === "oscuro");
        localStorage.setItem("tema", modoAnterior);

        cambiarColorSVG();
    }

    actualizarBotonModo(); // Para actualizar el texto del botón
}




// Cambiar fondo del chat con jQuery
function iniciarCambioFondo() {
    let coloresFondo = ["var(--background-color)", "#f0f8ff", "#fdfd96", "#d3ffd3", "#ffe4e1"];
    let indiceColor = 0;

    // Recuperar el color guardado al cargar la página
    let colorGuardado = localStorage.getItem('chatBackgroundColor');
    if (colorGuardado) {
        $('#chat-container, #chat-window').css('background-color', colorGuardado);
        indiceColor = coloresFondo.indexOf(colorGuardado);
    }

    // Evento para cambiar el fondo al hacer clic en "Cambiar Fondo"
    $('#changeBackgroundButton').on('click', function() {
        indiceColor = (indiceColor + 1) % coloresFondo.length;  // Cambia al siguiente color
        let nuevoColor = coloresFondo[indiceColor];
        $('#chat-container, #chat-window').css('background-color', nuevoColor);


        // Guardar la selección en localStorage para mantenerla después de recargar
        localStorage.setItem('chatBackgroundColor', nuevoColor);
    });
}




function closeChat() {
    if (window.innerWidth < 768) {
        sessionStorage.removeItem("id-amigo");
        sessionStorage.removeItem("id-grupo");
        document.getElementById('chat-container').classList.add('hidden');
        document.getElementById('chat-list').classList.remove('hidden');
    }
}

// No es obligatorio si ya funciona sin configuraciones extras
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
          colors: {
            lightBackground: '#DAD7CD',
            lightPrimary: '#A3B18A',
            lightSecondary: '#588157',
            lightAccent: '#3A5A40',
            lightText: '#344E41',
          },
        },
      },
      plugins: [],
};