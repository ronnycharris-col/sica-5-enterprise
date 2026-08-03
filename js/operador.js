//====================================================
// SICA
// operador.js
// PARTE 1
//====================================================

//====================================================
// FIREBASE
//====================================================

import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    addDoc,
    onSnapshot,
    Timestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

//====================================================
// SESIÓN
//====================================================

const usuarioActivo = JSON.parse(
    sessionStorage.getItem("usuarioActivo")
);

if (!usuarioActivo) {

    alert("Debe iniciar sesión.");

    window.location.href = "index.html";

    throw new Error("Sesión no encontrada.");

}


//====================================================
// CONTROLES
//====================================================

const txtDocumento = document.getElementById("documento");
const txtNombre = document.getElementById("nombre");
const cmbPuntoVenta = document.getElementById("puntoventa");
const txtBuscarPunto =
    document.getElementById("buscarPuntoVenta");

const listaPuntos =
    document.getElementById("listaPuntos");
const btnEntrada = document.getElementById("btnEntrada");
const btnSalida = document.getElementById("btnSalida");
const btnFoto = document.getElementById("btnFoto");
const btnLimpiar = document.getElementById("btnLimpiar");

const tablaRegistros = document.getElementById("tablaRegistros");

const video = document.getElementById("camara");
const canvas = document.getElementById("foto");
const preview = document.getElementById("preview");

const lblUbicacion = document.getElementById("ubicacion");


//====================================================
// VARIABLES
//====================================================

let puntosVenta = [];

let fotoBase64 = "";
let fechaFoto = null;

const TIEMPO_MAX_FOTO = 60 * 1000; // 60 segundos
let temporizadorFoto = null;
let latitud = "";
let longitud = "";

let fechaGPS = null;
const TIEMPO_MAX_GPS = 60 * 1000; // 60 segundos
let idWatchGPS = null;
//====================================================
// REGISTROS DEL DÍA
//====================================================

let registrosHoy = [];

//====================================================
// CARGAR USUARIO
//====================================================

function cargarUsuario() {

    txtDocumento.value = usuarioActivo.usuario;

    txtNombre.value = usuarioActivo.nombre;

    txtDocumento.readOnly = true;

    txtNombre.readOnly = true;

}


//====================================================
// CARGAR PUNTOS DE VENTA
//====================================================

async function cargarPuntosVenta() {

    cmbPuntoVenta.innerHTML =
        '<option value="">Seleccione un punto de venta</option>';

    puntosVenta = [];

    try {

        const consulta = query(
            collection(db, "puntosVenta"),
            orderBy("nombre")
        );

        const snapshot = await getDocs(consulta);

        snapshot.forEach((doc) => {

            const punto = doc.data();

            puntosVenta.push(punto);

            const option = document.createElement("option");

            option.value = punto.codigo;

            option.textContent =
                punto.codigo + " - " + punto.nombre;

            cmbPuntoVenta.appendChild(option);

        });

    } catch (error) {

        console.error(error);

        alert("No fue posible cargar los puntos de venta.");

    }

}
//====================================================
// BUSCADOR DE PUNTOS DE VENTA
//====================================================

function iniciarBuscadorPuntos() {

    txtBuscarPunto.addEventListener("input", () => {

        const texto = txtBuscarPunto.value
            .toLowerCase()
            .trim();

        listaPuntos.innerHTML = "";

        if (texto === "") {

            listaPuntos.style.display = "none";

            return;

        }

        const encontrados = puntosVenta.filter((punto) => {

    return (

        (punto.nombre || "").toLowerCase().includes(texto)

        ||

        String(punto.codigo || "").includes(texto)

    );

});

        if (encontrados.length === 0) {

            listaPuntos.style.display = "none";

            return;

        }

        encontrados
            .slice(0, 8)
            .forEach((punto) => {

                const item = document.createElement("div");

                item.className = "item-empleado";

                item.innerHTML = `
                    <strong>${punto.nombre}</strong>
                    <small>${punto.codigo}</small>
                `;

                item.addEventListener("click", () => {

                    txtBuscarPunto.value = punto.nombre;

                    cmbPuntoVenta.value = punto.codigo;

                    listaPuntos.innerHTML = "";

                    listaPuntos.style.display = "none";

                });

                listaPuntos.appendChild(item);

            });

        listaPuntos.style.display = "block";

    });

}
//====================================================
// OBTENER UBICACIÓN GPS
//====================================================

function obtenerUbicacion() {

    if (!navigator.geolocation) {

        lblUbicacion.textContent =
            "El navegador no soporta geolocalización.";

        return;
    }

    // Evitar crear varios watchPosition
    if (idWatchGPS !== null) {
        return;
    }

    lblUbicacion.textContent = "Obteniendo ubicación...";

    idWatchGPS = navigator.geolocation.watchPosition(

        (posicion) => {

            latitud = posicion.coords.latitude;
            longitud = posicion.coords.longitude;
            fechaGPS = new Date();

            lblUbicacion.textContent =
                "Lat: " +
                latitud.toFixed(6) +
                " | Lon: " +
                longitud.toFixed(6);

        },

        (error) => {

            console.error(error);

            lblUbicacion.textContent =
                "No fue posible obtener la ubicación.";

        },

        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000
        }

    );

}

//====================================================
// ABRIR CÁMARA
//====================================================

async function abrirCamara() {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: "user"
                },

                audio: false

            });

        video.srcObject = stream;

        await video.play();

    }

    catch (error) {

        console.error(error);

        alert("No fue posible acceder a la cámara.");

    }

}


//====================================================
// TOMAR FOTOGRAFÍA
//====================================================

function tomarFoto() {

    const contexto =
        canvas.getContext("2d");

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    contexto.drawImage(

        video,

        0,

        0,

        canvas.width,

        canvas.height

    );

    fotoBase64 =
    canvas.toDataURL("image/jpeg", 0.90);

// Guardar la fecha y hora exacta de la captura
fechaFoto = new Date();
// Cancelar un temporizador anterior
if (temporizadorFoto) {
    clearTimeout(temporizadorFoto);
}

// Iniciar un nuevo temporizador
temporizadorFoto = setTimeout(() => {

    fotoBase64 = "";
    fechaFoto = null;
   
    
lblUbicacion.textContent = "Actualizando ubicación...";
    preview.src = "";
    preview.style.display = "none";

    alert("La fotografía expiró por seguridad. Debe tomar una nueva.");
    temporizadorFoto = null;
}, TIEMPO_MAX_FOTO);    
preview.src = fotoBase64;

preview.style.display = "block";

}


//====================================================
// VALIDAR FOTO
//====================================================

function validarFoto() {

    if (fotoBase64 === "") {

        alert("Debe tomar una fotografía.");

        return false;

    }

    return true;

}
//====================================================
// VALIDAR VIGENCIA DE LA FOTOGRAFÍA
//====================================================

function validarVigenciaFoto() {

    if (fechaFoto === null) {
        alert("Debe tomar una fotografía.");
        return false;
    }

    const tiempoTranscurrido =
        new Date().getTime() - fechaFoto.getTime();

    if (tiempoTranscurrido > TIEMPO_MAX_FOTO) {

        // Eliminar fotografía
        fotoBase64 = "";
        fechaFoto = null;

        // Eliminar GPS anterior
        
        // Detener temporizador
        if (temporizadorFoto) {
            clearTimeout(temporizadorFoto);
            temporizadorFoto = null;
        }

        // Limpiar vista previa
        preview.src = "";
        preview.style.display = "none";

        // Solicitar una nueva ubicación
lblUbicacion.textContent = "Actualizando ubicación...";

setTimeout(() => {
    obtenerUbicacion();
}, 500);

        alert(
            "La fotografía ha expirado. Debe tomar una nueva."
        );

        return false;
    }

    return true;
}
//====================================================
// VALIDAR GPS
//====================================================

function validarGPS() {

    if (latitud === "" || longitud === "") {

        alert("No fue posible obtener la ubicación GPS.");

        return false;

    }

    return true;

}
//====================================================
// VALIDAR VIGENCIA DEL GPS
//====================================================

function validarVigenciaGPS() {

    if (fechaGPS === null) {

        alert("Debe actualizar la ubicación GPS.");

        return false;

    }

    const tiempoTranscurrido =
        new Date().getTime() - fechaGPS.getTime();

    if (tiempoTranscurrido > TIEMPO_MAX_GPS) {

        

            

        return false;

    }

    return true;

}
//====================================================
// REGISTRAR ENTRADA
//====================================================

async function registrarEntrada() {

    if (cmbPuntoVenta.value === "") {

        alert("Seleccione un punto de venta.");

        return;

    }

    if (!validarFoto()) return;

if (!validarVigenciaFoto()) return;

if (!validarGPS()) return;

if (!validarVigenciaGPS()) return;
    const punto = puntosVenta.find(
        p => p.codigo === cmbPuntoVenta.value
    );

    if (!punto) {

        alert("No se encontró el punto de venta.");

        return;

    }

    //--------------------------------------------------
    // VALIDAR DOBLE ENTRADA
    //--------------------------------------------------

    try {
const consulta = query(
    collection(db, "registros"),
    where("documento", "==", txtDocumento.value),
    orderBy("fechaServidor", "desc")
);

const snapshot = await getDocs(consulta);

let ultimoRegistro = null;

if (!snapshot.empty) {

    ultimoRegistro = snapshot.docs[0].data();

}

if (
    ultimoRegistro &&
    ultimoRegistro.tipo === "Entrada"
) {

    alert(
        "Tiene una entrada pendiente. Debe registrar primero la salida antes de registrar una nueva entrada."
    );

    return;

}

        //--------------------------------------------------
        // GUARDAR EN FIRESTORE
        //--------------------------------------------------

        const ahora = new Date();

        await addDoc(

            collection(db, "registros"),

            {

                documento: txtDocumento.value,

                nombre: txtNombre.value,

                puntoCodigo: punto.codigo,

                puntoNombre: punto.nombre,

                ciudad: punto.ciudad,

                fecha: ahora.toLocaleDateString("es-CO"),

                hora: ahora.toLocaleTimeString("es-CO"),

                tipo: "Entrada",

                foto: fotoBase64,

                latitud: latitud,

                longitud: longitud,

                fechaServidor: Timestamp.now()

            }

        );

        alert("Entrada registrada correctamente.");

        fotoBase64 = "";
        fechaFoto = null;
        

lblUbicacion.textContent = "Actualizando ubicación...";

if (temporizadorFoto) {
    clearTimeout(temporizadorFoto);
    temporizadorFoto = null;
}

preview.src = "";
preview.style.display = "none";

obtenerUbicacion();
       

    }

    catch (error) {

        console.error(error);

        alert("No fue posible registrar la entrada.");

    }

}
//====================================================
// REGISTRAR SALIDA
//====================================================

async function registrarSalida() {

    if (cmbPuntoVenta.value === "") {

        alert("Seleccione un punto de venta.");

        return;

    }

    if (!validarFoto()) return;

if (!validarVigenciaFoto()) return;

if (!validarGPS()) return;

if (!validarVigenciaGPS()) return;
    const punto = puntosVenta.find(
        p => p.codigo === cmbPuntoVenta.value
    );

    if (!punto) {

        alert("No se encontró el punto de venta.");

        return;

    }

    try {

        //--------------------------------------------------
// BUSCAR ÚLTIMA ENTRADA ABIERTA
//--------------------------------------------------

const consulta = query(
    collection(db, "registros"),
    where("documento", "==", txtDocumento.value),
    orderBy("fechaServidor", "desc")
);

const snapshot = await getDocs(consulta);

let tieneEntrada = false;
let tieneSalida = false;

snapshot.forEach((doc) => {

    if (tieneEntrada) return;

    const registro = doc.data();

    if (registro.tipo === "Entrada") {

        tieneEntrada = true;

    }

    if (registro.tipo === "Salida") {

        tieneSalida = true;

    }

});

        //--------------------------------------------------
        // VALIDACIONES
        //--------------------------------------------------

        if (!tieneEntrada) {

            alert("No existe una entrada registrada para hoy.");

            return;

        }

        if (tieneSalida) {

            alert("La salida ya fue registrada.");

            return;

        }

        //--------------------------------------------------
        // GUARDAR SALIDA
        //--------------------------------------------------

        const ahora = new Date();

        await addDoc(

            collection(db, "registros"),

            {

                documento: txtDocumento.value,

                nombre: txtNombre.value,

                puntoCodigo: punto.codigo,

                puntoNombre: punto.nombre,

                ciudad: punto.ciudad,

                fecha: ahora.toLocaleDateString("es-CO"),

                hora: ahora.toLocaleTimeString("es-CO"),

                tipo: "Salida",

                foto: fotoBase64,

                latitud: latitud,

                longitud: longitud,

                fechaServidor: Timestamp.now()

            }

        );

        alert("Salida registrada correctamente.");

        fotoBase64 = "";
        fechaFoto = null;
        
lblUbicacion.textContent = "Actualizando ubicación...";
        if (temporizadorFoto) {
    clearTimeout(temporizadorFoto);
    temporizadorFoto = null;
}
        preview.src = "";

        preview.style.display = "none";

        obtenerUbicacion();

    }

    catch (error) {

        console.error(error);

        alert("No fue posible registrar la salida.");

    }

}
//====================================================
// ESCUCHAR REGISTROS DEL DÍA
// TIEMPO REAL
//====================================================

function escucharRegistrosHoy() {

    const hoy =
        new Date().toLocaleDateString("es-CO");

    const consulta = query(

        collection(db, "registros"),

        where("documento", "==", txtDocumento.value),

        where("fecha", "==", hoy)

    );

    onSnapshot(

        consulta,

        (snapshot) => {

            //------------------------------------------------
            // LIMPIAR MEMORIA
            //------------------------------------------------

            registrosHoy = [];

            //------------------------------------------------
            // LIMPIAR TABLA
            //------------------------------------------------

            tablaRegistros.innerHTML = "";

            //------------------------------------------------
            // RECORRER FIRESTORE
            //------------------------------------------------

            snapshot.forEach((doc) => {

                const registro = {

                    id: doc.id,

                    ...doc.data()

                };

                registrosHoy.push(registro);

            });

            //------------------------------------------------
            // ORDENAR POR HORA
            //------------------------------------------------

            registrosHoy.sort((a, b) => {

                if (!a.fechaServidor || !b.fechaServidor) {

                    return 0;

                }

                return (

                    a.fechaServidor.toMillis() -

                    b.fechaServidor.toMillis()

                );

            });

            //------------------------------------------------
            // PINTAR TABLA
            //------------------------------------------------

            registrosHoy.forEach((registro) => {

                tablaRegistros.innerHTML += `

                    <tr>

                        <td>${registro.documento}</td>

                        <td>${registro.nombre}</td>

                        <td>${registro.puntoNombre}</td>

                        <td>${registro.ciudad}</td>

                        <td>${registro.fecha}</td>

                        <td>${registro.hora}</td>

                        <td>${registro.tipo}</td>

                    </tr>

                `;

            });

        },

        (error) => {

            console.error(error);

            alert("Error cargando registros.");

        }

    );

}

//====================================================
// LIMPIAR REGISTROS DE PRUEBA
//====================================================

async function limpiarRegistros() {

    alert("Esta función se implementará únicamente para administradores.");

}


//====================================================
// EVENTOS
//====================================================

btnEntrada.addEventListener("click", async () => {

    btnEntrada.disabled = true;
    btnSalida.disabled = true;

    try {

        await registrarEntrada();

    } finally {

        btnEntrada.disabled = false;
        btnSalida.disabled = false;

    }

});



btnSalida.addEventListener("click", async () => {

    btnEntrada.disabled = true;
    btnSalida.disabled = true;

    try {

        await registrarSalida();

    } finally {

        btnEntrada.disabled = false;
        btnSalida.disabled = false;

    }

});



btnFoto.addEventListener("click", () => {

    tomarFoto();

});



btnLimpiar.addEventListener("click", limpiarRegistros);



//====================================================
// INICIALIZACIÓN
//====================================================

window.addEventListener("load", async () => {

    cargarUsuario();

    await cargarPuntosVenta();

    iniciarBuscadorPuntos();

    obtenerUbicacion();

    abrirCamara();

    escucharRegistrosHoy();

});