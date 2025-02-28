function ampliarTexto (){
    var size = document.getElementById('html').style.fontSize;
    // quito el %
    size = parseInt(size.substring(0,size.length -1));
    if (size < 200){
        size += 20;
    }
    size = size + "%"
    document.getElementById('html').style.fontSize = size;
}

function reducirTexto (){
    var size = document.getElementById('html').style.fontSize;
    // quito el %
    size = parseInt(size.substring(0,size.length -1));
    if (size > 20){
        size -= 20;
    }
    size = size + "%"
    document.getElementById('html').style.fontSize = size;
}

function actualizarReloj(){
    const ahora = new Date();
    document.getElementById ("reloj").innerHTML = ahora.toLocaleString();
    setTimeout(actualizarReloj,1000);
}

function validarNombre (){
    var nombre = document.getElementById('nombre').value;
    if (nombre.length>0){
        document.getElementById('nombre').classList.remove('is-invalid');
        document.getElementById('nombre').classList.add('is-valid');
        return true;
    }
    else {
        document.getElementById('nombre').classList.remove('is-valid');
        document.getElementById('nombre').classList.add('is-invalid');
        return false;
    }
}

function validarEmail (){
    var email = document.getElementById('email').value;
    // Para comprobar el email se utiliza una expresion regular sacada de https://regexr.com/2rhq7
    var email_valido = email.match (/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g)
    if (email_valido!=null){
        document.getElementById('email').classList.remove('is-invalid');
        document.getElementById('email').classList.add('is-valid');
        return true;
    }
    else {
        document.getElementById('email').classList.remove('is-valid');
        document.getElementById('email').classList.add('is-invalid');
        return false;
    }
}

function validarMensaje (){
    var mensaje = document.getElementById('mensaje').value;
    if (mensaje.length>0){
        document.getElementById('mensaje').classList.remove('is-invalid');
        document.getElementById('mensaje').classList.add('is-valid');
        return true;
    }
    else {
        document.getElementById('mensaje').classList.remove('is-valid');
        document.getElementById('mensaje').classList.add('is-invalid');
        return false;
    }
}

function contarPalabras(){
    const mensaje = document.getElementById('mensaje').value;
    mensaje_limpio = mensaje.trim();  // Se quitan espacios vacios al principio y final
    var listaPalabras = mensaje_limpio.split(/\s/)
    // Se quitan espacios entre palabras
    var listaPalabrasLimpia = listaPalabras.filter(function (palabra) {
        return palabra != "";
    });
    // Se actualiza el contador
    document.getElementById ('palabras').innerHTML = listaPalabrasLimpia.length;
}

function validarFormulario(){
    var formulario_valido = (validarEmail () && validarNombre() && validarMensaje())
    if (formulario_valido){
        alert("El formulario se ha validado correctamente y se puede enviar");
    }
}

// ######### Funciones para el registro y acceso de usuarios

function validarContraseña (){
    var nombre = document.getElementById('password').value;
    if (nombre.length>0){
        document.getElementById('password').classList.remove('is-invalid');
        document.getElementById('password').classList.add('is-valid');
        return true;
    }
    else {
        document.getElementById('password').classList.remove('is-valid');
        document.getElementById('password').classList.add('is-invalid');
        return false;
    }
}
function registrarUsuario(){
    var formulario_valido = (validarEmail () && validarNombre() && validarContraseña())
    if (formulario_valido){
        document.getElementById('formularioRegistro').submit();
    }
}