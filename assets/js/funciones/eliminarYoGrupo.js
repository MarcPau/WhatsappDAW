import * as app from './app.js';
import { lista } from './lista.js';

export async function eliminarYoGrupo(){
    let confirma = window.confirm("¿Seguro que desea usted abandonar el Grupo?");

    if(confirma){
        let datos = {

            id_grupo: sessionStorage.getItem("id-grupo"),
            id_usuarios: []
    
        };
        let grupo = sessionStorage.getItem("id-grupo");
        let li = document.querySelector(`li[id-grupo='${grupo}']`).previousElementSibling;
        document.getElementById("cortina").classList.add("hidden");
        await app.deleteApi("eliminar-yo-grupo", datos);
        await lista();
        li.dispatchEvent(new Event("click"));
        return "okay";
    }
}