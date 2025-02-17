import * as app from '../funciones/app.js';
import {crearGrupo} from '../funciones/crearGrupo.js';
import {addUsuarios} from '../funciones/addUsuarios.js';
import {eliminarUsuarios} from '../funciones/eliminarUsuarios.js';
import {addAdmins} from '../funciones/addAdmins.js';
import {cambiarNombreGrupo} from '../funciones/cambiarNombreGrupo.js';
import {filtrarUsuarios} from '../main_js/mainChat.js';

export async function menuAddUsuarios() {
    let div = document.getElementById("menuGenerico");
    document.getElementById("cortina").classList.remove("hidden");

        div.querySelector("h2").innerText = "Añadir usuarios";
        let existe = div.querySelector("ul");
        if (existe){
            existe.remove();
       }
        let datos = [sessionStorage.getItem("id-grupo"),"false"]
        let usuarios = await app.getApi("usuarios-grupo",datos);
        let ul = document.createElement("ul");
        let input = div.querySelector("input:last-of-type");
        input.insertAdjacentElement("afterend",ul);
        if (input.getAttribute("tipo") == "normal"){
            input.setAttribute("tipo","busqueda");
            input.addEventListener("keyup",filtrarUsuarios);
            input.placeholder = "Buscar miembros...";
       }

       input.classList.add("w-full", "dark:text-gray-500","text-[var(--text-color)]", "border", "border-[var(--secondary-color)]", "rounded-full" ,"py-2","ps-3", "text-left","bg-none");
       input.title = "barra de busqueda";

        let segundoInput = input.previousElementSibling;
        if (segundoInput.tagName == "INPUT"){
            segundoInput.remove();
       }

        let li,p;
        usuarios.forEach(usuario => {
            
            // Crear elementos
            li = document.createElement("li");
            input = document.createElement("input");
            p = document.createElement("p");
            // Rellenar datos
            input.setAttribute('id-usuario', usuario.id);
            input.type = "checkbox";
            input.name = "usuarios";
            input.title = "seleccion de usuario";
            input.value = usuario.id;
            input.classList.add("bg-gray-500", "text-white", "rounded", "p-2");
            p.innerText = usuario.username;
    
            ul.id = "listaMenu";
            ul.classList.add("flex","flex-col","space-y-2","max-h-60","md:max-h-80","overflow-y-auto","p-2")
            li.classList.add("flex", "items-center", "justify-between", "w-full", "p-2", "border-b", "border-y-[var(--secondary-color)]");
            input.classList.add("w-5", "h-5", "border-[var(--secondary-color)]", "rounded");
            p.classList.add( "truncate", "max-w-[200px]");

            ul.appendChild(li);
            li.appendChild(p);
            li.appendChild(input);
    
       });

        let boton = div.querySelector("button");
        boton.innerHTML = "Añadir usuarios";
        switch (boton.getAttribute("tipo")) {
            case "eliminar":
                boton.removeEventListener("click", eliminarUsuarios);
                break;
            case "crear":
                boton.removeEventListener("click", crearGrupo);
                break;
            case "nombre":
                boton.removeEventListener("click", cambiarNombreGrupo);
                break;
            case "addAdmin":
                boton.removeEventListener("click", addAdmins);
                break;
            default:
                break;
       }
        boton.setAttribute("tipo","add");
        boton.addEventListener("click", addUsuarios);
   }
    
