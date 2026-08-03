//====================================================
// SICA 5.0 ENTERPRISE
// MENU
// PARTE 1
//====================================================


//====================================================
// IMPORTACIONES
//====================================================

import { db } from "./firebase.js";

import { obtenerModulosEmpresa } from "./motor-global.js";

import {

    doc,
    getDoc

} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";


//====================================================
// SESIÓN
//====================================================

const usuarioActivo = JSON.parse(

    sessionStorage.getItem("usuarioActivo")

);



if(!usuarioActivo){

    alert("Debe iniciar sesión.");

    window.location.href = "index.html";

    throw new Error(
        "Sesión no encontrada"
    );

}


//====================================================
// PERMISOS
//====================================================

let permisos = usuarioActivo.permisos || {};


//====================================================
// CONTROLES
//====================================================

const nombreUsuario =
document.getElementById("nombreUsuario");


const btnDashboard =
document.getElementById("btnDashboard");


const btnUsuarios =
document.getElementById("btnUsuarios");


const btnEmpleados =
document.getElementById("btnEmpleados");


const btnPuntos =
document.getElementById("btnPuntos");


const btnOperador =
document.getElementById("btnOperador");


const btnConsultar =
document.getElementById("btnConsultar");


const btnBackup =
document.getElementById("btnBackup");


const btnHoras =
document.getElementById("btnHoras");


const btnMantenimiento =
document.getElementById("btnMantenimiento");


const btnCerrarSesion =
document.getElementById("btnCerrarSesion");



//====================================================
// MOSTRAR USUARIO
//====================================================

if(nombreUsuario){

    nombreUsuario.innerHTML = `

        <strong>${usuarioActivo.nombre}</strong><br>

        ${usuarioActivo.rol
        .charAt(0)
        .toUpperCase()
        +
        usuarioActivo.rol.slice(1)}

    `;

}


//====================================================
// MANTENIMIENTO CONTROLADO POR PERMISOS
//====================================================


//====================================================
// INICIO DEL MENU
//====================================================

async function iniciarMenu(){


    await cargarPermisos();


    await cargarModulosGlobales();


    document.body.style.visibility="visible";


}


iniciarMenu();
//====================================================
// CARGAR MÓDULOS GLOBALES
//====================================================

async function cargarModulosGlobales(){


    const modulos = await obtenerModulosEmpresa();


    console.log(
        "MÓDULOS RECIBIDOS:",
        modulos
    );


    if(!modulos){

        console.error(
            "No llegaron módulos"
        );

        return;

    }



    const botones = {


        dashboard: btnDashboard,

        empleados: btnEmpleados,

        puntosVenta: btnPuntos,

        horas: btnHoras,

        reportes: btnConsultar


    };



    Object.keys(botones).forEach(modulo=>{

    const boton = botones[modulo];

    if(
        boton &&
        modulos[modulo] === false
    ){
        boton.style.display = "none";
    }

});


    console.log(
        "MÓDULOS APLICADOS:",
        modulos
    );


}



//====================================================
// CARGAR PERMISOS DEL USUARIO
//====================================================

async function cargarPermisos(){


    permisos = usuarioActivo.permisos || {};

    

    const botones = {


        usuarios:"btnUsuarios",

        empleados:"btnEmpleados",

        puntosVenta:"btnPuntos",

        entradasSalidas:"btnOperador",

        dashboard:"btnDashboard",

        reportes:"btnConsultar",

        horas:"btnHoras",

        backup:"btnBackup",

        mantenimiento:"btnMantenimiento"


    };



    Object.keys(botones).forEach(permiso => {

    const boton = document.getElementById(botones[permiso]);

    

    if (
        boton &&
        permisos[permiso] !== true
    ){
        boton.style.display = "none";
    }




    });



    


}
//====================================================
// CERRAR SESIÓN
//====================================================

if(btnCerrarSesion){


    btnCerrarSesion.addEventListener(

        "click",

        ()=>{


            sessionStorage.removeItem(
                "usuarioActivo"
            );


            window.location.href =
                "index.html";


        }

    );


}



//====================================================
// INICIALIZACIÓN
//====================================================

console.log(

    "%cSICA 5.0 Enterprise",

    "color:#1565C0;font-size:18px;font-weight:bold;"

);



console.log(

    "Menú cargado correctamente."

);



console.log(

    "Usuario activo:",

    usuarioActivo

);
