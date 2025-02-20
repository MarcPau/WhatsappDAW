import * as app from './app.js';
import { lista } from './lista.js';

export async function cambiarNombreGrupo() {
    let div = document.getElementById("menuGenerico");
    let grupo = div.querySelector("input").value;
    if (grupo.trim()=="") {
        return
    }
    let datos = {

        id_grupo: sessionStorage.getItem("id-grupo"),
        nombre_grupo: grupo

   };
    document.getElementById("cortina").classList.add("hidden");
    await app.putApi("cambiar-nombre-grupo", datos);
    await lista();
    grupo = sessionStorage.getItem("id-grupo");
    let li = document.querySelector(`li[id-grupo='${grupo}']`);
    li.dispatchEvent(new Event("click"));
    return "okay"
   
}