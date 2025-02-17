import * as app from './app.js';

export async function addUsuarios(){
    let checkbox = document.querySelectorAll('input[name="usuarios"]:checked');
    let usuarios = [];

    checkbox.forEach(usuario => {

        usuarios.push(usuario.value); //El valor del user va a ser la id
        
   });

    let datos = {

        id_grupo: sessionStorage.getItem("id-grupo"),
        id_usuarios: usuarios

   };

   console.log(datos);
    document.getElementById("cortina").classList.add("hidden");
    return await app.postApi("add-usuarios-grupo", datos);
}