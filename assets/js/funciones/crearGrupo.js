import * as app from './app.js';
import { listaGrupos } from './listaGrupos.js';

export async function crearGrupo() {
    let div = document.getElementById("menuGenerico");
    let grupo = div.querySelector("input").value;
    let checkbox = document.querySelectorAll('input[name="usuarios"]:checked');
    let usuarios = [];

    checkbox.forEach(usuario => {

        usuarios.push(usuario.value); //El valor del user va a ser la id
        
   });

    let datos = {

        nombre_grupo: grupo,
        id_usuarios: usuarios

   };
    document.getElementById("cortina").classList.add("hidden");
    await app.postApi("crear-grupo", datos);
    await listaGrupos();
    return "ok";

}