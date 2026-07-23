//======================================
// CREAR RESPALDO DEL SISTEMA
//======================================

function crearRespaldo() {

    const respaldo = {

        fecha: new Date().toLocaleString(),

        usuarios: JSON.parse(localStorage.getItem("usuarios")) || [],

        empleados: JSON.parse(localStorage.getItem("empleados")) || [],

        puntosVenta: JSON.parse(localStorage.getItem("puntosVenta")) || [],

        registros: JSON.parse(localStorage.getItem("registros")) || []

    };

    const datos = JSON.stringify(respaldo, null, 4);

    const archivo = new Blob([datos], {
        type: "application/json"
    });

    const enlace = document.createElement("a");

    enlace.href = URL.createObjectURL(archivo);

    const hoy = new Date();

    const nombre =
        "Respaldo_ControlAcceso_" +
        hoy.getFullYear() + "-" +
        String(hoy.getMonth() + 1).padStart(2, "0") + "-" +
        String(hoy.getDate()).padStart(2, "0") + "_" +
        String(hoy.getHours()).padStart(2, "0") + "-" +
        String(hoy.getMinutes()).padStart(2, "0") + ".json";

    enlace.download = nombre;

    enlace.click();

    alert("Respaldo creado correctamente.");

}

//======================================
// RESTAURAR RESPALDO
//======================================

function restaurarRespaldo() {

    const archivo = document.getElementById("archivoRespaldo").files[0];

    if (!archivo) {

        alert("Seleccione un archivo de respaldo.");

        return;

    }

    const lector = new FileReader();

    lector.onload = function(e) {

        try {

            const respaldo = JSON.parse(e.target.result);

            localStorage.setItem(
                "usuarios",
                JSON.stringify(respaldo.usuarios || [])
            );

            localStorage.setItem(
                "empleados",
                JSON.stringify(respaldo.empleados || [])
            );

            localStorage.setItem(
                "puntosVenta",
                JSON.stringify(respaldo.puntosVenta || [])
            );

            localStorage.setItem(
                "registros",
                JSON.stringify(respaldo.registros || [])
            );

            alert("Respaldo restaurado correctamente.");

        } catch (error) {

            alert("El archivo seleccionado no es un respaldo válido.");

        }

    };

    lector.readAsText(archivo);

}