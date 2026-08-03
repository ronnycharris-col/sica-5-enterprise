//====================================================
// SICA Enterprise
// PERMISOS DE USUARIO
//====================================================

import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";


//====================================================
// OBTENER USUARIO SELECCIONADO
//====================================================

const parametros = new URLSearchParams(
    window.location.search
);


const usuarioId = parametros.get("usuario");



if(!usuarioId){

    alert("No se recibió usuario");

}



// referencia usuario

const referencia = doc(
    db,
    "usuarios",
    usuarioId
);



//====================================================
// CARGAR PERMISOS
//====================================================

async function cargarUsuario(){


    const documento = await getDoc(
        referencia
    );


    if(!documento.exists()){

        alert("Usuario no encontrado");
        return;

    }


    const usuario = documento.data();



    document.getElementById(
        "nombreUsuario"
    ).innerText =
    usuario.nombre;



    const permisos =
    usuario.permisos || {};



    dashboard.checked =
    permisos.dashboard === true;


    empleados.checked =
    permisos.empleados === true;


    operadores.checked =
    permisos.operadores === true;


    puntosVenta.checked =
    permisos.puntosVenta === true;


    horas.checked =
    permisos.horas === true;


    reportes.checked =
    permisos.reportes === true;


    usuarios.checked =
    permisos.usuarios === true;


    seguridad.checked =
    permisos.seguridad === true;


    configuracion.checked =
    permisos.configuracion === true;


}



//====================================================
// GUARDAR PERMISOS
//====================================================

document
.getElementById("guardar")
.addEventListener(
"click",
async ()=>{


const permisos = {


    dashboard:
    dashboard.checked,


    empleados:
    empleados.checked,


    operadores:
    operadores.checked,


    puntosVenta:
    puntosVenta.checked,


    horas:
    horas.checked,


    reportes:
    reportes.checked,


    usuarios:
    usuarios.checked,


    seguridad:
    seguridad.checked,


    configuracion:
    configuracion.checked


};



await updateDoc(

    referencia,

    {
        permisos
    }

);



alert(
"Permisos actualizados correctamente"
);



});



//====================================================
// INICIO
//====================================================

cargarUsuario();