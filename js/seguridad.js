//====================================================
// SICA
// SEGURIDAD
//====================================================

// Usuario logueado
const usuarioActivo = JSON.parse(
    sessionStorage.getItem("usuarioActivo")
);

// Página actual
const pagina = window.location.pathname.split("/").pop();
console.log("Página:", pagina);
console.log("Usuario activo:", usuarioActivo);
//====================================================
// SI NO HAY SESIÓN
//====================================================

if (!usuarioActivo && pagina !== "index.html") {

    alert("Debe iniciar sesión.");

    window.location.href = "index.html";

}

//====================================================
// SI YA INICIÓ SESIÓN Y ABRE INDEX
//====================================================

if (usuarioActivo && pagina === "index.html") {

    if (

        usuarioActivo.rol === "administrador" ||

        usuarioActivo.rol === "coordinador"

    ) {

        window.location.href = "menu.html";

    } else {

        window.location.href = "operador.html";

    }

}
//====================================================
// PÁGINAS POR ROL
//====================================================

const paginasAdministrador = [

    "menu.html",

    "dashboard.html",

    "presentes.html",

    "registro.html",

    "empleados.html",

    "puntoventa.html",

    "consultar.html",

    "backup.html"

];

const paginasCoordinador = [

    "menu.html",

    "dashboard.html",

    "presentes.html",

    "registro.html",

    "empleados.html",

    "puntoventa.html",

    "operador.html",

    "consultar.html"

];

if (

    usuarioActivo &&

    usuarioActivo.rol === "operador" &&

    paginasAdministrador.includes(pagina)

) {

    alert("No tiene permisos para ingresar a esta página.");

    window.location.href = "operador.html";

}
//====================================================
// PERMISOS COORDINADOR CIUDADES
//====================================================

if (

    usuarioActivo &&

    usuarioActivo.rol === "coordinador" &&

    !paginasCoordinador.includes(pagina)

) {

    alert("No tiene permisos para ingresar a esta página.");

    window.location.href = "menu.html";

}
//====================================================
// CERRAR SESIÓN
//====================================================

const btnCerrarSesion =
    document.getElementById("btnCerrarSesion");

if (btnCerrarSesion) {

    btnCerrarSesion.addEventListener("click", () => {

        if (!confirm("¿Desea cerrar la sesión?")) {

            return;

        }

        sessionStorage.removeItem("usuarioActivo");

        window.location.replace("index.html");

    });

}
//====================================================
// EVITAR VOLVER CON ATRÁS
//====================================================

window.history.pushState(null, "", window.location.href);

window.onpopstate = function () {

    window.history.pushState(null, "", window.location.href);

};