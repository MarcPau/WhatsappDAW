import * as App from './app.js';

 export async function llistaAmics() {

    let ul = document.getElementById("llistaAmics");
    let listaAmigos = await App.getApi("llistaamics");
    
    let li, foto, nombre;
    
    listaAmigos.forEach(amigo => {

        // Crear elementos
        li = document.createElement("li");
        foto = document.createElement("img");
        nombre = document.createElement("p");
    
        // Rellenar datos
        li.setAttribute('id-amigo', amigo.id);
        foto.src = './user.png'; // Aquí la URL de la foto si está disponible
        nombre.innerText = amigo.username;
    
        // Añadir al DOM
        ul.appendChild(li);
        li.appendChild(foto);
        li.appendChild(nombre);

    });

}