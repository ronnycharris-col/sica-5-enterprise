//====================================================
// RCH Systems
// MAPA CONSULTAR
//====================================================

export function verMapa(registro) {

    sessionStorage.setItem(

        "ubicacionMapa",

        JSON.stringify(registro)

    );

    window.location.href = "mapa.html";

}