/**
 * ==========================================================
 * SICA Enterprise 5.0
 * Exportar PDF - Horas Laboradas
 * ==========================================================
 */

import { jsPDF } from "https://esm.sh/jspdf@2.5.1";
import autoTable from "https://esm.sh/jspdf-autotable@3.8.2";
export function exportarPDF(resultado, filtros = {}) {

    //---------------------------------------------------------
    // VALIDAR INFORMACIÓN
    //---------------------------------------------------------

    if (!resultado || resultado.length === 0) {

        alert("No hay información para exportar.");
        return;

    }

    //---------------------------------------------------------
    // CREAR PDF
    //---------------------------------------------------------

    const pdf = new jsPDF({

        orientation: "landscape",
        unit: "mm",
        format: "a4"

    });

    //---------------------------------------------------------
    // TÍTULO
    //---------------------------------------------------------

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);

    pdf.text(
        "SICA ENTERPRISE 5.0",
        148,
        15,
        { align: "center" }
    );

    pdf.setFontSize(13);

    pdf.text(
        "REPORTE DE HORAS LABORADAS",
        148,
        23,
        { align: "center" }
    );

    //---------------------------------------------------------
    // FILTROS
    //---------------------------------------------------------

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);

    pdf.text(
        `Fecha Inicial: ${filtros.fechaInicio || "Todas"}`,
        14,
        34
    );

    pdf.text(
        `Fecha Final: ${filtros.fechaFin || "Todas"}`,
        14,
        40
    );

    pdf.text(
        `Empleado: ${filtros.empleado || "Todos"}`,
        90,
        34
    );

    pdf.text(
        `Punto de Venta: ${filtros.puntoVenta || "Todos"}`,
        90,
        40
    );

    pdf.text(
        `Generado: ${new Date().toLocaleString("es-CO")}`,
        205,
        34
    );

    //---------------------------------------------------------
    // ENCABEZADO
    //---------------------------------------------------------

    const encabezado = [[

    "Empleado",
    "Fecha",
    "Entrada",
    "Salida",

    "Ord D",
    "Ord N",

    "Dom D",
    "Dom N",
    "Dom Extra D",
    "Dom Extra N",

    "Fest D",
    "Fest N",
    "Fest Extra D",
    "Fest Extra N",

    "Extra D",
    "Extra N",

    "Total"

]];

    //---------------------------------------------------------
    // FILAS
    //---------------------------------------------------------

    const filas = resultado.map(item => [

    item.empleado,
    item.fecha,
    item.entrada,
    item.salida,

    item.ordinariaDiurna,
    item.ordinariaNocturna,

    item.dominicalDiurna,
    item.dominicalNocturna,
    item.extraDominicalDiurna,
    item.extraDominicalNocturna,

    item.festivaDiurna,
    item.festivaNocturna,
    item.extraFestivaDiurna,
    item.extraFestivaNocturna,

    item.extraDiurna,
    item.extraNocturna,

    item.total

]);
    //---------------------------------------------------------
// TABLA
//---------------------------------------------------------

autoTable(pdf, {

    startY: 48,

    head: encabezado,

    body: filas,

    theme: "grid",

    styles: {

    fontSize: 8,
    cellPadding: 2,
    halign: "center",
    valign: "middle"

},

    headStyles: {

        fillColor: [13, 71, 161],
        textColor: [255, 255, 255],
        fontStyle: "bold"

    },

    alternateRowStyles: {

        fillColor: [245, 245, 245]

    },

    columnStyles: {

        0: { cellWidth: 45 },
        1: { cellWidth: 20 },
        2: { cellWidth: 16 },
        3: { cellWidth: 16 }

    }

});

    //---------------------------------------------------------
    // RESUMEN
    //---------------------------------------------------------

    const y = pdf.lastAutoTable
        ? pdf.lastAutoTable.finalY + 8
        : 55;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);

    pdf.text(

        `Registros encontrados: ${resultado.length}`,

        14,

        y

    );

    //---------------------------------------------------------
    // PIE DE PÁGINA
    //---------------------------------------------------------

    const paginas = pdf.getNumberOfPages();

    for (let i = 1; i <= paginas; i++) {

        pdf.setPage(i);

        pdf.setFont("helvetica", "normal");

        pdf.setFontSize(8);

        pdf.text(

            "Generado automáticamente por SICA Enterprise 5.0",

            14,

            205

        );

        pdf.text(

            `Página ${i} de ${paginas}`,

            283,

            205,

            {

                align: "right"

            }

        );

    }

    //---------------------------------------------------------
    // DESCARGAR
    //---------------------------------------------------------

    const hoy = new Date();

    const nombreArchivo =

        `Horas_Laboradas_${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,"0")}-${String(hoy.getDate()).padStart(2,"0")}.pdf`;

    pdf.save(nombreArchivo);

}