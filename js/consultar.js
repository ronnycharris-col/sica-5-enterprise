//====================================================
// RCH Systems
// CONSULTAR.JS
//====================================================

//====================================================
// IMPORTACIONES
//====================================================

import { db } from "./firebase.js";

import {

    collection,

    onSnapshot

} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import { exportarExcelConsulta } from "./excel-consultar.js";

import {

    verFoto,

    cerrarModal

} from "./modal-foto.js";

import { verMapa } from "./mapa-consultar.js";

//====================================================
// VARIABLES GLOBALES
//====================================================

let registros = [];

let puntosVenta = [];

//====================================================
// INICIO
//====================================================

window.onload = () => {

    iniciarSistema();

};

//====================================================
// INICIAR SISTEMA
//====================================================

function iniciarSistema() {

    cargarPuntosVenta();

    cargarRegistros();

    configurarEventos();

}

//====================================================
// CONFIGURAR EVENTOS
//====================================================

function configurarEventos() {

    document
        .getElementById("btnBuscar")
        .addEventListener("click", buscarRegistros);

    document
        .getElementById("btnLimpiar")
        .addEventListener("click", limpiarBusqueda);

    document
        .getElementById("btnExcel")
        .addEventListener("click", exportarExcel);

    document
        .getElementById("cerrarModal")
        .onclick = cerrarModal;

    document
        .getElementById("buscarDocumento")
        .addEventListener("input", aplicarFiltros);

    document
        .getElementById("buscarNombre")
        .addEventListener("input", aplicarFiltros);

    document
        .getElementById("buscarPunto")
        .addEventListener("change", aplicarFiltros);

    document
        .getElementById("buscarTipo")
        .addEventListener("change", aplicarFiltros);

    document
        .getElementById("buscarFechaDesde")
        .addEventListener("change", aplicarFiltros);

    document
        .getElementById("buscarFechaHasta")
        .addEventListener("change", aplicarFiltros);

    window.onclick = (event) => {

        const modal = document.getElementById("modalFoto");

        if (event.target === modal) {

            cerrarModal();

        }

    };

}
//====================================================
// CARGAR PUNTOS DE VENTA
//====================================================

function cargarPuntosVenta() {

    onSnapshot(

        collection(db, "puntosVenta"),

        (consulta) => {

            puntosVenta = [];

            const lista = document.getElementById("buscarPunto");

            lista.innerHTML = '<option value="">Todos</option>';

            consulta.forEach((doc) => {

                puntosVenta.push({

                    id: doc.id,

                    ...doc.data()

                });

            });

            puntosVenta.sort((a, b) =>
                a.nombre.localeCompare(b.nombre)
            );

            puntosVenta.forEach((punto) => {

                lista.innerHTML += `
                    <option value="${punto.nombre}">
                        ${punto.nombre}
                    </option>
                `;

            });

        },

        (error) => {

            console.error(error);

            alert("Error cargando los puntos de venta.");

        }

    );

}

//====================================================
// CARGAR REGISTROS
//====================================================

function cargarRegistros() {

    onSnapshot(

        collection(db, "registros"),

        (consulta) => {

            registros = [];

            consulta.forEach((doc) => {

                registros.push({

                    id: doc.id,

                    ...doc.data()

                });

            });

            registros.sort((a, b) => {

                if (!a.fechaServidor || !b.fechaServidor) {

                    return 0;

                }

                return (

                    b.fechaServidor.toMillis() -

                    a.fechaServidor.toMillis()

                );

            });

            aplicarFiltros();

        },

        (error) => {

            console.error(error);

            alert("Error cargando los registros.");

        }

    );

}
//====================================================
// MOSTRAR REGISTROS
//====================================================

function mostrarRegistros(listaRegistros) {

    const tabla = document.getElementById("tablaConsulta");

    tabla.innerHTML = "";

    //------------------------------------------------
    // SI NO HAY DATOS
    //------------------------------------------------

    if (listaRegistros.length === 0) {

        tabla.innerHTML = `

            <tr>

                <td colspan="8" style="text-align:center;">

                    No hay registros.

                </td>

            </tr>

        `;

        return;

    }

    //------------------------------------------------
    // RECORRER REGISTROS
    //------------------------------------------------

    listaRegistros.forEach((registro) => {

        let foto = "Sin foto";

        if (registro.foto) {

            foto = `

                <img

                    src="${registro.foto}"

                    width="70"

                    style="border-radius:6px;cursor:pointer;"

                    onclick="verFoto('${registro.foto}')">

            `;

        }

        tabla.innerHTML += `

            <tr>

                <td>${registro.documento || ""}</td>

                <td>${registro.nombre || ""}</td>

                <td>${registro.puntoNombre || ""}</td>

                <td>${registro.fecha || ""}</td>

                <td>${registro.hora || ""}</td>

                <td>${registro.tipo || ""}</td>

                <td>${foto}</td>

                <td>

                    <button

                        class="btnMapa"

                        data-documento="${registro.documento || ""}"

                        data-nombre="${registro.nombre || ""}"

                        data-punto="${registro.puntoNombre || ""}"

                        data-fecha="${registro.fecha || ""}"

                        data-hora="${registro.hora || ""}"

                        data-tipo="${registro.tipo || ""}"

                        data-latitud="${registro.latitud || ""}"

                        data-longitud="${registro.longitud || ""}">

                        📍 Ver

                    </button>

                </td>

            </tr>

        `;

    });

    //------------------------------------------------
    // ACTIVAR BOTONES DEL MAPA
    //------------------------------------------------

    document.querySelectorAll(".btnMapa").forEach((boton) => {

        boton.onclick = () => {

            verMapa({

                documento: boton.dataset.documento,

                nombre: boton.dataset.nombre,

                puntoNombre: boton.dataset.punto,

                fecha: boton.dataset.fecha,

                hora: boton.dataset.hora,

                tipo: boton.dataset.tipo,

                latitud: Number(boton.dataset.latitud),

                longitud: Number(boton.dataset.longitud)

            });

        };

    });

}
//====================================================
// APLICAR FILTROS
//====================================================

function aplicarFiltros() {

    const documento = document
        .getElementById("buscarDocumento")
        .value.trim()
        .toLowerCase();

    const nombre = document
        .getElementById("buscarNombre")
        .value.trim()
        .toLowerCase();

    const punto = document
        .getElementById("buscarPunto")
        .value;

    const tipo = document
        .getElementById("buscarTipo")
        .value;

    const fechaDesde = document
        .getElementById("buscarFechaDesde")
        .value;

    const fechaHasta = document
        .getElementById("buscarFechaHasta")
        .value;

    const resultado = registros.filter((registro) => {

        if (
            documento &&
            !String(registro.documento ?? "")
                .toLowerCase()
                .includes(documento)
        ) return false;

        if (
            nombre &&
            !String(registro.nombre ?? "")
                .toLowerCase()
                .includes(nombre)
        ) return false;

        if (
            punto &&
            registro.puntoNombre !== punto
        ) return false;

        if (
            tipo &&
            registro.tipo !== tipo
        ) return false;

        if (fechaDesde || fechaHasta) {

            if (!registro.fechaServidor)
                return false;

            const fechaRegistro =
                registro.fechaServidor.toDate();

            let desde =
                new Date("1900-01-01");

            let hasta =
                new Date("2999-12-31");

            if (fechaDesde)
                desde = new Date(fechaDesde + "T00:00:00");

            if (fechaHasta)
                hasta = new Date(fechaHasta + "T23:59:59");

            if (
                fechaRegistro < desde ||
                fechaRegistro > hasta
            ) {

                return false;

            }

        }

        return true;

    });

    mostrarRegistros(resultado);

}

//====================================================
// BOTÓN BUSCAR
//====================================================

function buscarRegistros() {

    aplicarFiltros();

}

//====================================================
// LIMPIAR BÚSQUEDA
//====================================================

function limpiarBusqueda() {

    document.getElementById("buscarDocumento").value = "";

    document.getElementById("buscarNombre").value = "";

    document.getElementById("buscarPunto").value = "";

    document.getElementById("buscarTipo").value = "";

    document.getElementById("buscarFechaDesde").value = "";

    document.getElementById("buscarFechaHasta").value = "";

    aplicarFiltros();

}
//====================================================
// EXPORTAR A EXCEL
//====================================================

function exportarExcel() {

    exportarExcelConsulta(registros);

}

//====================================================
// HACER FUNCIONES DISPONIBLES GLOBALMENTE
//====================================================

// Necesario para el onclick de las imágenes
window.verFoto = verFoto;

// Necesario para cerrar el modal
window.cerrarModal = cerrarModal;

// Necesario para el botón del mapa
window.verMapa = verMapa;
//====================================================
// FIN DEL ARCHIVO
//====================================================

console.log("======================================");
console.log("RCH Systems");
console.log("CONSULTAR.JS CARGADO CORRECTAMENTE");
console.log("======================================");

//====================================================
// EXPORTACIONES GLOBALES (SI SE REQUIEREN DESDE HTML)
//====================================================

window.buscarRegistros = buscarRegistros;
window.limpiarBusqueda = limpiarBusqueda;
window.aplicarFiltros = aplicarFiltros;