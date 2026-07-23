//====================================================
// SICA 5.0 ENTERPRISE
// dashboard-ui.js
// PARTE 1
//====================================================

//====================================================
// IMPORTACIONES
//====================================================

import {

    cambiarTemaMapa

} from "./mapa.js";

//====================================================
// INICIAR UI
//====================================================

export function iniciarDashboardUI(){

    actualizarHora();

    setInterval(

        actualizarHora,

        1000

    );

    iniciarBotones();

}

//====================================================
// BOTONES DEL DASHBOARD
//====================================================

function iniciarBotones(){

    //------------------------------------------------
    // BOTÓN INICIO
    //------------------------------------------------

    const btnInicio = document.getElementById(

        "btnInicio"

    );

    if(btnInicio){

        btnInicio.addEventListener(

            "click",

            ()=>{

                window.location.href = "menu.html";

            }

        );

    }

    //------------------------------------------------
    // BOTÓN ACTUALIZAR
    //------------------------------------------------

    const btnActualizar = document.getElementById(

        "btnActualizar"

    );

    if(btnActualizar){

        btnActualizar.addEventListener(

            "click",

            ()=>{

                location.reload();

            }

        );

    }

}

//====================================================
// HORA
//====================================================

function actualizarHora(){

    const lbl = document.getElementById(

        "lblHoraActualizacion"

    );

    if(!lbl){

        return;

    }

    const ahora = new Date();

    lbl.textContent =

        ahora.toLocaleTimeString(

            "es-CO"

        );

}

//====================================================
// KPIs
//====================================================

export function actualizarKPIs(datos){

    document.getElementById(

        "kpiOperadores"

    ).textContent = datos.operadores;

    document.getElementById(

        "kpiEntradas"

    ).textContent = datos.entradas;

    document.getElementById(

        "kpiSalidas"

    ).textContent = datos.salidas;

    document.getElementById(

        "kpiPendientes"

    ).textContent = datos.pendientes;

    document.getElementById(

        "kpiPuntosVenta"

    ).textContent = datos.puntosVenta;

}
//====================================================
// RESUMEN
//====================================================

export function actualizarResumen(datos){

    const resumen = document.getElementById(

        "lblResumen"

    );

    if(!resumen){

        return;

    }

    resumen.innerHTML =

    `
    <strong>${datos.operadores}</strong> operadores registrados.<br>

    <strong>${datos.entradas}</strong> entradas registradas.<br>

    <strong>${datos.salidas}</strong> salidas registradas.<br>

    <strong>${datos.pendientes}</strong> operadores presentes.
    `;

}

//====================================================
// MODO OSCURO
//====================================================

export function iniciarTema(){

    const boton = document.getElementById(

        "btnTema"

    );

    const icono = document.getElementById(

        "iconoTema"

    );

    if(!boton){

        return;

    }

    //------------------------------------------------
    // CARGAR TEMA GUARDADO
    //------------------------------------------------

    const tema = localStorage.getItem(

        "temaSICA"

    );

    if(tema==="dark"){

        document.body.classList.add(

            "dark"

        );

        cambiarTemaMapa("dark");

        if(icono){

            icono.className =

                "fa-solid fa-sun";

        }

    }

    else{

        cambiarTemaMapa("light");

        if(icono){

            icono.className =

                "fa-solid fa-moon";

        }

    }

    //------------------------------------------------
    // CAMBIAR TEMA
    //------------------------------------------------

    boton.addEventListener(

        "click",

        ()=>{

            document.body.classList.toggle(

                "dark"

            );

            const oscuro =

                document.body.classList.contains(

                    "dark"

                );

            localStorage.setItem(

                "temaSICA",

                oscuro

                    ? "dark"

                    : "light"

            );

            cambiarTemaMapa(

                oscuro

                    ? "dark"

                    : "light"

            );

            if(icono){

                icono.className =

                    oscuro

                        ? "fa-solid fa-sun"

                        : "fa-solid fa-moon";

            }

        }

    );

}