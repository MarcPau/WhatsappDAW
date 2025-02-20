import * as app from './app.js';

export async function enviarMensajeUsuario(event) {
    if(event.type == "keyup" && event.key != "Enter"){
        return;
    }
    let amigo = sessionStorage.getItem("id-amigo");
    let mensaje = document.getElementById("mensaje-input");
    if(mensaje.value.trim() != ""){
        let datos = {
            mensaje : mensaje.value,
            id_receptor: amigo
        }
        await app.postApi("enviar-mensaje-usuario", datos);
        mensaje.value = "";
        let li = document.querySelector(`li[id-amigo='${amigo}']`);
        li.dispatchEvent(new Event("click"));

    }else{
        mensaje.value = "";
    }
}