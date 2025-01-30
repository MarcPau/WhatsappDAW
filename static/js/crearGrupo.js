import * as App from './app.js';

export async function crearGrupo() { 

    let grupo = document.getElementById("nombreGrupo").value;
    let checkbox = document.querySelectorAll('input[name="usuarios"]:checked');
    let usuarios = [];

    checkbox.forEach(usuario => {

        usuarios.push(usuario.value); //El valor del user va a ser la id
        
    });

    let datos = {

        nombre_grupo: grupo,
        id_usuarios: usuarios

    };

    return await App.postApi("llistaamics", datos.jsonify());

}