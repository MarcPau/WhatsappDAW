import * as App from './app.js';

export async function llistaGrups() {

    let ul = document.getElementById("listaGrupos");
    let llistagrups =  await App.getApi("llistagrups");
    let li;
    let foto;
    let nombre;

    llistagrups.forEach(grup => {

        //Creamos
        li = document.createElement('li');
        foto = document.createElement('img');
        nombre = document.createElement('p');
        ul.appendChild(li);
        li.appendChild(foto);
        li.appendChild(nombre);

        //Rellenamos
        li.setAttribute('id-grupo', grup.id);
        foto.src = ''; //Url
        nombre.innerText = grup.grupo;
        
    });

}