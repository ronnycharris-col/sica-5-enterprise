//====================================================
// SICA Enterprise
// GESTIÓN DE PERMISOS USUARIOS
//====================================================

import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";


//====================================================
// EMPRESA ACTIVA
//====================================================

const usuarioActivo = JSON.parse(
    sessionStorage.getItem("usuarioActivo")
);


const empresaId = usuarioActivo.empresaId;



let usuarioSeleccionado = null;


//====================================================
// ELEMENTOS
//====================================================

const listaUsuarios =
document.getElementById("listaUsuarios");


const panelPermisos =
document.getElementById("panelPermisos");


const nombreUsuario =
document.getElementById("nombreUsuario");


//====================================================
// CARGAR USUARIOS
//====================================================

async function cargarUsuarios(){


    const consulta = query(

        collection(db,"usuarios"),

        where(
            "empresaId",
            "==",
            empresaId
        )

    );


    const resultado =
    await getDocs(consulta);



    listaUsuarios.innerHTML="";



    resultado.forEach((documento)=>{


        const usuario =
        documento.data();



        const boton =
        document.createElement("button");


        boton.innerText =
        usuario.nombre +
        " ("+
        usuario.rol+
        ")";


        boton.onclick = ()=>{

            seleccionarUsuario(
                documento.id,
                usuario
            );

        };


        listaUsuarios.appendChild(
            boton
        );


    });


}



//====================================================
// SELECCIONAR USUARIO
//====================================================

function seleccionarUsuario(id, usuario){


    usuarioSeleccionado = id;


    panelPermisos.style.display =
    "block";


    nombreUsuario.innerText =
    usuario.nombre;



    const permisos =
    usuario.permisos || {};



    dashboard.checked =
    permisos.dashboard === true;


    empleados.checked =
    permisos.empleados === true;


    puntosVenta.checked =
    permisos.puntosVenta === true;


    horas.checked =
    permisos.horas === true;


    reportes.checked =
    permisos.reportes === true;


    usuarios.checked =
    permisos.usuarios === true;


    configuracion.checked =
    permisos.configuracion === true;



}


//====================================================
// GUARDAR PERMISOS
//====================================================

document
.getElementById("guardarPermisos")
.addEventListener(
"click",
async ()=>{


    if(!usuarioSeleccionado){

        alert(
        "Seleccione un usuario"
        );

        return;

    }



    const permisos = {


        dashboard:
        dashboard.checked,


        empleados:
        empleados.checked,


        puntosVenta:
        puntosVenta.checked,


        horas:
        horas.checked,


        reportes:
        reportes.checked,


        usuarios:
        usuarios.checked,


        configuracion:
        configuracion.checked

    };



    await updateDoc(

        doc(
            db,
            "usuarios",
            usuarioSeleccionado
        ),

        {

            permisos

        }

    );



    alert(
    "Permisos actualizados"
    );


});



//====================================================
// INICIO
//====================================================

cargarUsuarios();