//====================================================
// RCH Systems
// MODAL FOTO
//====================================================

export function verFoto(rutaFoto) {

    document.getElementById("modalFoto").style.display = "block";

    document.getElementById("imagenGrande").src = rutaFoto;

}

export function cerrarModal() {

    document.getElementById("modalFoto").style.display = "none";

}