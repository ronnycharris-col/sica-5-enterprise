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
    // ENCABEZADO DEL REPORTE
    //--------------------------------------------------

    datos.push({

        Empleado: "SICA ENTERPRISE",

        Fecha: "",

        Entrada: "",

        Salida: "",

        Ordinarias: "",

        Extra_Diurna: "",

        Extra_Nocturna: "",

        Total: ""

    });

    datos.push({

        Empleado: "REPORTE DE HORAS LABORADAS",

        Fecha: "",

        Entrada: "",

        Salida: "",

        Ordinarias: "",

        Extra_Diurna: "",

        Extra_Nocturna: "",

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

            Ordinarias: item.ordinarias,

            Extra_Diurna: item.extraDiurna,

            Extra_Nocturna: item.extraNocturna,

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

        { wch: 30 },

        { wch: 15 },

        { wch: 15 },

        { wch: 15 },

        { wch: 15 },

        { wch: 15 },

        { wch: 15 },

        { wch: 15 }

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

        `Horas_Laboradas_${

            hoy.getFullYear()

        }-${

            String(hoy.getMonth() + 1).padStart(2, "0")

        }-${

            String(hoy.getDate()).padStart(2, "0")

        }.xlsx`;

    //--------------------------------------------------
    // DESCARGAR
    //--------------------------------------------------

    XLSX.writeFile(

        libro,

        nombreArchivo

    );

}