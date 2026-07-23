//====================================================
// SICA Enterprise
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

import { exportarExcel } from "./excel-horas.js";

import { exportarPDF } from "./pdf-horas.js";

import { crearBuscador } from "./componentes/buscador.js";

//====================================================
// RESULTADO ACTUAL
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
        console.log("Iniciando módulo...");
        console.log("====================================");

        //==============================
        // BOTÓN PDF
        //==============================

        document
            .getElementById("btnPDF")
            .addEventListener(
                "click",
                () => {

                    exportarPDF(resultadoActual);

                }
            );

        //==============================
        // CARGAR EMPLEADOS
        //==============================

        await cargarEmpleados();

        console.log(
            "Empleados cargados:",
            empleados.length
        );

        crearBuscador({

            input: "buscarEmpleado",

            lista: "listaEmpleados",

            hidden: "empleado",

            datos: empleados,

            campoTexto: "nombre",

            campoValor: "documento"

        });

        //==============================
        // CARGAR PUNTOS DE VENTA
        //==============================

        await cargarPuntosVenta();

        console.log(
            "Puntos de Venta cargados:",
            puntosVenta.length
        );

        crearBuscador({

            input: "buscarPuntoVenta",

            lista: "listaPuntosVenta",

            hidden: "puntoVenta",

            datos: puntosVenta,

            campoTexto: "nombre",

            campoValor: "nombre"

        });

        //==============================
        // BOTÓN CONSULTAR
        //==============================

        document
            .getElementById("btnBuscar")
            .addEventListener(
                "click",
                consultar
            );

        //==============================
        // BOTÓN EXCEL
        //==============================

        document
            .getElementById("btnExcel")
            .addEventListener(
                "click",
                () => {

                    exportarExcel(resultadoActual);

                }
            );

        console.log("Módulo iniciado correctamente.");

    } catch (error) {

        console.error(
            "Error iniciando Horas Laboradas:",
            error
        );

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
    // VALIDACIONES
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

        console.log("Registros encontrados:", registros.length);

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

        console.log("Registros filtrados:", registros.length);

        resultadoActual = calcularHoras(registros);

        mostrarTabla(resultadoActual);

    } catch (error) {

        console.error(error);

        alert("Ocurrió un error al consultar la información.");

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

        lblTotal.textContent = "Registros encontrados: 0";

        tbody.innerHTML = `

            <tr>

                <td colspan="8" style="text-align:center;">

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

            <td>${item.ordinarias}</td>

            <td>${item.extraDiurna}</td>

            <td>${item.extraNocturna}</td>

            <td>${item.total}</td>

        `;

        tbody.appendChild(fila);

    });

    //====================================
    // TOTAL REGISTROS
    //====================================

    lblTotal.textContent =
        "Registros encontrados: " + resultado.length;

    console.log("Tabla actualizada correctamente.");

}