
import {crearGrupo} from '../funciones/crearGrupo.js';
import {addUsuarios} from '../funciones/addUsuarios.js';
import {eliminarUsuarios} from '../funciones/eliminarUsuarios.js';
import {addAdmins} from '../funciones/addAdmins.js';
import {cambiarNombreGrupo} from '../funciones/cambiarNombreGrupo.js';
import {filtrarUsuarios} from '../main_js/mainChat.js';

export async function menuCambioNombre() {
    let div = document.getElementById("menuGenerico");
    document.getElementById("cortina").classList.remove("hidden");
    
    if (div.querySelector("h2").innerText != "Cambiar nombre") {
        div.querySelector("h2").innerText = "Cambiar nombre";
        let existe = div.querySelector("ul");
        if (existe){
            existe.remove();
       }

        let input = div.querySelector("input:last-of-type");
        let ul = document.createElement("ul");
        input.insertAdjacentElement("afterend",ul);
        if (input.getAttribute("tipo") == "busqueda"){
            input.setAttribute("tipo","normal");
            input.removeEventListener("keyup", (event) => filtrarUsuarios(event,"#listaMenu"));
            input.placeholder = "Nombre de grupo";
       }

       input.classList.add("w-full", "dark:text-gray-500","text-[var(--text-color)]", "border", "border-[var(--secondary-color)]", "rounded-full" ,"py-2","ps-3", "text-left","bg-none");
       input.title = "barra de nombre de grupo";

        let segundoInput = input.previousElementSibling;
        if (segundoInput.tagName == "INPUT"){
            segundoInput.remove();
       }

        let boton = div.querySelector("button");
        boton.innerHTML = "Cambiar nombre";
        switch (boton.getAttribute("tipo")) {
            case "eliminar":
                boton.removeEventListener("click", eliminarUsuarios);
                break;
            case "crear":
                boton.removeEventListener("click", crearGrupo);
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
        boton.setAttribute("tipo","nombre");
        boton.addEventListener("click", cambiarNombreGrupo);
   }
    
}