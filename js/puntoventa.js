import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

console.log("puntoventa.js cargado correctamente");

window.guardarPuntoVenta = guardarPuntoVenta;

function normalizarTexto(texto) {

    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toUpperCase();

}
//====================================
// GUARDAR PUNTO DE VENTA
//====================================

async function guardarPuntoVenta() {

    
    const nombre =
        document.getElementById("nombre").value.trim();

    const ciudad =
        document.getElementById("ciudad").value.trim();

    if (nombre === "" || ciudad === "") {

        alert("Complete todos los campos.");

        return;

    }

    try {

    // Buscar si ya existe

const nombreNormalizado = normalizarTexto(nombre);

const consulta = query(
    collection(db, "puntosVenta"),
    where("nombreBusqueda", "==", nombreNormalizado)
);

const puntos = await getDocs(consulta);

if (!puntos.empty) {

    alert("El punto de venta ya se encuentra registrado.");

    document.getElementById("nombre").focus();

    return;

}

    // Crear objeto

    const puntoVenta = {

    nombre: nombre.trim(),
    nombreBusqueda: nombreNormalizado,
    ciudad: ciudad.trim()

};

        // Guardar en Firebase

        await addDoc(

            collection(db, "puntosVenta"),

            puntoVenta

        );

        console.log("Punto de venta guardado en Firebase.");

        alert("Punto de venta registrado correctamente.");

        
        document.getElementById("nombre").value = "";
        document.getElementById("ciudad").value = "";

        document.getElementById("nombre").focus();

    } catch (error) {

        console.error(error);

        alert("Error al guardar el punto de venta.");

    }

}