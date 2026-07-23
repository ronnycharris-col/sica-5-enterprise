//====================================================
// RCH Systems
// PDF HORAS LABORADAS
// pdf-horas.js
//====================================================

import { jsPDF } from "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm";

//====================================================
// EXPORTAR PDF
//====================================================

export function exportarPDF(resultado) {

    //--------------------------------------------------
    // VALIDAR INFORMACIÓN
    //--------------------------------------------------

    if (!resultado || resultado.length === 0) {

        alert("No hay información para exportar.");

        return;

    }

    //--------------------------------------------------
    // CREAR DOCUMENTO
    //--------------------------------------------------

    const pdf = new jsPDF({

        orientation: "landscape",

        unit: "mm",

        format: "a4"

    });

    //--------------------------------------------------
    // CONFIGURACIÓN INICIAL
    //--------------------------------------------------

    let posY = 20;
        //--------------------------------------------------
    // TÍTULO
    //--------------------------------------------------

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);

    pdf.text(
        "RCH Systems",
        148,
        posY,
        { align: "center" }
    );

    posY += 8;

    pdf.setFontSize(14);

    pdf.text(
        "Sistema Integral de Control de Acceso",
        148,
        posY,
        { align: "center" }
    );

    posY += 7;

    pdf.setFontSize(12);

    pdf.text(
        "Enterprise Edition",
        148,
        posY,
        { align: "center" }
    );

    posY += 12;

    //--------------------------------------------------
    // REPORTE
    //--------------------------------------------------

    pdf.setFontSize(14);

    pdf.text(
        "REPORTE DE HORAS LABORADAS",
        148,
        posY,
        { align: "center" }
    );

    posY += 12;

    //--------------------------------------------------
    // FECHA DEL REPORTE
    //--------------------------------------------------

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    pdf.text(
        "Fecha de generación: " +
        new Date().toLocaleDateString("es-CO"),
        14,
        posY
    );

    posY += 10;
        //--------------------------------------------------
    // ENCABEZADOS DE LA TABLA
    //--------------------------------------------------

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);

    const columnas = [

        "Empleado",
        "Fecha",
        "Entrada",
        "Salida",
        "Ord.",
        "Ext. D.",
        "Ext. N.",
        "Total"

    ];

    const posiciones = [

        10,
        70,
        95,
        120,
        145,
        165,
        188,
        215

    ];

    columnas.forEach((texto, index) => {

        pdf.text(

            texto,

            posiciones[index],

            posY

        );

    });

    posY += 5;

    //--------------------------------------------------
    // LÍNEA SEPARADORA
    //--------------------------------------------------

    pdf.line(

        10,

        posY,

        285,

        posY

    );

    posY += 6;

    //--------------------------------------------------
    // REGISTROS
    //--------------------------------------------------

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);

    resultado.forEach(item => {

        pdf.text(String(item.empleado), 10, posY);
        pdf.text(String(item.fecha), 70, posY);
        pdf.text(String(item.entrada), 95, posY);
        pdf.text(String(item.salida), 120, posY);
        pdf.text(String(item.ordinarias), 145, posY);
        pdf.text(String(item.extraDiurna), 165, posY);
        pdf.text(String(item.extraNocturna), 188, posY);
        pdf.text(String(item.total), 215, posY);

        posY += 6;

        //--------------------------------------------------
        // NUEVA PÁGINA SI ES NECESARIO
        //--------------------------------------------------

        if (posY > 190) {

            pdf.addPage();

            posY = 20;

        }

    });
        //--------------------------------------------------
    // TOTAL DE REGISTROS
    //--------------------------------------------------

    posY += 6;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);

    pdf.text(

        "Total de registros: " + resultado.length,

        10,

        posY

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

        }.pdf`;

    //--------------------------------------------------
    // GUARDAR PDF
    //--------------------------------------------------

    pdf.save(nombreArchivo);

}