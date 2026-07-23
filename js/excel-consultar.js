//====================================================
// RCH Systems
// EXPORTAR CONSULTA A EXCEL
//====================================================

export function exportarExcelConsulta() {

    try {

        //------------------------------------------------
        // OBTENER FILAS VISIBLES
        //------------------------------------------------

        const filas = document.querySelectorAll(
            "#tablaConsulta tr"
        );

        if (filas.length === 0) {

            alert("No hay registros para exportar.");

            return;

        }

        //------------------------------------------------
        // CREAR ARREGLO
        //------------------------------------------------

        const datos = [];

        filas.forEach((fila) => {

            const columnas = fila.querySelectorAll("td");

            if (columnas.length >= 6) {

                datos.push({

                    Documento: columnas[0].innerText,

                    Nombre: columnas[1].innerText,

                    "Punto de Venta": columnas[2].innerText,

                    Fecha: columnas[3].innerText,

                    Hora: columnas[4].innerText,

                    Tipo: columnas[5].innerText

                });

            }

        });

        //------------------------------------------------
        // CREAR EXCEL
        //------------------------------------------------

        const hoja = XLSX.utils.json_to_sheet(datos);

        const libro = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(

            libro,

            hoja,

            "Registros"

        );

        //------------------------------------------------
        // AJUSTAR COLUMNAS
        //------------------------------------------------

        hoja["!cols"] = [

            { wch: 18 },

            { wch: 35 },

            { wch: 30 },

            { wch: 15 },

            { wch: 12 },

            { wch: 12 }

        ];

        //------------------------------------------------
        // NOMBRE DEL ARCHIVO
        //------------------------------------------------

        const hoy = new Date();

        const nombreArchivo =

            "RCH_Registros_" +

            hoy.getFullYear() +

            "-" +

            String(hoy.getMonth() + 1).padStart(2, "0") +

            "-" +

            String(hoy.getDate()).padStart(2, "0") +

            ".xlsx";

        //------------------------------------------------
        // DESCARGAR
        //------------------------------------------------

        XLSX.writeFile(

            libro,

            nombreArchivo

        );

    }

    catch (error) {

        console.error(error);

        alert("Error exportando el archivo Excel.");

    }

}