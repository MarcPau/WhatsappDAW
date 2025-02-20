import * as app from './app.js';
import {abrirChat} from './abrirChat.js';
import { abrirChatGrupo } from './abrirChatGrupo.js';

 export async function lista(){
    let ul = document.getElementById("listaGeneral");
    ul.innerHTML = "";
    let lista =  await app.getApi("lista");
    
    let li, foto, nombre, pendientes;
    
    lista.forEach(elemento => {
      // Crear elementos
      li = document.createElement("li");
      foto = document.createElement("img");
      nombre = document.createElement("p");
      li.classList.add("flex","items-center","font-semibold","text-[var(--text-color)]","border-b","border-[var(--secondary-color)]","p-4","text-center","hover:bg-[var(--secondary-color)]","hover:cursor-pointer");
      foto.classList.add("w-[50px]","h-[50px]" ,"rounded-full","object-cover","me-5");
      nombre.innerText = elemento.nombre;
      ul.appendChild(li);
      li.appendChild(foto);
      li.appendChild(nombre);
      if (elemento.pendientes != 0){
         pendientes = document.createElement("div");
         pendientes.classList.add("w-6","h-6","ms-auto","rounded-full","text-[var(--text-color)]","bg-[var(--background-color)]","dark:bg-[var(--secondary-color)]");
         pendientes.innerText = elemento.pendientes;
         li.appendChild(pendientes);
      }
      
      if (elemento.tipo == "usuario"){

         li.setAttribute('id-amigo', elemento.id);
         li.setAttribute("usuario", elemento.nombre);
         foto.src = '../assets/img/user.png'; // Aquí la URL de la foto si está disponible
         foto.alt = "foto de perfil";
         li.addEventListener("click",abrirChat);

      }else{

         li.setAttribute('id-grupo', elemento.id);
         li.setAttribute('grupo', elemento.nombre);
         foto.src = '../assets/img/grupo.png';//Url
         foto.alt = "foto de grupo";
         li.addEventListener("click",abrirChatGrupo);

      }
   });
}


