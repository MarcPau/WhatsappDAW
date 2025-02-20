import * as app from './app.js';

export async function estadoMensajeGrupo(event) {
    event.preventDefault();
    let datos = [event.target.closest("div").getAttribute("id-mensaje")];
    let usuarios =  await app.getApi("estado-mensaje-grupo", datos);
    let menu = document.getElementById("menuEstado");
    menu.querySelectorAll("ul").forEach(ul => ul.innerHTML = ""); //Eliminamos el contenido de los ul
    let referencia,li;
    usuarios.forEach(usuario =>{
        li = document.createElement("li");
        li.innerText = usuario.username;
        switch (usuario.estado) {
            case "entregado":
                referencia = menu.querySelector("ul:nth-of-type(2)");
                break;
            case "leido":
                referencia = menu.querySelector("ul:nth-of-type(3)");
                break;
            default:
                referencia = menu.querySelector("ul:nth-of-type(1)");
                break;
        }
        referencia.appendChild(li);
    });

    document.getElementById("cortina2").classList.remove("hidden");
}