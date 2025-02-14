import * as app from './app.js';
import {abrirChatGrupo} from './abrirChatGrupo.js';

export async function listaGrupos() {

    let ul = document.getElementById("listaGeneral");
    ul.querySelectorAll("li[id-grupo]").forEach(grupo =>{
        grupo.remove();
    });
    let grupos =  await app.getApi("lista-grupos");
    let li, foto, nombre;

    grupos.forEach(grupo => {
        // Crear elementos
        li = document.createElement('li');
        foto = document.createElement('img');
        nombre = document.createElement('p');
        
        // Rellenar datos
        li.setAttribute('id-grupo', grupo.id);
        li.setAttribute('grupo', grupo.grupo);
        foto.src = '../assets/img/grupo.png';//Url
        foto.alt = "foto de grupo";
        nombre.innerText = grupo.grupo;
    
        // Añadimos estilos
        foto.classList.add("w-[50px]","h-[50px]" ,"rounded-full","object-cover","me-5");
        li.classList.add("flex","items-center","font-semibold", "text-[var(--text-color)]", "border-b","border-[var(--secondary-color)]","p-4","text-center","select-none","hover:bg-[var(--secondary-color)]","hover:cursor-pointer");

        // Añadir al DOM
        ul.appendChild(li);
        li.appendChild(foto);
        li.appendChild(nombre);
        li.addEventListener("click",abrirChatGrupo);
        
   });

}