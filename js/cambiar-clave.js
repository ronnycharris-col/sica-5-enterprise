//====================================================
// SICA 4.0
// CAMBIO DE CONTRASEÑA
//====================================================

import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

//====================================================
// CONTROLES
//====================================================

const txtUsuario = document.getElementById("usuario");
const txtNombre = document.getElementById("nombre");

const grupoClaveActual =
    document.getElementById("grupoClaveActual");

const txtClaveActual =
    document.getElementById("claveActual");

const txtClaveNueva =
    document.getElementById("claveNueva");

const txtClaveConfirmar =
    document.getElementById("claveConfirmar");

const btnGuardar =
    document.getElementById("btnGuardar");

//====================================================
// VARIABLES
//====================================================

let usuarioSesion = null;

let datosUsuario = null;

let esPrimerIngreso = false;

//====================================================
// INICIO
//====================================================

window.addEventListener(
    "load",
    iniciarPagina
);

//====================================================
// INICIAR
//====================================================

async function iniciarPagina() {

    //--------------------------------------------
    // SESIÓN
    //--------------------------------------------

    usuarioSesion = JSON.parse(
        sessionStorage.getItem("usuarioActivo")
    );

    if (!usuarioSesion) {

        alert("La sesión ha finalizado.");

        window.location.href = "index.html";

        return;

    }

    //--------------------------------------------
    // MOSTRAR DATOS
    //--------------------------------------------

    txtUsuario.value = usuarioSesion.usuario;

    txtNombre.value = usuarioSesion.nombre;

    //--------------------------------------------
    // CONSULTAR FIREBASE
    //--------------------------------------------

    try {

        const referencia = doc(
            db,
            "usuarios",
            usuarioSesion.usuario
        );

        const documento =
            await getDoc(referencia);

        if (!documento.exists()) {

            alert("El usuario no existe.");

            window.location.href = "index.html";

            return;

        }

        datosUsuario = documento.data();

        esPrimerIngreso =
            datosUsuario.primerIngreso === true;

        //----------------------------------------
        // OCULTAR CONTRASEÑA ACTUAL
        //----------------------------------------

        if (esPrimerIngreso) {

            grupoClaveActual.style.display = "none";

        }

    } catch (error) {

        console.error(error);

        alert("Error al consultar Firebase.");

    }

}
//====================================================
// BOTÓN ACTUALIZAR
//====================================================

btnGuardar.addEventListener(
    "click",
    actualizarContrasena
);

//====================================================
// ACTUALIZAR CONTRASEÑA
//====================================================

async function actualizarContrasena() {

    //--------------------------------------------
    // LEER CAMPOS
    //--------------------------------------------

    const claveActual =
        txtClaveActual.value.trim();

    const claveNueva =
        txtClaveNueva.value.trim();

    const claveConfirmar =
        txtClaveConfirmar.value.trim();

    //--------------------------------------------
    // VALIDACIONES
    //--------------------------------------------

    if (!esPrimerIngreso) {

        if (claveActual === "") {

            alert("Ingrese la contraseña actual.");

            txtClaveActual.focus();

            return;

        }

        if (claveActual !== datosUsuario.clave) {

            alert("La contraseña actual es incorrecta.");

            txtClaveActual.focus();

            return;

        }

    }

    if (claveNueva === "") {

        alert("Ingrese la nueva contraseña.");

        txtClaveNueva.focus();

        return;

    }

    if (claveNueva.length < 8) {

        alert("La contraseña debe tener mínimo 8 caracteres.");

        txtClaveNueva.focus();

        return;

    }

    if (claveNueva === "Boleta12") {

        alert("No puede utilizar nuevamente la contraseña temporal.");

        txtClaveNueva.focus();

        return;

    }

    if (claveNueva !== claveConfirmar) {

        alert("Las contraseñas no coinciden.");

        txtClaveConfirmar.focus();

        return;

    }

    if (claveNueva === datosUsuario.clave) {

        alert("La nueva contraseña debe ser diferente a la anterior.");

        txtClaveNueva.focus();

        return;

    }
    //--------------------------------------------
    // ACTUALIZAR FIREBASE
    //--------------------------------------------

    try {

        const referencia = doc(
            db,
            "usuarios",
            usuarioSesion.usuario
        );

        await updateDoc(referencia, {

            clave: claveNueva,

            primerIngreso: false,

            fechaCambioClave: serverTimestamp()

        });

        //--------------------------------------------
        // ACTUALIZAR VARIABLES
        //--------------------------------------------

        datosUsuario.clave = claveNueva;

        datosUsuario.primerIngreso = false;

        esPrimerIngreso = false;

        //--------------------------------------------
        // ACTUALIZAR SESIÓN
        //--------------------------------------------

        usuarioSesion.primerIngreso = false;

        sessionStorage.setItem(
            "usuarioActivo",
            JSON.stringify(usuarioSesion)
        );

        //--------------------------------------------
        // MENSAJE
        //--------------------------------------------

        alert("La contraseña fue actualizada correctamente.");

        //--------------------------------------------
        // REDIRECCIÓN
        //--------------------------------------------

        if (datosUsuario.rol === "administrador") {

            window.location.href = "menu.html";

        } else {

            window.location.href = "operador.html";

        }
    } catch (error) {

        console.error(error);

        alert("No fue posible actualizar la contraseña.");

    }

   

}