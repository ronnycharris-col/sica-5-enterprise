//====================================================
// SICA Enterprise
// EXCEL HORAS
// excel-horas.js
//====================================================

import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.2/package/xlsx.mjs";

//====================================================
// EXPORTAR EXCEL
//====================================================

export function exportarExcel(resultado) {

    //--------------------------------------------------
    // VALIDAR INFORMACIÓN
    //--------------------------------------------------

    if (!resultado || resultado.length === 0) {

        alert("No hay información para exportar.");
        return;

    }

    //--------------------------------------------------
    // CREAR LIBRO
    //--------------------------------------------------

    const libro = XLSX.utils.book_new();

    //--------------------------------------------------
    // ARREGLO DEL REPORTE
    //--------------------------------------------------

    const datos = [];

    //--------------------------------------------------
    // ENCABEZADO
    //--------------------------------------------------

    datos.push({

        Empleado: "SICA ENTERPRISE",
        Fecha: "",
        Entrada: "",
        Salida: "",
        Ord_D: "",
        Ord_N: "",
        Dom_D: "",
        Dom_N: "",
        Fest_D: "",
        Fest_N: "",
        Ext_D: "",
        Ext_N: "",
        Total: ""

    });

    datos.push({

        Empleado: "REPORTE DE HORAS LABORADAS",
        Fecha: "",
        Entrada: "",
        Salida: "",
        Ord_D: "",
        Ord_N: "",
        Dom_D: "",
        Dom_N: "",
        Fest_D: "",
        Fest_N: "",
        Ext_D: "",
        Ext_N: "",
        Total: ""

    });

    datos.push({});

    //--------------------------------------------------
    // AGREGAR INFORMACIÓN
    //--------------------------------------------------

    resultado.forEach(item => {

        datos.push({

            Empleado: item.empleado,

            Fecha: item.fecha,

            Entrada: item.entrada,

            Salida: item.salida,

            Ord_D: item.ordinariaDiurna,

            Ord_N: item.ordinariaNocturna,

            Dom_D: item.dominicalDiurna,

            Dom_N: item.dominicalNocturna,

            Fest_D: item.festivaDiurna,

            Fest_N: item.festivaNocturna,

            Ext_D: item.extraDiurna,

            Ext_N: item.extraNocturna,

            Total: item.total

        });

    });

    datos.push({});

    //--------------------------------------------------
    // CREAR HOJA
    //--------------------------------------------------

    const hoja = XLSX.utils.json_to_sheet(
        datos,
        {
            skipHeader: false
        }
    );

    //--------------------------------------------------
    // AJUSTAR ANCHO DE COLUMNAS
    //--------------------------------------------------

    hoja["!cols"] = [

        { wch: 30 }, // Empleado
        { wch: 15 }, // Fecha
        { wch: 12 }, // Entrada
        { wch: 12 }, // Salida
        { wch: 10 }, // Ord D
        { wch: 10 }, // Ord N
        { wch: 10 }, // Dom D
        { wch: 10 }, // Dom N
        { wch: 10 }, // Fest D
        { wch: 10 }, // Fest N
        { wch: 10 }, // Ext D
        { wch: 10 }, // Ext N
        { wch: 12 }  // Total

    ];

    //--------------------------------------------------
    // AGREGAR HOJA AL LIBRO
    //--------------------------------------------------

    XLSX.utils.book_append_sheet(
        libro,
        hoja,
        "Horas Laboradas"
    );

    //--------------------------------------------------
    // NOMBRE DEL ARCHIVO
    //--------------------------------------------------

    const hoy = new Date();

    const nombreArchivo =
        `Horas_Laboradas_${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}.xlsx`;

    //--------------------------------------------------
    // DESCARGAR
    //--------------------------------------------------

    XLSX.writeFile(libro, nombreArchivo);

}