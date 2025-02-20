import { addMensajesGrupo } from "./addMensajesGrupo.js";

let scrollTimeoutGrupo; // Variable global para el timeout

export function comprobarScrollGrupo() {
    let chat = document.getElementById("chat-window");

    // Cancela el timeout anterior si el usuario sigue haciendo scroll
    clearTimeout(scrollTimeoutGrupo);

    // Establece un nuevo timeout para ejecutar la función después de 500ms
    scrollTimeoutGrupo = setTimeout(async () => {
        if (chat.scrollTop === 0) {
            await addMensajesGrupo(); // Cargar más mensajes si el usuario llega arriba
        }
    }, 500);
}
