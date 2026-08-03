//====================================================
// SICA Enterprise
// CONFIGURAR EMPRESA GLOBAL
//====================================================

import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";


//====================================================
// OBTENER EMPRESA
//====================================================

const parametros = new URLSearchParams(
    window.location.search
);


const empresaId = parametros.get("empresa");



if(!empresaId){

    alert("No se recibió empresa");

}



// referencia Firestore

const referencia = doc(
    db,
    "empresas",
    empresaId
);



//====================================================
// CARGAR DATOS
//====================================================

async function cargarEmpresa(){


    const documento = await getDoc(
        referencia
    );


    if(!documento.exists()){

        alert("Empresa no encontrada");
        return;

    }


    const empresa = documento.data();



    document.getElementById(
        "nombreEmpresa"
    ).innerText = empresa.nombre;


    document.getElementById(
        "codigoEmpresa"
    ).innerText = empresaId;


    document.getElementById(
        "planEmpresa"
    ).innerText = empresa.plan;



    const modulos = empresa.modulos || {};



    document.getElementById("dashboard").checked =
        modulos.dashboard === true;


    document.getElementById("empleados").checked =
        modulos.empleados === true;


    document.getElementById("puntosVenta").checked =
        modulos.puntosVenta === true;


    document.getElementById("horas").checked =
        modulos.horas === true;


    document.getElementById("reportes").checked =
        modulos.reportes === true;


    document.getElementById("liquidacion").checked =
        modulos.liquidacion === true;


    document.getElementById("nomina").checked =
        modulos.nomina === true;



}




//====================================================
// GUARDAR CAMBIOS
//====================================================

document
.getElementById("guardar")
.addEventListener(
"click",
async ()=>{


    const modulos = {

    dashboard:
    document.getElementById("dashboard").checked,

    empleados:
    document.getElementById("empleados").checked,

    puntosVenta:
    document.getElementById("puntosVenta").checked,

    horas:
    document.getElementById("horas").checked,

    reportes:
    document.getElementById("reportes").checked,

    liquidacion:
    document.getElementById("liquidacion").checked,

    nomina:
    document.getElementById("nomina").checked,


    operadores:
    document.getElementById("operadores").checked,

    usuarios:
    document.getElementById("usuarios").checked,

    seguridad:
    document.getElementById("seguridad").checked,

    auditoria:
    document.getElementById("auditoria").checked,

    configuracion:
    document.getElementById("configuracion").checked,

    respaldo:
    document.getElementById("respaldo").checked,

    calendario:
    document.getElementById("calendario").checked

};

    await updateDoc(
    referencia,
    {
        modulos: modulos
    }
);



    alert(
        "Módulos actualizados correctamente"
    );


});



//====================================================
// INICIO
//====================================================

cargarEmpresa();