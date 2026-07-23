//====================================================
// SICA 5.0
// CENTRO DE OPERACIONES
// dashboard.js
//====================================================

//====================================================
// IMPORTACIONES
//====================================================

import {

    iniciarFirebaseDashboard

} from "./dashboard-firebase.js";

import {

    iniciarDashboardUI,

    iniciarTema

} from "./dashboard-ui.js";
import {

    iniciarMapa

} from "./mapa.js";
import {

    iniciarGraficas

} from "./dashboard-graficas.js";
import {

    iniciarTendencias

} from "./dashboard-tendencias.js";
import {

    abrirPanelPV

} from "./dashboard-puntoventa.js";
//====================================================
// INICIO
//====================================================

window.addEventListener(

    "DOMContentLoaded",

    iniciarDashboard

);

//====================================================
// DASHBOARD
//====================================================

function iniciarDashboard(){

    console.clear();

    console.log(

        "%cSICA 5.0",

        "color:#1565C0;font-size:22px;font-weight:bold;"

    );

    console.log(

        "Inicializando Centro de Operaciones..."

    );

    //------------------------------------------------
// INTERFAZ
//------------------------------------------------

iniciarDashboardUI();
iniciarTema();
//------------------------------------------------
// MAPA
//------------------------------------------------

iniciarMapa();

//------------------------------------------------
// GRÁFICAS
//------------------------------------------------

iniciarGraficas();
iniciarTendencias();
//------------------------------------------------
// FIREBASE
//------------------------------------------------

iniciarFirebaseDashboard();

}
