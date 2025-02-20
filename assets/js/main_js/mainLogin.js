import {login} from '../funciones/login.js';

let cambioEye = document.getElementById("ojo");
cambioEye.addEventListener("click" , cambioOjo);

function cambioOjo(){
    let cambiarOjo = document.getElementById("ojo");
    let passwordField = document.getElementById('password');
    let type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    cambiarOjo.classList.toggle('fa-eye');
    cambiarOjo.classList.toggle('fa-eye-slash');
}


document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem("mi-id")){
        window.location.href = "./chat.html";
    }
    let boton = document.getElementById("iniciarSesion");
    boton.addEventListener("click",login);
});



