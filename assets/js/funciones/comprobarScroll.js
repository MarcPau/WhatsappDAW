import { addMensajes } from "./addMensajes.js";

let scrollTimeout; // Variable global para el timeout

export function comprobarScroll() {
    let chat = document.getElementById("chat-window");

    // Cancela el timeout anterior si el usuario sigue haciendo scroll
    clearTimeout(scrollTimeout);

    // Establece un nuevo timeout para ejecutar la función después de 500ms
    scrollTimeout = setTimeout(async () => {
        if (chat.scrollTop === 0) {
            await addMensajes(); // Cargar más mensajes si el usuario llega arriba
        }
    }, 500);
}
