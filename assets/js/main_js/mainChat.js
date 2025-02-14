import * as app from '../funciones/app.js';
import {listaAmigos} from '../funciones/listaAmigos.js';
import {listaGrupos} from '../funciones/listaGrupos.js';
import {eliminarYoGrupo} from '../funciones/eliminarYoGrupo.js';
import {menuCrearGrupo} from '../modificadores_DOM/menuCrearGrupo.js';
import {menuAddUsuarios} from '../modificadores_DOM/menuAddUsuarios.js';
import {menuEliminarUsuario} from '../modificadores_DOM/menuEliminarUsuarios.js';
import {menuAddUsuario} from '../modificadores_DOM/menuAddAdmin.js';
import {menuCambioNombre} from '../modificadores_DOM/menuCambioNombre.js';
import {logout} from '../funciones/logout.js';
document.addEventListener("DOMContentLoaded", async () => {
    if(!localStorage.getItem("mi-id")){
        window.location.href = "./login.html";
    }
    // Elementos del DOM
    let menuButton = document.getElementById("menuButton");
    let menuButton2 = document.getElementById("menuButton2");
    let darkButton = document.getElementById("darkButton");
    let searchButton = document.getElementById("searchButton");
    let searchQuery = document.getElementById("searchBar");
    let svgIcon = document.querySelector("#nuevoGrupoButton svg");
    let botonCancelar = document.getElementById("botonCancelar");
    let menuGrupo = document.getElementById("nuevoGrupoButton");
    let chatHeader = document.getElementById("chat-header").lastElementChild.lastElementChild;
    // Event Listeners
    menuButton.addEventListener("click", cambiarMenu);
    menuButton2.addEventListener("click", cambiarMenu);
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
    menuButton2.nextElementSibling.querySelectorAll("button")[2].addEventListener("click", menuAddUsuario);
    menuButton2.nextElementSibling.querySelectorAll("button")[3].addEventListener("click", menuCambioNombre);
    menuButton.nextElementSibling.lastElementChild.addEventListener("click", logout);
    // Cargamos funciones por defecto
    await listaAmigos();
    await listaGrupos();
    await app.putApi("cambio-estado");
    await app.putApi("cambio-estado-grupo");

    // Aplicar el modo guardado al cargar la página
    aplicarModoGuardado();
    sessionStorage.clear();

    // Actualizar el icono del SVG según el modo actual
    cambiarColorSVG();

    // Iniciar el cambio de fondo
    iniciarCambioFondo();
});

// Hace que al clicar fuera se cierre el menu de settings
function clicarFuera(event) {
    let menu = document.getElementById("menuButton").nextElementSibling;
    let menu2 = document.getElementById("menuButton2").nextElementSibling;
    if ((!menu.contains(event.target) && event.target !== menuButton) && (!menu2.contains(event.target) && event.target !== menuButton2)) {
        menuButton.nextElementSibling.classList.add("hidden");
        menuButton2.nextElementSibling.classList.add("hidden");
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
    let isDarkMode = $htmlElement.toggleClass('dark').hasClass('dark');

    // Guardar en localStorage
    localStorage.setItem('tema', isDarkMode ? 'oscuro' : 'claro');

    // Actualizar el botón e icono
    actualizarBotonModo();
    cambiarColorSVG();
}

// Actualizar el texto del botón según el modo
function actualizarBotonModo() {
    let $darkButton = $('#darkButton');
    if ($('html').hasClass('dark')) {
        $darkButton.html('🌙 Oscuro');
    } else {
        $darkButton.html('☀️ Claro');
    }
}

// Aplicar el modo guardado al cargar
function aplicarModoGuardado() {
    let tema = localStorage.getItem('tema');
    $('html').toggleClass('dark', tema === 'oscuro');
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
    let menu = event.target.nextElementSibling;
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