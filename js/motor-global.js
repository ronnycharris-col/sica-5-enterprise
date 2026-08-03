//====================================================
// SICA Enterprise 5.0
// MOTOR GLOBAL
// Control de módulos y permisos
//====================================================

import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";


//====================================================
// USUARIO ACTUAL
//====================================================

export function obtenerUsuarioActivo(){

    return JSON.parse(
        sessionStorage.getItem("usuarioActivo")
    );

}
//====================================================
// OBTENER EMPRESA ACTIVA
//====================================================

export async function obtenerEmpresaActiva(){

    const usuario = obtenerUsuarioActivo();


    if(!usuario){

        console.error(
            "No existe usuario activo"
        );

        return null;

    }


    const empresaId = usuario.empresaId;


    if(!empresaId){

        console.error(
            "Usuario sin empresa asignada"
        );

        return null;

    }


    const referencia = doc(
        db,
        "empresas",
        empresaId
    );


    const documento = await getDoc(
        referencia
    );


    if(!documento.exists()){

        console.error(
            "Empresa no encontrada:",
            empresaId
        );

        return null;

    }


    return {

        id: empresaId,
        ...documento.data()

    };

}

//====================================================
// OBTENER CONFIGURACIÓN DE MÓDULOS
//====================================================

export async function obtenerModulosEmpresa(){

    try{

        const empresa = await obtenerEmpresaActiva();


        if(!empresa){

            console.error(
                "No existe empresa activa"
            );

            return {};

        }


        console.log(
            "EMPRESA ACTIVA:",
            empresa
        );


        return {

            dashboard:true,
            empleados:true,
            puntosVenta:true,
            horas:true,
            reportes:true,
            liquidacion:false,
            nomina:false,

            ...(empresa.modulos || {})

        };


    }
    catch(error){

        console.error(
            "Error obteniendo módulos:",
            error
        );


        return {};

    }

}
//====================================================
// VALIDAR MÓDULO
//====================================================

export async function tieneModulo(modulo){

    const modulos =
        await obtenerModulosEmpresa();


    return modulos[modulo] === true;

}


//====================================================
// VALIDAR PERMISO USUARIO
//====================================================

export function tienePermiso(modulo){

    const usuario =
        obtenerUsuarioActivo();


    if(!usuario){
        return false;
    }


    if(usuario.rol === "administrador"){

        return true;

    }


    return usuario.permisos?.[modulo] === true;

}
//====================================================
// PRUEBA LECTURA CONFIGURACION GLOBAL
//====================================================

obtenerModulosEmpresa().then((modulos)=>{

    console.log(
        "MÓDULOS GLOBALES:",
        modulos
    );

});