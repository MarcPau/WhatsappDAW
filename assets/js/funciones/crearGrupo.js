import * as app from './app.js';
import { lista } from './lista.js';
import  {wsClient} from '../main_js/mainChat.js'

export async function crearGrupo() {
    let div = document.getElementById("menuGenerico");
    let grupo = div.querySelector("input").value;
    if (grupo.trim()=="") {
        return
    }
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
    let grupoId = await app.postApi("crear-grupo", datos);
    grupoId = `grupo_${grupoId.id}`;
    wsClient.connectWebSocket(grupoId);
    await lista();
    return "ok";

}