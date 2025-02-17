import * as app from './app.js';

export async function addAdmins(){
    let checkbox = document.querySelectorAll('input[name="usuarios"]:checked');
    let usuarios = [];

    console.log(checkbox);
    

    checkbox.forEach(usuario => {

        usuarios.push(usuario.value); //El valor del user va a ser la id
        
   });

   console.log(usuarios);

    let datos = {

        id_grupo: sessionStorage.getItem("id-grupo"),
        id_usuarios: usuarios

   };
    document.getElementById("cortina").classList.add("hidden");
    return await app.putApi("add-admin-grupo", datos);
}