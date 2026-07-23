//====================================================
// SICA 5.0 ENTERPRISE
// MANTENIMIENTO
// PARTE 1
//====================================================

//====================================================
// IMPORTACIONES
//====================================================

import {

    db

} from "./firebase.js";
import {

    mostrarModuloUsuarios

} from "./mantenimiento/usuarios.js";
import {

    mostrarModuloEmpleados

} from "./mantenimiento/empleados-v2.js";
import {

    mostrarModuloPuntos

} from "./mantenimiento/puntos.js";
//====================================================
// FIREBASE
//====================================================

import {

    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs

} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

//====================================================
// SESIÓN
//====================================================

const usuarioActivo = JSON.parse(

    sessionStorage.getItem(

        "usuarioActivo"

    )

);

if(!usuarioActivo){

    alert(

        "Debe iniciar sesión."

    );

    window.location.href =

        "index.html";

    throw new Error(

        "Sesión no encontrada."

    );

}

//====================================================
// CONTROLES
//====================================================

const btnInicio =

document.getElementById(

    "btnInicio"

);

const panelTrabajo =

document.getElementById(

    "panelTrabajo"

);

//====================================================
// BOTÓN INICIO
//====================================================

if(btnInicio){

    btnInicio.addEventListener(

        "click",

        ()=>{

            window.location.href =

                "menu.html";

        }

    );

}
//====================================================
// TARJETAS
//====================================================

const cardUsuarios =

document.getElementById(

    "cardUsuarios"

);

const cardEmpleados =

document.getElementById(

    "cardEmpleados"

);

const cardPuntos =

document.getElementById(

    "cardPuntos"

);

const cardRegistros =

document.getElementById(

    "cardRegistros"

);

const cardSeguridad =

document.getElementById(

    "cardSeguridad"

);

const cardHerramientas =

document.getElementById(

    "cardHerramientas"

);

//====================================================
// EVENTOS
//====================================================

if(cardUsuarios){

    console.log("cardUsuarios encontrado:", cardUsuarios);

    cardUsuarios.addEventListener("click", ()=>{

        console.log("CLICK EN USUARIOS");

        console.log("panelTrabajo:", panelTrabajo);

        try{

            mostrarModuloUsuarios(panelTrabajo);

            console.log("mostrarModuloUsuarios ejecutada");

        }

        catch(error){

            console.error("ERROR EN mostrarModuloUsuarios:", error);

        }

    });

}

if(cardEmpleados){

    console.log("cardEmpleados encontrado:", cardEmpleados);

    cardEmpleados.addEventListener("click", ()=>{

        console.log("CLICK EN EMPLEADOS");

        console.log(panelTrabajo);

        try{
           console.log("ANTES:");
console.log(panelTrabajo.innerHTML);

            mostrarModuloEmpleados(panelTrabajo);

            console.log("mostrarModuloEmpleados ejecutada");
console.log("DESPUÉS:");
console.log(panelTrabajo.innerHTML);
        }

        catch(error){

            console.error("ERROR:", error);

        }

    });

}


if(cardPuntos){

    console.log("cardPuntos encontrado:", cardPuntos);

    cardPuntos.addEventListener("click", ()=>{

        console.log("CLICK EN PUNTOS");

        try{

            mostrarModuloPuntos(panelTrabajo);

            console.log("mostrarModuloPuntos ejecutada");

        }

        catch(error){

            console.error(error);

        }

    });

}

if(cardRegistros){

    cardRegistros.addEventListener(

        "click",

        mostrarRegistros

    );

}

if(cardSeguridad){

    cardSeguridad.addEventListener(

        "click",

        mostrarSeguridad

    );

}

if(cardHerramientas){

    cardHerramientas.addEventListener(

        "click",

        mostrarHerramientas

    );

}


//====================================================
// INICIALIZACIÓN
//====================================================
//====================================================
// MÓDULOS PENDIENTES
//====================================================





function mostrarRegistros(){}

function mostrarSeguridad(){}

function mostrarHerramientas(){}
console.log(

    "%cSICA 5.0 Enterprise",

    "color:#1565C0;font-size:18px;font-weight:bold;"

);

console.log(

    "Centro de Mantenimiento iniciado."

);

console.log(

    "Usuario:",

    usuarioActivo

);