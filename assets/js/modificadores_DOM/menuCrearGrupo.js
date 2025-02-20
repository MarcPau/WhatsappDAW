import * as app from '../funciones/app.js';
import {crearGrupo} from '../funciones/crearGrupo.js';
import {addUsuarios} from '../funciones/addUsuarios.js';
import {eliminarUsuarios} from '../funciones/eliminarUsuarios.js';
import {addAdmins} from '../funciones/addAdmins.js';
import {cambiarNombreGrupo} from '../funciones/cambiarNombreGrupo.js';
import {filtrarUsuarios} from '../main_js/mainChat.js';

export async function menuCrearGrupo() {
    let div = document.getElementById("menuGenerico");
    document.getElementById("cortina").classList.remove("hidden");
    div.querySelector("h2").innerText = "Crear grupo"
    let existe = div.querySelector("ul");
    if (existe){
        existe.remove();
    }
    let usuarios = await app.getApi("lista-amigos");
    let ul = document.createElement("ul");
    let input = div.querySelector("input:last-of-type");
    input.insertAdjacentElement("afterend",ul);
    if (input.getAttribute("tipo") == "normal"){
        input.setAttribute("tipo","busqueda");
        input.addEventListener("keyup", (event) => filtrarUsuarios(event,"#listaMenu"));
    }
    
    input.placeholder = "Buscar miembros...";
    // Añado estilo al buscar miembros
    input.classList.add("w-full", "dark:text-gray-500","text-[var(--text-color)]", "border", "border-[var(--secondary-color)]", "rounded-full" ,"py-2","ps-3", "text-left","bg-none");
    input.title = "barra de busqueda";
    input.value = "";
    
    if (input.previousElementSibling.tagName != "INPUT"){
        let creado = document.createElement("input");
        creado.type = "text";
        creado.setAttribute("tipo","normal");
        creado.placeholder = "Nombre de grupo";
        creado.title = "barra de nombre de grupo";
        creado.classList.add("w-full", "dark:text-gray-500","text-[var(--text-color)]", "border", "border-[var(--secondary-color)]", "rounded-full" ,"py-2","ps-3", "text-left","bg-none");
        input.insertAdjacentElement("beforebegin",creado);
    }else{
        input.previousElementSibling.value = "";
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
        p.innerText = usuario.username;

        ul.id = "listaMenu";
        ul.classList.add("flex","flex-col","space-y-2","max-h-60","md:max-h-80","overflow-y-auto","p-2")
        li.classList.add("flex", "items-center", "justify-between", "w-full", "p-2", "border-b", "border-y-[var(--secondary-color)]");
        input.classList.add("w-5", "h-5", "border-[var(--secondary-color)]", "rounded");
        p.classList.add( "truncate", "max-w-[200px]");
        // Añadir al DOM
        ul.appendChild(li);
        li.appendChild(p);
        li.appendChild(input);

    });

    let boton = div.querySelector("button");
    boton.innerHTML = "Crear grupo";
    switch (boton.getAttribute("tipo")) {
        case "eliminar":
            boton.removeEventListener("click", eliminarUsuarios);
            break;
        case "nombre":
            boton.removeEventListener("click", cambiarNombreGrupo);
            break;
        case "add":
            boton.removeEventListener("click", addUsuarios);
            break;
        case "addAdmin":
            boton.removeEventListener("click", addAdmins);
            break;
        default:
            break;
    }
    boton.setAttribute("tipo","crear")
    boton.addEventListener("click", crearGrupo);
    
}