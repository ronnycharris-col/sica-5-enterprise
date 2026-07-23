//====================================================
// UTILIDADES GENERALES
//====================================================

// Mostrar mensaje
export function mensaje(texto) {

    alert(texto);

}

// Limpiar espacios
export function limpiarTexto(texto) {

    return texto.trim();

}

// Convertir a mayúsculas
export function mayusculas(texto) {

    return texto.trim().toUpperCase();

}

// Obtener fecha actual
export function fechaActual() {

    return new Date().toLocaleDateString("es-CO");

}

// Obtener hora actual
export function horaActual() {

    return new Date().toLocaleTimeString("es-CO");

}