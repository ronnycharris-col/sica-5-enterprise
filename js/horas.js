//====================================================
// SICA Enterprise 5.0
// HORAS LABORADAS
// horas.js
//====================================================

import {

    cargarEmpleados,

    cargarPuntosVenta,

    buscarRegistros,

    empleados,

    puntosVenta

} from "./firebase-horas.js";

import {
    calcularHoras
} from "./calculo-horas.js";

import {

    exportarExcel

} from "./excel-horas.js";

import {

    exportarPDF

} from "./pdf-horas.js";

import {

    crearBuscador

} from "./componentes/buscador.js";

//====================================================
// VARIABLES GLOBALES
//====================================================

let resultadoActual = [];

//====================================================
// INICIO
//====================================================

window.addEventListener(

    "DOMContentLoaded",

    iniciar

);

//====================================================
// INICIAR
//====================================================

async function iniciar() {

    try {

        console.log("====================================");
        console.log("SICA Enterprise - Horas Laboradas");
        console.log("====================================");

        //====================================
        // CARGAR EMPLEADOS
        //====================================

        await cargarEmpleados();

        crearBuscador({

            input: "buscarEmpleado",

            lista: "listaEmpleados",

            hidden: "empleado",

            datos: empleados,

            campoTexto: "nombre",

            campoValor: "documento"

        });

        //====================================
        // CARGAR PUNTOS
        //====================================

        await cargarPuntosVenta();

        crearBuscador({

            input: "buscarPuntoVenta",

            lista: "listaPuntosVenta",

            hidden: "puntoVenta",

            datos: puntosVenta,

            campoTexto: "nombre",

            campoValor: "nombre"

        });

     //====================================
     // BOTONES
     //====================================

document
    .getElementById("btnBuscar")
    .addEventListener(
        "click",
        consultar
    );

document
    .getElementById("btnLimpiar")
    .addEventListener(
        "click",
        limpiarFormulario
    );

document
    .getElementById("btnExcel")
    .addEventListener(
        "click",
        () => exportarExcel(resultadoActual)
    );

document
    .getElementById("btnPDF")
    .addEventListener(
        "click",
        () => exportarPDF(resultadoActual)
    );

console.log("Módulo iniciado correctamente.");
} 
    catch (error) {

        console.error(error);

        alert(

            "No fue posible iniciar el módulo."

        );

    }

}
//====================================================
// CONSULTAR
//====================================================

async function consultar() {

    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFin = document.getElementById("fechaFin").value;
    const empleado = document.getElementById("empleado").value;
   
    const puntoVenta = document.getElementById("puntoVenta").value;

    //====================================
    // VALIDAR FECHAS
    //====================================

    if (!fechaInicio || !fechaFin) {

        alert("Seleccione el rango de fechas.");

        return;

    }

    try {

        console.log("Consultando registros...");

        let registros = await buscarRegistros(

            fechaInicio,

            fechaFin

        );

        console.log(
            "Registros encontrados:",
            registros.length
        );

        //====================================
        // FILTRAR EMPLEADO
        //====================================

        if (empleado !== "") {

            registros = registros.filter(

                r => r.documento === empleado

            );

        }

        

        //====================================
        // FILTRAR PUNTO DE VENTA
        //====================================

        if (puntoVenta !== "") {

            registros = registros.filter(

                r => r.puntoNombre === puntoVenta

            );

        }

        console.log(
            "Registros filtrados:",
            registros.length
        );

        //====================================
        // CALCULAR HORAS
        //====================================

        resultadoActual = calcularHoras(registros);

        //====================================
        // MOSTRAR TABLA
        //====================================

        mostrarTabla(resultadoActual);

    }

    catch (error) {

        console.error(error);

        alert(
            "Ocurrió un error al consultar la información."
        );

    }

}
//====================================================
// MOSTRAR TABLA
//====================================================

function mostrarTabla(resultado) {

    const tbody = document.getElementById("tablaHoras");

    const lblTotal = document.getElementById("totalRegistros");

    tbody.innerHTML = "";

    //====================================
    // SIN RESULTADOS
    //====================================

    if (resultado.length === 0) {

        lblTotal.textContent =
            "Registros encontrados: 0";

        tbody.innerHTML = `

            <tr>

                <td colspan="13">

                    No se encontraron registros.

                </td>

            </tr>

        `;

        return;

    }

    //====================================
    // RECORRER RESULTADOS
    //====================================

    resultado.forEach(item => {

        const fila = document.createElement("tr");

        fila.innerHTML = `

            <td>${item.empleado}</td>

            <td>${item.fecha}</td>

            <td>${item.entrada}</td>

            <td>${item.salida}</td>

            <td>${item.ordinariaDiurna}</td>

            <td>${item.ordinariaNocturna}</td>

            <td>${item.dominicalDiurna}</td>

            <td>${item.dominicalNocturna}</td>

            <td>${item.festivaDiurna}</td>

            <td>${item.festivaNocturna}</td>

            <td>${item.extraDiurna}</td>

            <td>${item.extraNocturna}</td>

            <td>${item.total}</td>

        `;

        tbody.appendChild(fila);

    });

    //====================================
    // TOTAL
    //====================================

    lblTotal.textContent =

        "Registros encontrados: " +

        resultado.length;

    console.log(

        "Tabla actualizada correctamente."

    );

}
//====================================================
// LIMPIAR FORMULARIO
//====================================================

function limpiarFormulario() {

    document.getElementById("fechaInicio").value = "";
    document.getElementById("fechaFin").value = "";

    document.getElementById("buscarEmpleado").value = "";
    document.getElementById("empleado").value = "";

    document.getElementById("buscarPuntoVenta").value = "";
    document.getElementById("puntoVenta").value = "";

    resultadoActual = [];

    document.getElementById("tablaHoras").innerHTML = "";

    document.getElementById("totalRegistros").textContent =
        "Registros encontrados: 0";
    document.getElementById("listaEmpleados").innerHTML = "";

    document.getElementById("listaPuntosVenta").innerHTML = "";
    console.log("Formulario limpiado.");

}
 