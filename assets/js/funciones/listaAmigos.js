import * as app from './app.js';
import {abrirChat} from './abrirChat.js';

 export async function listaAmigos(){
    let ul = document.getElementById("listaGeneral");
    let amigos =  await app.getApi("lista-amigos");
    
    let li, foto, nombre;
    
    amigos.forEach(amigo => {
        // Crear elementos
        li = document.createElement("li");
        foto = document.createElement("img");
        nombre = document.createElement("p");
    
        // Rellenar datos
        li.setAttribute('id-amigo', amigo.id);
        li.setAttribute("usuario", amigo.username.toLowerCase());
        li.classList.add("flex","items-center","font-semibold","text-[var(--text-color)]","border-b","border-[var(--secondary-color)]","p-4","text-center","select-none","hover:bg-[var(--secondary-color)]","hover:cursor-pointer");
        foto.src = '../assets/img/user.png'; // Aquí la URL de la foto si está disponible
        foto.alt = "foto de perfil";
        foto.classList.add("w-[50px]","h-[50px]" ,"rounded-full","object-cover","me-5");
        nombre.innerText = amigo.username;
        
        // Añadir al DOM
        ul.appendChild(li);
        li.appendChild(foto);
        li.appendChild(nombre);
        li.addEventListener("click",abrirChat);
   });
}


