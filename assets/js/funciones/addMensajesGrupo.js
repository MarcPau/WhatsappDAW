import * as app from './app.js';
import { estadoMensajeGrupo } from './estadoMensajeGrupo.js';


export async function addMensajesGrupo() {
    let chat = document.getElementById("chat-window");
    let fechaDuplicada;
    if (sessionStorage.getItem("offset")){
        sessionStorage.setItem("offset", parseInt(sessionStorage.getItem("offset")) + 10);
        fechaDuplicada = chat.firstElementChild;
    }else{
        sessionStorage.setItem("offset",0);
    }
    let grupo = sessionStorage.getItem("id-grupo");
    let datos = [grupo, sessionStorage.getItem("offset")];
    let mensajes = await app.getApi("mensajes-grupo", datos);
    let div,p,fecha,hora,fechaCompleta,divFecha;
    let ultimaFecha = "";
    let alturaBarra = chat.scrollHeight;
    mensajes.forEach(mensaje => {
        div = document.createElement("div");
        div.setAttribute("id-mensaje",mensaje.id_mensaje);
        if (localStorage.getItem("mi-id")!=mensaje.id_emisor) {
            p = document.createElement("p");
            p.classList.add("font-bold");
            p.innerText = mensaje.username;
            div.appendChild(p);
        }
        p = document.createElement("p");
        p.innerText = mensaje.mensaje;
        div.appendChild(p);
        p = document.createElement("p"); //Lo hago en este orden porque es necesario para no crear nuevas variables
        div.appendChild(p);

        //Añadimos la hora y el estilo al estatus
        p.classList.add("text-xs","text-right");
        fechaCompleta = new Date (mensaje.fecha_envio);
        // Obtener solo la parte de la fecha sin la hora
        fecha = fechaCompleta.toLocaleDateString("es-ES"); 
        if (ultimaFecha !== fecha) { // Si la fecha es diferente a la última mostrada
            if (divFecha){
                chat.prepend(divFecha);
            }
            divFecha = document.createElement("div");
            divFecha.classList.add("flex","justify-center","bg-gray-500/25","w-1/6","mx-auto","border","rounded-full","dark:bg-gray-600/25","text-[var(--text-color)]");
            switch (fecha) {
                case new Date().toLocaleDateString("es-Es"):
                    divFecha.innerText = "Hoy";
                    break;
                case new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString("es-ES"): //Fecha de ayer
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
            hour12: false //Para formato 24h
        });
        p.innerText = hora;

        //Ponemos estilo de mensaje dependiendo de si es emisor o receptor y el estado, depende tambien de lo mismo
        if (localStorage.getItem("mi-id")!=mensaje.id_emisor){
            div.classList.add("bg-[var(--secondary-color)]", "p-2", "rounded-lg", "max-w-xs","text-[var(--text-color)]");
        }else{
            div.classList.add("bg-[var(--primary-color)]", "p-2" ,"rounded-lg","max-w-xs",  "ml-auto","text-[var(--text-color)]");
            div.addEventListener("contextmenu",estadoMensajeGrupo);
        }
        
        chat.prepend(div); //Lo inserta en orden inverso, de modo que muestra el mas reciente abajo

    });
    let nuevaAltura = chat.scrollHeight;
    chat.scrollTop += (nuevaAltura-alturaBarra);
    if (divFecha) {
        chat.prepend(divFecha);
    }
}