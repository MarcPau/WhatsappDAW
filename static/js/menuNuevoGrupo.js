import * as App from './app.js';

export async function menuNuevoGrupo() {
    
    let div = document.getElementById("menuCrear");
    
    if (div.innerHTML == "") {
        
        let listaAmigos = await App.getApi("llistaamics");
    
        let input = document.createElement("input");
        input.type = "text";
        input.id = "nombreGrupo";
        div.appendChild(input);
    
        listaAmigos.forEach(amigo => {
    
            // Crear elementos
            input = document.createElement("input");
            
            // Rellenar datos
            input.setAttribute('id-amigo', amigo.id);
            input.innerText = amigo.username;
            input.type = "checkbox";
            input.name = "usuarios";
            input.value = amigo.id;
    
            // Añadir al DOM
            div.appendChild(input);
    
        });
    
    }

    div.classList.forEach((clase) => {

        if (clase == "block") {

            clase = "hidden";

        }

        else if (clase == "hidden") {

            clase = "block";

        }

    })

}