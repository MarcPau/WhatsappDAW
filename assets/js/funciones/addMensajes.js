import * as app from './app.js';

export async function addMensajes() {
    let chat = document.getElementById("chat-window");
    let fechaDuplicada;
    if (sessionStorage.getItem("offset")){
        sessionStorage.setItem("offset", parseInt(sessionStorage.getItem("offset")) + 10);
        fechaDuplicada = chat.firstElementChild;
    }else{
        sessionStorage.setItem("offset",0);
    }
    let amigo = sessionStorage.getItem("id-amigo");
    let datos = [amigo, sessionStorage.getItem("offset")];
    let mensajes = await app.getApi("mensajes-usuario", datos);
    let div, p, fecha, hora, estado,fechaCompleta,divFecha;
    let ultimaFecha="";
    let alturaBarra = chat.scrollHeight;

    mensajes.forEach(mensaje => {
        div = document.createElement("div");
        p = document.createElement("p");
        p.innerText = mensaje.mensaje;
        div.appendChild(p);

        p = document.createElement("p"); // Añadir la hora del mensaje
        div.appendChild(p);
        p.classList.add("text-xs", "text-right");
        fechaCompleta = new Date(mensaje.fecha_envio);
        // Obtener solo la parte de la fecha sin la hora
        fecha = fechaCompleta.toLocaleDateString("es-ES"); 
        if (ultimaFecha !== fecha) { // Si la fecha es diferente a la última mostrada
            if (divFecha){
                chat.prepend(divFecha);
            }
            divFecha = document.createElement("div");
            divFecha.classList.add("flex","justify-center","bg-gray-500/25","w-1/6","mx-auto","border","rounded-full","dark:bg-gray-600/25","text-[var(--text-color)]", "max-w-32","min-w-24");
            switch (fecha) {
                case new Date().toLocaleDateString("es-Es"):
                    divFecha.innerText = "Hoy";
                    break;
                case new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString("es-ES"):
                    divFecha.innerText = "Ayer";
                    break;
                default:
                    divFecha.innerText = fecha;
                    break;
            }
            // Pintamos la fecha formateada
            ultimaFecha = fecha; // Actualizamos la última fecha mostrada
            if (fechaDuplicada && fechaDuplicada.innerText==divFecha.innerText){
                fechaDuplicada.remove();
                fechaDuplicada = null;
            }
        }
        hora = fechaCompleta.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
        p.innerText = hora;

        // Estilos según el emisor del mensaje
        if (mensaje.id_emisor == amigo) {
            div.classList.add("bg-[var(--secondary-color)]", "p-2", "rounded-lg", "max-w-xs","text-[var(--text-color)]");
        } else {
            div.classList.add("bg-[var(--primary-color)]", "p-2", "rounded-lg", "max-w-xs", "ml-auto","text-[var(--text-color)]");

            switch (mensaje.estado) {
                case "entregado":
                    estado = "✔";
                    break;
                case "leido":
                    estado = "✔✔";
                    break;
                default:
                    estado = "⏳";
                    break;
            }
            p.innerText = `${p.innerText} ${estado}`;
        }

        chat.prepend(div);
    });
    let nuevaAltura = chat.scrollHeight;
    chat.scrollTop += (nuevaAltura-alturaBarra);
    if (divFecha) {
        chat.prepend(divFecha);
    }

}