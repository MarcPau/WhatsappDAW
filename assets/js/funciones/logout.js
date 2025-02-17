import * as app from './app.js';

export async function logout() {
   let cerrarSesión = window.confirm("¿Quieres cerrar sesión?");

   if(cerrarSesión){
     // 1. Eliminar datos de sesión
     localStorage.clear();
     await app.postApi("logout",{});
     // 2. Redirigir al usuario a la página de login
     window.location.href = "./login.html";

   }
   
}