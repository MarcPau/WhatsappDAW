import * as app from './app.js';

export async function cambiarNombreGrupo() {
    let div = document.getElementById("menuGenerico");
    let grupo = div.querySelector("input").value;

    let datos = {

        id_grupo: sessionStorage.getItem("id-grupo"),
        nombre_grupo: grupo

   };
    document.getElementById("cortina").classList.add("hidden");
    return await app.putApi("cambiar-nombre-grupo", datos);

}