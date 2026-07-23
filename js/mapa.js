//====================================================
// SICA 5.0 ENTERPRISE
// MAPA EN TIEMPO REAL
// PARTE 1
//====================================================
//====================================================
// IMPORTACIONES
//====================================================

import {

    abrirPanelPV

} from "./dashboard-puntoventa.js";
//====================================================
// VARIABLES
//====================================================

let mapa = null;
//====================================================
// CAPA DEL MAPA
//====================================================

let capaMapa = null;
let marcadores = [];

//====================================================
// INICIAR MAPA
//====================================================

export function iniciarMapa() {

    const contenedor = document.getElementById("mapaContainer");

    if (!contenedor) {

        console.warn("No existe mapaContainer");

        return;

    }

    //------------------------------------------------
    // EVITAR CREAR DOS MAPAS
    //------------------------------------------------

    if (mapa) {

        return;

    }

    //------------------------------------------------
    // CREAR MAPA
    //------------------------------------------------

    mapa = L.map("mapaContainer", {

        zoomControl: true

    }).setView([4.5709, -74.2973], 6);

    //------------------------------------------------
    // CAPA BASE
    //------------------------------------------------

    capaMapa = L.tileLayer(

    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    {

        maxZoom:19,

        attribution:"&copy; OpenStreetMap"

    }

);

capaMapa.addTo(mapa);

   

}

//====================================================
// LIMPIAR MARCADORES
//====================================================

function limpiarMarcadores() {

    marcadores.forEach(marcador => {

        mapa.removeLayer(marcador);

    });

    marcadores = [];

}
//====================================================
// AGRUPAR PUNTOS DE VENTA
//====================================================

function agruparPuntosVenta(registros){

    const puntos = {};

    registros.forEach(registro=>{

        //------------------------------------------------
        // VALIDAR INFORMACIÓN
        //------------------------------------------------

        if(
            !registro.puntoNombre ||
            !registro.latitud ||
            !registro.longitud
        ){
            return;
        }

        //------------------------------------------------
        // CREAR EL PUNTO
        //------------------------------------------------

        if(!puntos[registro.puntoNombre]){

            puntos[registro.puntoNombre]={

                nombre:registro.puntoNombre,

                latitud:Number(registro.latitud),

                longitud:Number(registro.longitud),

                operadores:[],

                entradas:0,

                salidas:0,

                pendientes:0,

                ultimoMovimiento:"--"

            };

        }

        //------------------------------------------------
        // AGREGAR OPERADOR
        //------------------------------------------------

        puntos[registro.puntoNombre].operadores.push(registro);

        //------------------------------------------------
        // CONTADORES
        //------------------------------------------------

        if(registro.tipo==="Entrada"){

            puntos[registro.puntoNombre].entradas++;

        }

        if(registro.tipo==="Salida"){

            puntos[registro.puntoNombre].salidas++;

        }

        //------------------------------------------------
        // ÚLTIMO MOVIMIENTO
        //------------------------------------------------

        puntos[registro.puntoNombre].ultimoMovimiento=registro.hora;

    });

    //------------------------------------------------
    // CALCULAR PENDIENTES
    //------------------------------------------------

    Object.values(puntos).forEach(punto=>{

        punto.pendientes=

            punto.entradas-

            punto.salidas;

    });

    return Object.values(puntos);

}
//====================================================
// ACTUALIZAR MAPA
//====================================================

export function actualizarMapa(registros){

    if(!mapa){

        return;

    }

    limpiarMarcadores();

    const puntos = agruparPuntosVenta(registros);

  

    puntos.forEach(punto=>{

        //------------------------------------------------
        // ESTADO
        //------------------------------------------------

        //------------------------------------------------
// ESTADO DEL PUNTO
//------------------------------------------------

let estado = "marker-incidencia"; // 🔴 Sin iniciar

if (punto.entradas > 0) {

    estado = "marker-normal"; // 🟢 Operando

}

        //------------------------------------------------
// ICONO ENTERPRISE
//------------------------------------------------

const cantidad = punto.operadores.length;

const icono = L.divIcon({

    className: "",

    html: `

        <div class="marker-enterprise">

            <div class="marker-numero">

                ${cantidad}

            </div>

            <div class="marker-pv ${estado}"></div>

        </div>

    `,

    iconSize: [40, 52],

    iconAnchor: [20, 40]

});

        //------------------------------------------------
        // MARCADOR
        //------------------------------------------------

        const marcador=L.marker(

            [

                punto.latitud,

                punto.longitud

            ],

            {

                icon:icono

            }

        ).addTo(mapa);

        //------------------------------------------------
        // POPUP
        //------------------------------------------------

       //------------------------------------------------
// ESTADO DEL PUNTO
//------------------------------------------------

let textoEstado = "🔴 Sin iniciar";

if (estado === "marker-normal") {

    textoEstado = "🟢 Operando";

}

//------------------------------------------------
// POPUP ENTERPRISE
//------------------------------------------------

marcador.bindPopup(`

<div class="popup-pv">

    <h3>📍 ${punto.nombre}</h3>

    <div class="popup-estado">

        ${textoEstado}

    </div>

    <hr>

    <div class="popup-item">

        👥 <strong>Operadores:</strong>

        ${punto.operadores.length}

    </div>

    <div class="popup-item">

        🟢 <strong>Entradas:</strong>

        ${punto.entradas}

    </div>

    <div class="popup-item">

        🔴 <strong>Salidas:</strong>

        ${punto.salidas}

    </div>

    <div class="popup-item">

        🟡 <strong>Pendientes:</strong>

        ${punto.pendientes}

    </div>

    <div class="popup-item">

        🕒 <strong>Último movimiento:</strong>

        ${punto.ultimoMovimiento}

    </div>

    <button class="btn-popup">

        Ver detalle

    </button>

</div>

`);

        marcadores.push(marcador);
//------------------------------------------------
// PRUEBA DE CONEXIÓN
//------------------------------------------------

marcador.on("click", ()=>{

    abrirPanelPV(punto);

});
    });

}
//====================================================
// CENTRAR OPERADOR
//====================================================

window.mostrarOperadorMapa = function(operador){

    if(!mapa){

        return;

    }

    if(!operador.latitud || !operador.longitud){

        return;

    }

    mapa.flyTo(

        [

            Number(operador.latitud),

            Number(operador.longitud)

        ],

        17,

        {

            duration:1.5

        }

    );

};
//====================================================
// CAMBIAR TEMA DEL MAPA
//====================================================

export function cambiarTemaMapa(modo){

    if(!mapa || !capaMapa){

        return;

    }

    //------------------------------------------------
    // ELIMINAR CAPA ACTUAL
    //------------------------------------------------

    mapa.removeLayer(capaMapa);

    //------------------------------------------------
// MODO OSCURO
//------------------------------------------------

// El Dashboard puede estar en modo oscuro,
// pero el mapa siempre se mostrará en modo claro
// para mejorar la visibilidad.

if(modo==="dark"){

    capaMapa = L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            maxZoom:19,

            attribution:"&copy; OpenStreetMap"

        }

    );

}
    //------------------------------------------------
    // MODO CLARO
    //------------------------------------------------

    else{

        capaMapa = L.tileLayer(

            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

            {

                maxZoom:19,

                attribution:"&copy; OpenStreetMap"

            }

        );

    }

    //------------------------------------------------
    // AGREGAR NUEVA CAPA
    //------------------------------------------------

    capaMapa.addTo(mapa);

}