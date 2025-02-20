import * as app from './app.js';
import { enviarMensajeUsuario } from './enviarMensajeUsuario.js';
import { enviarMensajeGrupo } from './enviarMensajeGrupo.js';
import { addMensajes } from './addMensajes.js';
import { comprobarScrollGrupo } from './comprobarScrollGrupo.js';
import { comprobarScroll } from './comprobarScroll.js';

export async function abrirChat(event) {
    let li = event.target.closest("li");
    let amigo = li.getAttribute("id-amigo");

    if (sessionStorage.getItem("id-amigo")==null){
        let texto = document.getElementById("mensaje-input");
        let botonEnviar =texto.nextElementSibling;
        texto.removeEventListener("keyup",enviarMensajeGrupo);
        texto.addEventListener("keyup",enviarMensajeUsuario);
        botonEnviar.removeEventListener("click",enviarMensajeGrupo);
        botonEnviar.addEventListener("click",enviarMensajeUsuario);
    }
    sessionStorage.setItem("id-amigo", amigo);
    sessionStorage.removeItem("id-grupo");
    sessionStorage.removeItem("offset");

    let nombre = li.getAttribute("usuario");
    
    // Actualiza el encabezado del chat
    let chatHeader = document.getElementById("chat-header");
    chatHeader.querySelector('span').innerText = nombre;
    let img = chatHeader.querySelector('img');
    img.src = li.querySelector("img").src;
    img.alt = "foto de perfil";
    img.classList.remove("hidden");

    chatHeader.querySelector('div.relative').classList.add('hidden');
    chatHeader.querySelector("div:nth-of-type(2) > button").classList.add("hidden");

    // Limpiar ventana del chat y añadir los mensajes
    let chat = document.getElementById("chat-window");
    chat.innerHTML = "";
    await addMensajes();
    let datos = {
        id_emisor: amigo
    }
    await app.putApi("cambio-estado");
    await app.putApi("cambio-estado", datos);
    chat.scrollTop = chat.scrollHeight * 0.9;
    chat.removeEventListener("scroll", comprobarScrollGrupo);
    chat.addEventListener("scroll", comprobarScroll);
    
    let div = li.querySelector("div");
    if (div){
        div.remove();
    }
    
    // Mostrar el chat y ocultar la lista de usuarios en dispositivos móviles
    if (window.innerWidth < 768) {
        document.getElementById('chat-list').classList.add('hidden');
        document.getElementById('chat-container').classList.remove('hidden');
    }


}