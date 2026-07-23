//====================================================
// SICA 5.0 ENTERPRISE
// PANEL PUNTO DE VENTA
// PARTE 2
//====================================================

//====================================================
// VARIABLES
//====================================================

let puntoSeleccionado = null;

const panel = document.getElementById("panelPV");

//====================================================
// ABRIR PANEL
//====================================================

export function abrirPanelPV(punto){

    puntoSeleccionado = punto;

    //------------------------------------------------
    // NOMBRE
    //------------------------------------------------

    document.getElementById("pvNombre").textContent=

        punto.nombre;

    //------------------------------------------------
    // ESTADO
    //------------------------------------------------

    const estado=document.getElementById("pvEstado");

    if(punto.pendientes>0){

        estado.innerHTML="🟢 Operando";

    }else{

        estado.innerHTML="🔴 Sin iniciar";

    }

    //------------------------------------------------
    // ESTADÍSTICAS
    //------------------------------------------------

    document.getElementById("pvEntradas").textContent=

        punto.entradas;

    document.getElementById("pvSalidas").textContent=

        punto.salidas;

    document.getElementById("pvPendientes").textContent=

        punto.pendientes;

    //------------------------------------------------
    // OPERADORES
    //------------------------------------------------

    const lista=document.getElementById("pvOperadores");

    lista.innerHTML="";

    punto.operadores.forEach(operador=>{

        lista.innerHTML+=`

            <p>

                👤 ${operador.nombre}

            </p>

        `;

    });

    //------------------------------------------------
    // PANEL
    //------------------------------------------------

    panel.classList.add("activo");

}


//====================================================
// CERRAR PANEL
//====================================================

export function cerrarPanelPV(){

    puntoSeleccionado = null;

    if(panel){

        panel.classList.remove("activo");

    }

}

//====================================================
// OBTENER PUNTO ACTUAL
//====================================================

export function obtenerPuntoSeleccionado(){

    return puntoSeleccionado;

}

//====================================================
// BOTÓN CERRAR
//====================================================

document.addEventListener("DOMContentLoaded",()=>{

    const botonCerrar=document.getElementById("btnCerrarPV");

    if(botonCerrar){

        botonCerrar.addEventListener("click",cerrarPanelPV);

    }

});