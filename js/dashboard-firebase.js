//====================================================
// SICA 5.0 ENTERPRISE
// dashboard-firebase.js
//====================================================

//====================================================
// IMPORTACIONES
//====================================================

import { db } from "./firebase.js";

import {
    collection,
    query,
    orderBy,
    getDocs,
    onSnapshot,
    where,
    Timestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import {

    actualizarKPIs,
    actualizarResumen

} from "./dashboard-ui.js";

import {

    actualizarOperadores

} from "./dashboard-operadores.js";

import {

    actualizarMapa

} from "./mapa.js";
import {

    actualizarGraficaPuntos

} from "./dashboard-graficas.js";
import {

    actualizarTendencias

} from "./dashboard-tendencias.js";
import {

    actualizarAlertas

} from "./dashboard-alertas.js";
//====================================================
// VARIABLES
//====================================================

let empleados = [];

let puntosVenta = [];

let registros = [];
//====================================================
// INICIO
//====================================================

export async function iniciarFirebaseDashboard(){

    console.log("Conectando Dashboard con Firebase...");

    await cargarEmpleados();

    await cargarPuntosVenta();

    escucharRegistros();

}

//====================================================
// CARGAR EMPLEADOS
//====================================================

async function cargarEmpleados(){
if (empleados.length > 0) {
    return;
}
    try{

        const snapshot = await getDocs(

            collection(db,"empleados")

        );

        empleados = [];

        snapshot.forEach((doc)=>{

            empleados.push({

                id:doc.id,

                ...doc.data()

            });

        });

        
    }

    catch(error){

        console.error(

            "Error empleados:",

            error

        );

    }

}

//====================================================
// CARGAR PUNTOS DE VENTA
//====================================================

async function cargarPuntosVenta(){
if (puntosVenta.length > 0) {
    return;
}
    try{

        const consulta = query(

            collection(db,"puntosVenta"),

            orderBy("nombre")

        );

        const snapshot = await getDocs(

            consulta

        );

        puntosVenta = [];

        snapshot.forEach((doc)=>{

            puntosVenta.push({

                id:doc.id,

                ...doc.data()

            });

        });

        console.log(

            "Puntos:",

            puntosVenta.length

        );

    }

    catch(error){

        console.error(

            "Error puntos:",

            error

        );

    }

}
//====================================================
// ESCUCHAR REGISTROS EN TIEMPO REAL
//====================================================

function escucharRegistros(){

    // Inicio del día
const inicioDia = new Date();
inicioDia.setHours(0, 0, 0, 0);

// Inicio del día siguiente
const finDia = new Date(inicioDia);
finDia.setDate(finDia.getDate() + 1);

const consulta = query(
    collection(db, "registros"),
    where("fechaServidor", ">=", Timestamp.fromDate(inicioDia)),
    where("fechaServidor", "<", Timestamp.fromDate(finDia)),
    orderBy("fechaServidor", "desc")
);

    onSnapshot(

        consulta,

        (snapshot)=>{

            registros = [];

            snapshot.forEach((doc)=>{

                registros.push({

                    id:doc.id,

                    ...doc.data()

                });

            });

            console.log(

                "Registros:",

                registros.length

            );

            procesarDashboard();

        },

        (error)=>{

            console.error(

                "Error escuchando registros:",

                error

            );

        }

    );

}
//====================================================
// OBTENER PERSONAL PRESENTE
//====================================================

function obtenerPersonalPresente(registrosHoy){

    //--------------------------------------------------
    // ÚLTIMO MOVIMIENTO POR OPERADOR
    //--------------------------------------------------

    const ultimoMovimiento = new Map();

    registrosHoy.forEach((registro)=>{

        //--------------------------------------------------
        // Los registros ya vienen ordenados DESC por fechaServidor.
        // Conservamos SOLO el primer registro de cada operador.
        //--------------------------------------------------

        if(!ultimoMovimiento.has(registro.documento)){

            ultimoMovimiento.set(

                registro.documento,

                registro

            );

        }

    });

    //--------------------------------------------------
    // SOLO LOS QUE SU ÚLTIMO MOVIMIENTO ES ENTRADA
    //--------------------------------------------------

    return Array.from(

        ultimoMovimiento.values()

    ).filter((registro)=>

        registro.tipo === "Entrada"

    );

}
//====================================================
// CALCULAR PERMANENCIA PROMEDIO
//====================================================

function calcularPermanenciaPromedio(registrosHoy){

    const presentes = obtenerPersonalPresente(registrosHoy);

    let minutosTotales = 0;

    let cantidad = 0;

    const ahora = new Date();

    presentes.forEach((operador)=>{

        if(!operador.fechaServidor){

            return;

        }

        const entrada = operador.fechaServidor.toDate();

        const minutos = Math.floor(

            (ahora - entrada) / 60000

        );

        if(minutos >= 0){

            minutosTotales += minutos;

            cantidad++;

        }

    });

    if(cantidad === 0){

        return "--";

    }

    const promedio = Math.floor(

        minutosTotales / cantidad

    );

    const horas = Math.floor(promedio / 60);

    const minutos = promedio % 60;

    return `${horas} h ${minutos} min`;

}
//====================================================
// PROCESAR DASHBOARD
//====================================================

function procesarDashboard(){

    //--------------------------------------------------
    // FECHA ACTUAL
    //--------------------------------------------------

    const hoy = new Date().toLocaleDateString("es-CO");

    //--------------------------------------------------
    // VARIABLES
    //--------------------------------------------------

    let entradas = 0;

    let salidas = 0;

    const registrosHoy = [];

    //--------------------------------------------------
    // FILTRAR REGISTROS DEL DÍA
    //--------------------------------------------------

    registros.forEach((registro)=>{

        if(registro.fecha !== hoy){

            return;

        }

        registrosHoy.push(registro);

        if(registro.tipo === "Entrada"){

            entradas++;

        }

        if(registro.tipo === "Salida"){

            salidas++;

        }

    });

    //--------------------------------------------------
    // PERSONAL PRESENTE
    //--------------------------------------------------

    const personalPresente =

        obtenerPersonalPresente(

            registrosHoy
        
        );
       

        //--------------------------------------------------
// INDICADORES DEL DÍA
//--------------------------------------------------

const lblHoraPico = document.getElementById("indHoraPico");

const lblPromedio = document.getElementById("indPromedio");

const lblPermanencia = document.getElementById("indPermanencia");

const lblPendientes = document.getElementById("indPendientes");

//-----------------------------------------------
// Salidas pendientes
//-----------------------------------------------

if(lblPendientes){

    lblPendientes.textContent = personalPresente.length;

}

//-----------------------------------------------
// Promedio por hora
//-----------------------------------------------

const horaActual = new Date().getHours() + 1;

const promedio =

    horaActual > 0

        ? (entradas / horaActual).toFixed(1)

        : 0;

if(lblPromedio){

    lblPromedio.textContent = promedio;

}

//-----------------------------------------------
// PERMANENCIA PROMEDIO
//-----------------------------------------------

if(lblPermanencia){

    lblPermanencia.textContent =

        calcularPermanenciaPromedio(

            registrosHoy

        );

}
//--------------------------------------------------
// DIAGNÓSTICO
//--------------------------------------------------

const ultimoMovimiento = new Map();

registrosHoy.forEach((registro)=>{

    if(!ultimoMovimiento.has(registro.documento)){

        ultimoMovimiento.set(

            registro.documento,

            registro

        );

    }

});



    






//--------------------------------------------------
// VERIFICAR ENTRADAS DUPLICADAS
//--------------------------------------------------

const conteoEntradas = {};

registrosHoy.forEach((registro)=>{

    if(registro.tipo !== "Entrada"){

        return;

    }

    conteoEntradas[registro.documento] =

        (conteoEntradas[registro.documento] || 0) + 1;

});


    //--------------------------------------------------
    // KPIs
    //--------------------------------------------------

    const datos={

        operadores: empleados.length,

        puntosVenta: puntosVenta.length,

        entradas: entradas,

        salidas: salidas,

        pendientes: personalPresente.length

    };

    //--------------------------------------------------
    // ACTUALIZAR DASHBOARD
    //--------------------------------------------------

    actualizarKPIs(datos);

    actualizarResumen(datos);

   actualizarOperadores(

    personalPresente

);

actualizarMapa(

    personalPresente

);

actualizarGraficaPuntos(

    registrosHoy,

    personalPresente

);
actualizarTendencias(

    registrosHoy

);
actualizarAlertas(

    registrosHoy,

    personalPresente

);
//--------------------------------------------------
// CENTRO DE OPERACIONES
//--------------------------------------------------

const lblOperando = document.getElementById("pvOperando");

const lblSinIniciar = document.getElementById("pvSinIniciar");

if(lblOperando && lblSinIniciar){

    //--------------------------------------------------
    // PUNTOS CON OPERADORES
    //--------------------------------------------------

    const puntosOperando = new Set();

    personalPresente.forEach((operador)=>{

        if(operador.puntoNombre){

            puntosOperando.add(

                operador.puntoNombre

            );

        }

    });

    //--------------------------------------------------
    // PUNTOS SIN INICIAR
    //--------------------------------------------------

    const operando = puntosOperando.size;

    const sinIniciar =

        puntosVenta.length - operando;

    //--------------------------------------------------
    // ACTUALIZAR ETIQUETAS
    //--------------------------------------------------

    lblOperando.textContent =

        `🟢 Operando: ${operando}`;

    lblSinIniciar.textContent =

        `🔴 Sin iniciar: ${Math.max(0,sinIniciar)}`;

}
//--------------------------------------------------
// BARRAS KPI
//--------------------------------------------------

const totalOperadores = empleados.length || 1;

const totalPV = puntosVenta.length || 1;

// Operadores
const porcentajeOperadores = 100;

// Entradas
const porcentajeEntradas = Math.round(
    (entradas / totalOperadores) * 100
);

// Salidas
const porcentajeSalidas = Math.round(
    (salidas / totalOperadores) * 100
);

// Pendientes
const porcentajePendientes = Math.round(
    (personalPresente.length / totalOperadores) * 100
);

// Puntos de Venta
const porcentajePV = 100;

//--------------------------------------------------
// ACTUALIZAR BARRAS
//--------------------------------------------------

document.getElementById("barraOperadores").style.width =
    porcentajeOperadores + "%";

document.getElementById("barraEntradas").style.width =
    porcentajeEntradas + "%";

document.getElementById("barraSalidas").style.width =
    porcentajeSalidas + "%";

document.getElementById("barraPendientes").style.width =
    porcentajePendientes + "%";

document.getElementById("barraPV").style.width =
    porcentajePV + "%";

//--------------------------------------------------
// PORCENTAJES
//--------------------------------------------------

document.getElementById("porcentajeOperadores").textContent =
    porcentajeOperadores + "%";

document.getElementById("porcentajeEntradas").textContent =
    porcentajeEntradas + "%";

document.getElementById("porcentajeSalidas").textContent =
    porcentajeSalidas + "%";

document.getElementById("porcentajePendientes").textContent =
    porcentajePendientes + "%";

document.getElementById("porcentajePV").textContent =
    porcentajePV + "%";
}
//====================================================
// FIN DEL MÓDULO
//====================================================

console.log(

    "%cDashboard Firebase cargado correctamente",

    "color:#16A34A;font-weight:bold;font-size:14px;"

);