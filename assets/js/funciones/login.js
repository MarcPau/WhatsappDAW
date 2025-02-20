import * as app from './app.js';
import { validarFormulario } from '../controlErrores/loginErrores.js';

export async function login() {
    // Si la validación falla, detenemos la ejecución
    
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let datos = { username, password };
    
    let respuesta = await app.postApi("token", datos);
    
    if (!validarFormulario(respuesta)) return;

     localStorage.setItem("mi-id", respuesta.id);
     window.location.href = './chat.html';
 
}
