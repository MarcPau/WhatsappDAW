import * as app from './app.js';
import { enviarMensajeUsuario } from './enviarMensajeUsuario.js';
import { enviarMensajeGrupo } from './enviarMensajeGrupo.js';
import { addMensajesGrupo } from './addMensajesGrupo.js';
import { comprobarScrollGrupo } from './comprobarScrollGrupo.js';
import { comprobarScroll } from './comprobarScroll.js';

export async function abrirChatGrupo(event) {
    let li = event.target.closest("li");
    let grupo = li.getAttribute("id-grupo");

    if (sessionStorage.getItem("id-grupo")==null){
        let texto = document.getElementById("mensaje-input");
        let botonEnviar =texto.nextElementSibling;
        texto.addEventListener("keyup",enviarMensajeGrupo);
        texto.removeEventListener("keyup",enviarMensajeUsuario);
        botonEnviar.addEventListener("click",enviarMensajeGrupo);
        botonEnviar.removeEventListener("click",enviarMensajeUsuario);
    }
    sessionStorage.setItem("id-grupo",grupo);
    sessionStorage.removeItem("id-amigo");
    sessionStorage.removeItem("offset");
    let nombre = li.getAttribute("grupo");
    let datos = [grupo];
    let esAdmin = await app.getApi("es-admin",datos);
    // Actualiza el encabezado del chat
    let chatHeader = document.getElementById("chat-header");
    chatHeader.querySelector('span').innerText = nombre;
    let img = chatHeader.querySelector('img');
    img.src = li.querySelector("img").src;
    img.alt = "foto de grupo";
    img.classList.remove("hidden");
        
    // Comprobamos admins
    if(esAdmin){
        chatHeader.querySelector('div.relative').classList.remove('hidden');
    }else{     
        chatHeader.querySelector('div.relative').classList.add('hidden');
    }
    chatHeader.querySelector("div:nth-of-type(2) > button").classList.remove("hidden");
        
    let chat = document.getElementById("chat-window");
    chat.innerHTML="";
    await addMensajesGrupo();
    datos = {
        id_emisor: grupo
    }
    await app.putApi("cambio-estado-grupo");
    await app.putApi("cambio-estado-grupo", datos);
    chat.removeEventListener("scroll", comprobarScroll);
    chat.addEventListener("scroll", comprobarScrollGrupo);
    chat.scrollTop = chat.scrollHeight * 0.9;
    if (window.innerWidth < 768) {
        document.getElementById('chat-list').classList.add('hidden');
        document.getElementById('chat-container').classList.remove('hidden');
    }
}