import * as app from './app.js';

export async function enviarMensajeGrupo(event) {
    if(event.type == "keyup" && event.key != "Enter"){
        return;
    }
    let grupo = sessionStorage.getItem("id-grupo");
    let mensaje = document.getElementById("mensaje-input");
    if (mensaje.value.trim() != ""){
        let datos = {
            mensaje : mensaje.value,
            id_receptor: grupo
        }
        await app.postApi("enviar-mensaje-grupo", datos);
        mensaje.value = "";
        let li = document.querySelector(`li[id-grupo='${grupo}']`);
        li.dispatchEvent(new Event("click"));
    }
}
