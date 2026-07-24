//====================================================
// SICA Enterprise
// FIREBASE HORAS
// firebase-horas.js
//====================================================

import { db } from "./firebase.js";

import {

    collection,

    getDocs,

    query,

    where,

    orderBy,

    Timestamp

} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

//====================================================
// VARIABLES
//====================================================

export let empleados = [];

export let puntosVenta = [];


//====================================================
// CARGAR EMPLEADOS
//====================================================

export async function cargarEmpleados() {

    try {

        const consulta = await getDocs(

            collection(db, "empleados")

        );

        empleados.length = 0;

        consulta.forEach((doc) => {

            empleados.push({

                id: doc.id,

                ...doc.data()

            });

        });

        empleados.sort((a, b) =>

            (a.nombre || "").localeCompare(

                b.nombre || ""

            )

        );

        console.log(

            "Empleados cargados:",

            empleados.length

        );

    }

    catch (error) {

        console.error(

            "Error cargando empleados:",

            error

        );

    }

}

//====================================================
// CARGAR PUNTOS DE VENTA
//====================================================

export async function cargarPuntosVenta() {

    try {

        const consulta = query(

            collection(db, "puntosVenta"),

            orderBy("nombre")

        );

        const snapshot = await getDocs(

            consulta

        );

        puntosVenta.length = 0;

        snapshot.forEach((doc) => {

            puntosVenta.push({

                id: doc.id,

                ...doc.data()

            });

        });

        console.log(

            "Puntos de Venta cargados:",

            puntosVenta.length

        );

    }

    catch (error) {

        console.error(

            "Error cargando puntos de venta:",

            error

        );

    }

}

//====================================================
// BUSCAR REGISTROS
//====================================================

export async function buscarRegistros(fechaInicio, fechaFin) {

    try {

        const fechaInicial = new Date(fechaInicio + "T00:00:00");

        const fechaFinal = new Date(fechaFin + "T23:59:59");

        const consulta = query(

            collection(db, "registros"),

            where(

                "fechaServidor",

                ">=",

                Timestamp.fromDate(fechaInicial)

            ),

            where(

                "fechaServidor",

                "<=",

                Timestamp.fromDate(fechaFinal)

            ),

            orderBy("fechaServidor", "asc")

        );

        const snapshot = await getDocs(consulta);

        const registros = [];

        snapshot.forEach((doc) => {

            registros.push({

                id: doc.id,

                ...doc.data()

            });

        });

        console.log(

            "Registros encontrados:",

            registros.length

        );

        return registros;

    }

    catch (error) {

        console.error(

            "Error buscando registros:",

            error

        );

        return [];

    }

}

//====================================================
// FIN DEL MÓDULO
//====================================================

console.log(

    "%cFirebase Horas cargado correctamente",

    "color:#16A34A;font-weight:bold;font-size:14px;"

);
