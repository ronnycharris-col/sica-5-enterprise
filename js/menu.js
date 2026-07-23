//====================================================
// SICA 5.0 ENTERPRISE
// MENU
// PARTE 1 DE 3
//====================================================

//====================================================
// IMPORTACIONES
//====================================================

import { db } from "./firebase.js";

import {

    doc,
    getDoc

} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

//====================================================
// SESIÓN
//====================================================

const usuarioActivo = JSON.parse(

    sessionStorage.getItem("usuarioActivo")

);

if(!usuarioActivo){

    alert("Debe iniciar sesión.");

    window.location.href = "index.html";

    throw new Error("Sesión no encontrada.");

}

//====================================================
// CONTROLES
//====================================================

const nombreUsuario =

document.getElementById("nombreUsuario");

const btnDashboard =
document.getElementById("btnDashboard");

const btnPresentes =
document.getElementById("btnPresentes");

const btnUsuarios =
document.getElementById("btnUsuarios");

const btnEmpleados =
document.getElementById("btnEmpleados");

const btnPuntos =
document.getElementById("btnPuntos");

const btnOperador =
document.getElementById("btnOperador");

const btnConsultar =
document.getElementById("btnConsultar");

const btnBackup =
document.getElementById("btnBackup");
const btnHoras =
document.getElementById("btnHoras");

const btnMantenimiento =
document.getElementById("btnMantenimiento");

const btnCerrarSesion =
document.getElementById("btnCerrarSesion");

//====================================================
// MOSTRAR USUARIO
//====================================================

if(nombreUsuario){

    nombreUsuario.innerHTML = `

        <strong>${usuarioActivo.nombre}</strong><br>

        ${usuarioActivo.rol.charAt(0).toUpperCase() +
        usuarioActivo.rol.slice(1)}

    `;

}

//====================================================
// OCULTAR MANTENIMIENTO
//====================================================

if(btnMantenimiento){

    btnMantenimiento.style.display = "none";

}
//====================================================
// CARGAR PERMISOS DEL USUARIO
//====================================================

cargarPermisos();

async function cargarPermisos(){

    try{

        const referencia = doc(

            db,
            "usuarios",
            usuarioActivo.usuario

        );

        const documento = await getDoc(

            referencia

        );

        if(!documento.exists()){

            console.warn(

                "Usuario no encontrado."

            );

            return;

        }

        const datos = documento.data();

        console.log(

            "Permisos cargados:",

            datos

        );

        //------------------------------------------------
        // BOTÓN MANTENIMIENTO
        //------------------------------------------------

        if(

            datos.permisoMantenimiento === true

        ){

            if(btnMantenimiento){

                btnMantenimiento.style.display =

                    "block";

            }

        }

    }

    catch(error){

        console.error(

            "Error cargando permisos:",

            error

        );

    }

}

//====================================================
// PERMISOS POR ROL
//====================================================

//----------------------------------------------------
// OPERADOR
//----------------------------------------------------

if(usuarioActivo.rol === "operador"){

    if(btnDashboard) btnDashboard.style.display = "none";

    if(btnPresentes) btnPresentes.style.display = "none";

    if(btnUsuarios) btnUsuarios.style.display = "none";

    if(btnEmpleados) btnEmpleados.style.display = "none";

    if(btnPuntos) btnPuntos.style.display = "none";

    if(btnConsultar) btnConsultar.style.display = "none";

    if(btnBackup) btnBackup.style.display = "none";

    if(btnHoras) btnHoras.style.display = "none";
    
    if(btnMantenimiento){

        btnMantenimiento.style.display = "none";

    }

}

//----------------------------------------------------
// COORDINADOR
//----------------------------------------------------

if(usuarioActivo.rol === "coordinador"){

    if(btnBackup){

        btnBackup.style.display = "none";

    }

    const tituloUsuarios =

        document.querySelector(

            "#btnUsuarios h3"

        );

    if(tituloUsuarios){

        tituloUsuarios.textContent =

            "Operadores";

    }

}
//====================================================
// ADMINISTRADOR
//====================================================

if(usuarioActivo.rol === "administrador"){

    console.log(

        "Administrador autenticado."

    );

}

//====================================================
// CERRAR SESIÓN
//====================================================

if(btnCerrarSesion){

    btnCerrarSesion.addEventListener(

        "click",

        ()=>{

            sessionStorage.removeItem(

                "usuarioActivo"

            );

            window.location.href =

                "index.html";

        }

    );

}

//====================================================
// INICIALIZACIÓN
//====================================================

console.log(

    "%cSICA 5.0 Enterprise",

    "color:#1565C0;font-size:18px;font-weight:bold;"

);

console.log(

    "Menú cargado correctamente."

);

console.log(

    "Usuario activo:",

    usuarioActivo

);