export function validarFormulario(respuesta) {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const errorDiv = document.getElementById("error");

    let username = usernameInput.value.trim();  // Elimina espacios antes y después
    let password = passwordInput.value.trim();
    let errorMessage = "";

    // Validación de campos vacíos o solo espacios
    if (username === "" && password === "") {
        errorMessage = "⚠️ Por favor, ingresa tu usuario y contraseña.";
    } else if (username === "") {
        errorMessage = "⚠️ El nombre de usuario no puede estar vacío.";
    } else if (password === "") {
        errorMessage = "⚠️ La contraseña no puede estar vacía.";
    } else if (respuesta.message !== "Login exitoso") {
        // Simulación de verificación de usuario y contraseña
            
            errorMessage = "Usuario o contraseña incorrecta";  
    }

    // Mostrar el mensaje de error y devolver false si hay errores
    errorDiv.innerText = errorMessage;
    errorDiv.classList.remove("hidden");
    return errorMessage == "";
}
