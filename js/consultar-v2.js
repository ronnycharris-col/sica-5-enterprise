//====================================================
// SICA 5.1 ENTERPRISE
// CENTRO DE CONSULTAS V3
//====================================================

import { db } from "./firebase.js";

import {
    cargarEmpleados,
    empleados
} from "./firebase-horas.js";

import { crearBuscador } from "./componentes/buscador.js";

import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

//====================================================
// VARIABLES GLOBALES
//====================================================

let registros = [];

let ciudades = [];

let puntosVenta = [];

let mapa = null;

//====================================================
// INICIAR
//====================================================

document.addEventListener("DOMContentLoaded", iniciar);

//====================================================
// INICIAR MÓDULO
//====================================================

async function iniciar() {

    console.clear();

    console.log("======================================");
    console.log("SICA 5.1 ENTERPRISE");
    console.log("CENTRO DE CONSULTAS");
    console.log("======================================");

    try {

        //----------------------------------------
        // CARGAR DATOS
        //----------------------------------------

        await cargarCiudades();

        await cargarPuntosVenta();

        await cargarEmpleados();

        //----------------------------------------
        // BUSCADOR INTELIGENTE EMPLEADOS
        //----------------------------------------

        crearBuscador({

            input: "buscarNombre",

            lista: "listaEmpleados",

            hidden: "empleado",

            datos: empleados,

            campoTexto: "nombre",

            campoValor: "documento"

        });

        //----------------------------------------
        // CONFIGURAR EVENTOS
        //----------------------------------------

        configurarEventos();

        console.log("Centro de Consultas listo.");

    }
    catch (error) {

        console.error("Error al iniciar:", error);

    }

}

//====================================================
// CARGAR CIUDADES
//====================================================

async function cargarCiudades() {

    console.log("Cargando ciudades...");

    const consulta = query(
        collection(db, "puntosVenta"),
        orderBy("ciudad")
    );

    const respuesta = await getDocs(consulta);

    const lista = [];

    respuesta.forEach(doc => {

        const ciudad = doc.data().ciudad;

        if (ciudad && !lista.includes(ciudad)) {

            lista.push(ciudad);

        }

    });

    lista.sort();

    ciudades = lista;

    const combo = document.getElementById("buscarCiudad");

    combo.innerHTML =
        `<option value="">Todas las ciudades</option>`;

    ciudades.forEach(ciudad => {

        combo.innerHTML += `
            <option value="${ciudad}">
                ${ciudad}
            </option>
        `;

    });

    console.log("Ciudades:", ciudades.length);

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

            lista.innerHTML =
                '<option value="">Todos los puntos</option>';

            consulta.forEach((doc) => {

                const punto = {

                    id: doc.id,

                    ...doc.data()

                };

                puntosVenta.push(punto);

            });

            puntosVenta.sort((a, b) =>
                a.nombre.localeCompare(b.nombre)
            );

            puntosVenta.forEach((punto) => {

                lista.innerHTML += `
                    <option value="${punto.codigo}">
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
// LLENAR COMBO PUNTOS
//====================================================

function llenarComboPuntos() {

    const ciudad = document.getElementById("buscarCiudad").value;

    const combo = document.getElementById("buscarPunto");

    combo.innerHTML =
        `<option value="">Todos los puntos</option>`;

    let lista = puntosVenta;

    if (ciudad !== "") {

        lista = puntosVenta.filter(
            p => p.ciudad === ciudad
        );

    }

    lista.forEach((punto) => {

        combo.innerHTML += `
            <option value="${punto.codigo}">
                ${punto.nombre}
            </option>
        `;

    });

}

//====================================================
// FILTRAR PUNTOS POR CIUDAD
//====================================================

function filtrarPuntosPorCiudad() {

    llenarComboPuntos();

}

//====================================================
// CONFIGURAR EVENTOS
//====================================================

function configurarEventos() {

    console.log("Configurando eventos...");

    //----------------------------------------
    // MODAL FOTO
    //----------------------------------------

    document
        .getElementById("cerrarModal")
        .addEventListener("click", cerrarFoto);

    document
        .getElementById("modalFoto")
        .addEventListener("click", function (e) {

            if (e.target.id === "modalFoto") {

                cerrarFoto();

            }

        });

    //----------------------------------------
    // MODAL MAPA
    //----------------------------------------

    document
        .getElementById("cerrarMapa")
        .addEventListener("click", cerrarMapa);

    document
        .getElementById("modalMapa")
        .addEventListener("click", function (e) {

            if (e.target.id === "modalMapa") {

                cerrarMapa();

            }

        });
            //----------------------------------------
    // CERRAR CON ESC
    //----------------------------------------

    document.addEventListener("keydown", function (e) {

        if (e.key === "Escape") {

            cerrarFoto();
            cerrarMapa();

        }

    });

    //----------------------------------------
    // BOTÓN BUSCAR
    //----------------------------------------

    document
        .getElementById("btnBuscar")
        .addEventListener("click", buscarRegistros);

    //----------------------------------------
    // BOTÓN LIMPIAR
    //----------------------------------------

    document
        .getElementById("btnLimpiar")
        .addEventListener("click", limpiarFiltros);

    //----------------------------------------
    // BOTÓN EXCEL
    //----------------------------------------

    document
        .getElementById("btnExcel")
        .addEventListener("click", exportarExcel);

    //----------------------------------------
    // CAMBIO DE CIUDAD
    //----------------------------------------

    document
        .getElementById("buscarCiudad")
        .addEventListener("change", filtrarPuntosPorCiudad);

    //----------------------------------------
    // ENTER EN LOS CAMPOS
    //----------------------------------------

    const controles = [

        "buscarDocumento",
        "buscarNombre",
        "buscarFechaDesde",
        "buscarFechaHasta"

    ];

    controles.forEach(id => {

        const control = document.getElementById(id);

        if (!control) return;

        control.addEventListener("keypress", function (e) {

            if (e.key === "Enter") {

                buscarRegistros();

            }

        });

    });

}

//====================================================
// LIMPIAR FILTROS
//====================================================

function limpiarFiltros() {

    document.getElementById("buscarDocumento").value = "";

    document.getElementById("buscarNombre").value = "";

    document.getElementById("buscarCiudad").value = "";

    document.getElementById("buscarPunto").innerHTML =
        `<option value="">Todos los puntos</option>`;

    document.getElementById("buscarTipo").value = "";

    document.getElementById("buscarFechaDesde").value = "";

    document.getElementById("buscarFechaHasta").value = "";

    document.getElementById("tablaConsulta").innerHTML = "";

    registros = [];

    llenarComboPuntos();

    console.log("Filtros limpiados.");

}

//====================================================
// EXPORTAR A EXCEL
//====================================================

function exportarExcel() {

    console.clear();

    console.log("======================================");
    console.log("EXPORTANDO A EXCEL");
    console.log("======================================");

    if (registros.length === 0) {

        alert("No existen registros para exportar.");

        return;

    }

    const libro = XLSX.utils.book_new();

    const datos = registros.map(registro => ({

        Documento: registro.documento || "",

        Nombre: registro.nombre || "",

        Ciudad: registro.ciudad || "",

        "Punto de Venta": registro.puntoNombre || "",

        Fecha: registro.fechaServidor
            ? registro.fechaServidor.toDate().toLocaleDateString("es-CO")
            : "",

        Hora: registro.fechaServidor
            ? registro.fechaServidor.toDate().toLocaleTimeString("es-CO")
            : "",

        Tipo: registro.tipo || ""

    }));
        console.table(datos);

    //----------------------------------------
    // CREAR HOJA
    //----------------------------------------

    const hoja = XLSX.utils.json_to_sheet(datos);

    //----------------------------------------
    // AJUSTAR COLUMNAS
    //----------------------------------------

    hoja["!cols"] = [

        { wch: 18 },
        { wch: 35 },
        { wch: 18 },
        { wch: 40 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 }

    ];

    //----------------------------------------
    // AGREGAR HOJA
    //----------------------------------------

    XLSX.utils.book_append_sheet(

        libro,

        hoja,

        "Registros"

    );

    //----------------------------------------
    // NOMBRE DEL ARCHIVO
    //----------------------------------------

    const ahora = new Date();

    const nombreArchivo =
        "SICA_Registros_" +
        ahora.getFullYear() +
        "-" +
        String(ahora.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(ahora.getDate()).padStart(2, "0") +
        ".xlsx";

    //----------------------------------------
    // DESCARGAR
    //----------------------------------------

    XLSX.writeFile(

        libro,

        nombreArchivo

    );

    console.log("Excel generado correctamente.");

}

//====================================================
// BUSCAR REGISTROS
//====================================================

async function buscarRegistros() {

    console.clear();

    console.log("======================================");
    console.log("BUSCANDO REGISTROS");
    console.log("======================================");

    const filtros = {

        documento: document
            .getElementById("buscarDocumento")
            .value
            .trim(),

        nombre: document
            .getElementById("buscarNombre")
            .value
            .trim()
            .toUpperCase(),

        ciudad: document
            .getElementById("buscarCiudad")
            .value,

        punto: document
            .getElementById("buscarPunto")
            .value,

        tipo: document
            .getElementById("buscarTipo")
            .value,

        desde: document
            .getElementById("buscarFechaDesde")
            .value,

        hasta: document
            .getElementById("buscarFechaHasta")
            .value

    };

    console.table(filtros);

    await consultarFirestore(filtros);

}

//====================================================
// CONSULTAR FIRESTORE
//====================================================

async function consultarFirestore(filtros) {

    try {

        registros = [];

        let consulta = collection(db, "registros");

        let filtrosFirestore = [];

        if (filtros.documento !== "") {

            filtrosFirestore.push(

                where("documento", "==", filtros.documento)

            );

        }

        if (filtros.ciudad !== "") {

            filtrosFirestore.push(

                where("ciudad", "==", filtros.ciudad)

            );

        }

        if (filtros.punto !== "") {

            filtrosFirestore.push(

                where("puntoCodigo", "==", filtros.punto)

            );

        }

        if (filtros.tipo !== "") {

            filtrosFirestore.push(

                where("tipo", "==", filtros.tipo)

            );

        }

        let q;

        if (filtrosFirestore.length > 0) {

            q = query(

                consulta,

                ...filtrosFirestore

            );

        } else {

            q = query(consulta);

        }

        const respuesta = await getDocs(q);

        registros = respuesta.docs.map(doc => ({

            id: doc.id,

            ...doc.data()

        }));
                //----------------------------------------
        // FILTRO POR NOMBRE
        //----------------------------------------

        if (filtros.nombre !== "") {

            registros = registros.filter(r =>

                (r.nombre || "")
                    .toUpperCase()
                    .includes(filtros.nombre)

            );

        }

        //----------------------------------------
        // FECHA DESDE
        //----------------------------------------

        if (filtros.desde !== "") {

            const [anio, mes, dia] = filtros.desde.split("-");

            const desde = new Date(

                Number(anio),

                Number(mes) - 1,

                Number(dia)

            );

            registros = registros.filter(r =>

                r.fechaServidor &&

                r.fechaServidor.toDate() >= desde

            );

        }

        //----------------------------------------
        // FECHA HASTA
        //----------------------------------------

        if (filtros.hasta !== "") {

            const [anio, mes, dia] = filtros.hasta.split("-");

            const hasta = new Date(

                Number(anio),

                Number(mes) - 1,

                Number(dia)

            );

            hasta.setHours(23, 59, 59, 999);

            registros = registros.filter(r =>

                r.fechaServidor &&

                r.fechaServidor.toDate() <= hasta

            );

        }

        //----------------------------------------
        // ORDENAR
        //----------------------------------------

        registros.sort((a, b) => {

            if (!a.fechaServidor || !b.fechaServidor) {

                return 0;

            }

            return (

                b.fechaServidor.seconds -

                a.fechaServidor.seconds

            );

        });

        console.log("Registros encontrados:", registros.length);

        mostrarResultados();

    }

    catch (error) {

        console.error(error);

    }

}

//====================================================
// MOSTRAR RESULTADOS
//====================================================

function mostrarResultados() {

    console.log("Mostrando resultados...");

    const tbody = document.getElementById("tablaConsulta");

    tbody.innerHTML = "";

    //----------------------------------------
    // SIN RESULTADOS
    //----------------------------------------

    if (registros.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="8"
                    style="text-align:center;padding:20px;">

                    No se encontraron registros.

                </td>

            </tr>

        `;

        return;

    }

    //----------------------------------------
    // RECORRER REGISTROS
    //----------------------------------------

    registros.forEach(registro => {

        const fecha = registro.fechaServidor

            ? registro.fechaServidor
                .toDate()
                .toLocaleDateString("es-CO")

            : "";

        const hora = registro.fechaServidor

            ? registro.fechaServidor
                .toDate()
                .toLocaleTimeString("es-CO")

            : "";
                    const fila = `

            <tr>

                <td>${registro.documento || ""}</td>

                <td>${registro.nombre || ""}</td>

                <td>${registro.puntoNombre || ""}</td>

                <td>${fecha}</td>

                <td>${hora}</td>

                <td>${registro.tipo || ""}</td>

                <td style="text-align:center;">

                    <button
                        onclick="verFoto('${registro.id}')">

                        📷

                    </button>

                </td>

                <td style="text-align:center;">

                    <button
                        onclick="verMapa('${registro.id}')">

                        📍

                    </button>

                </td>

            </tr>

        `;

        tbody.insertAdjacentHTML(

            "beforeend",

            fila

        );

    });

    console.log(

        "Filas cargadas:",

        registros.length

    );

}

//====================================================
// VER FOTO
//====================================================

function verFoto(idRegistro) {

    const registro = registros.find(

        r => r.id === idRegistro

    );

    if (!registro) {

        alert("Registro no encontrado.");

        return;

    }

    if (!registro.foto) {

        alert("Este registro no tiene fotografía.");

        return;

    }

    const modal = document.getElementById("modalFoto");

    const imagen = document.getElementById("imagenGrande");

    imagen.src = registro.foto;

    modal.style.display = "flex";

}

//====================================================
// CERRAR FOTO
//====================================================

function cerrarFoto() {

    document.getElementById("modalFoto").style.display = "none";

}

//====================================================
// CERRAR MODAL FOTO
//====================================================

function cerrarModalFoto() {

    document.getElementById("modalFoto").style.display = "none";

}

//====================================================
// VER MAPA
//====================================================

function verMapa(idRegistro) {

    const registro = registros.find(

        r => r.id === idRegistro

    );

    if (!registro) {

        alert("Registro no encontrado.");

        return;

    }

    if (!registro.latitud || !registro.longitud) {

        alert("Este registro no tiene ubicación.");

        return;

    }

    const lat = parseFloat(registro.latitud);

    const lng = parseFloat(registro.longitud);

    document.getElementById("modalMapa").style.display = "flex";

    setTimeout(() => {

        if (mapa) {

            mapa.remove();

        }

        mapa = L.map("mapaRegistro").setView(

            [lat, lng],

            17

        );

        L.tileLayer(

            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

            {

                attribution: "&copy; OpenStreetMap"

            }

        ).addTo(mapa);

        L.marker([lat, lng])

            .addTo(mapa)

            .bindPopup(registro.nombre)

            .openPopup();

    }, 200);

}
//====================================================
// CERRAR MAPA
//====================================================

function cerrarMapa() {

    document.getElementById("modalMapa").style.display = "none";

}

document.getElementById("cerrarMapa").onclick = cerrarMapa;

//====================================================
// FUNCIONES GLOBALES
//====================================================

window.verFoto = verFoto;
window.verMapa = verMapa;