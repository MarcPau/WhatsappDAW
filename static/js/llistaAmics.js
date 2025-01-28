import * as App from 'app.js';

function llistaAmics() {

    let body = document.querySelector("body");
    let listaAmigos = App.getApi("llistaamics");
    let li;
    let foto;
    let nombre;

    listaAmigos.forEach(amigo => {

        //Creamos
        li = document.createElement("li");
        foto = document.createElement("img");
        nombre = document.createElement("p");
        body.appendChild(li);
        li.appendChild(foto);
        li.appendChild(nombre);

        //Rellenamos
        li.setAttribute('id-amigo', amigo.id);
        foto.src = ''; //Url
        nombre.innerText = amigo.username;
        
    });
    
}