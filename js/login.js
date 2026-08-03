//====================================================
// SICA
// LOGIN FIREBASE
//====================================================

import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";


//====================================================
// CONTROLES
//====================================================

const txtUsuario = document.getElementById("usuario");
const txtClave = document.getElementById("clave");
const btnIngresar = document.getElementById("btnIngresar");


//====================================================
// LOGIN
//====================================================

async function iniciarSesion() {

    const usuario = txtUsuario.value.trim();
    const clave = txtClave.value.trim();


    if (usuario === "" || clave === "") {

        alert("Ingrese el usuario y la contraseña.");
        return;

    }


    try {


        const consulta = query(
            collection(db, "usuarios"),
            where("usuario", "==", usuario)
        );


        const resultado = await getDocs(consulta);


        if (resultado.empty) {

            alert("Usuario no existe.");
            return;

        }


        let datos = null;


        resultado.forEach((doc) => {

    datos = doc.data();
    
});

datos.empresaId = "empresa001";
const permisosLimpios = {};

Object.keys(datos.permisos || {}).forEach(k => {
    permisosLimpios[k.trim()] = datos.permisos[k];
});

datos.permisos = permisosLimpios;

if (Object.keys(datos.permisos).length === 0) {

    datos.permisos = {

        entradasSalidas: true,
        usuarios: false,
        empleados: false,
        puntosVenta: false,
        dashboard: false,
        horas: false,
        reportes: false,
        backup: false,
        configuracion: false

    };

}
        if (datos.clave !== clave) {

            alert("Contraseña incorrecta.");
            return;

        }



        if (datos.estado && datos.estado === "Inactivo") {

            alert("El usuario está inactivo.");
            return;

        }



        //====================================================
        // VERIFICAR PRIMER INGRESO
        //====================================================

        if (datos.primerIngreso === true) {


            if(!datos.empresaId){

                datos.empresaId = "empresa001";

            }

            datos.permisos = datos.permisos || {};

            
            sessionStorage.setItem(
                "usuarioActivo",
                JSON.stringify(datos)
            );


            window.location.href = "cambiar-clave.html";


            return;

        }



        //====================================================
        // GUARDAR SESIÓN
        //====================================================
      datos.permisos = datos.permisos || {
    usuarios:false,
    empleados:false,
    puntosVenta:false,
    dashboard:false,
    reportes:false,
    horas:false,
    entradasSalidas:true
};
        sessionStorage.setItem(
            "usuarioActivo",
            JSON.stringify(datos)
        );


        



        //--------------------------------------------------
        // REDIRECCIÓN SEGÚN ROL
        //--------------------------------------------------


        if (
    datos.rol === "superadmin" &&
    datos.accesoGlobal === true
) {

    window.location.href = "global.html";

} else if (

    datos.rol === "administrador" ||
    datos.rol === "coordinador"

) {

    

    window.location.href = "menu.html";

} else {

    window.location.href = "operador.html";

}
    } catch (error) {


        console.error(error);

        alert("Error al iniciar sesión.");


    }


}



//====================================================
// EVENTOS
//====================================================


btnIngresar.addEventListener(
    "click",
    iniciarSesion
);



txtClave.addEventListener(
    "keydown",
    function(e){

        if(e.key === "Enter"){

            iniciarSesion();

        }

    }
);