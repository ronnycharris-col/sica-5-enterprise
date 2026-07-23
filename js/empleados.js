//====================================================
// IMPORTAR FIREBASE
//====================================================
import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    deleteDoc,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
//====================================================
// VARIABLES
//====================================================

let empleadoEditando = null;

console.log("empleados.js cargado correctamente");
//========================================
// INICIO
//========================================

window.onload = function () {

    cargarPuntosVenta();

    cargarEmpleados();

    document
        .getElementById("btnGuardar")
        .addEventListener("click", guardarEmpleado);

    document
        .getElementById("buscarEmpleado")
        .addEventListener("keyup", buscarEmpleado);

};


//========================================
// CARGAR PUNTOS DE VENTA
//========================================

async function cargarPuntosVenta() {

    const lista = document.getElementById("puntoventa");

    lista.innerHTML =
        '<option value="">Seleccione un punto de venta</option>';

    try {

        const consulta = await getDocs(collection(db, "puntosVenta"));

        consulta.forEach((doc) => {

            const punto = doc.data();

            lista.innerHTML += `
                <option value="${punto.nombre}">
                    ${punto.nombre} - ${punto.ciudad}
                </option>
            `;

        });

    } catch (error) {

        console.error(error);

        alert("Error cargando los puntos de venta.");

    }

}

//========================================
// GUARDAR EMPLEADO
//========================================

async function guardarEmpleado() {

    const documento = document.getElementById("documento").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const puntoventa = document.getElementById("puntoventa").value;

    if (documento === "" || nombre === "" || puntoventa === "") {

        alert("Complete todos los campos.");
        return;

    }

    try {

        // Verificar si el documento ya existe en Firebase

        const consulta = await getDocs(collection(db, "empleados"));

let existe = false;

consulta.forEach((registro) => {

    const empleado = registro.data();

    if (
        empleado.documento === documento &&
        registro.id !== empleadoEditando
    ) {

        existe = true;

    }

});

if (existe) {

    alert("Ya existe un empleado con ese documento.");

    return;

}

        // Crear objeto

        const empleado = {

            documento,
            nombre,
            puntoventa

        };

        // Guardar en Firebase

        // Si estamos editando, actualizar
if (empleadoEditando) {

    await updateDoc(
        doc(db, "empleados", empleadoEditando),
        empleado
    );

    alert("Empleado actualizado correctamente.");

    
} else {

    await addDoc(
        collection(db, "empleados"),
        empleado
    );

    alert("Empleado registrado correctamente.");

}

   

      cargarEmpleados();

document.getElementById("documento").value = "";
document.getElementById("nombre").value = "";
document.getElementById("puntoventa").selectedIndex = 0;

document.getElementById("documento").disabled = false;

empleadoEditando = null;

document.getElementById("btnGuardar").innerHTML =
"Guardar Empleado";

document.getElementById("documento").focus();

    } catch (error) {

        console.error(error);

        alert("Error al guardar el empleado.");

    }

}
//====================================================
// CARGAR EMPLEADOS
//====================================================

async function cargarEmpleados() {

    const tabla = document.getElementById("tablaEmpleados");

    tabla.innerHTML = "";

    try {

        const consulta = await getDocs(collection(db, "empleados"));

        consulta.forEach((doc) => {

            const empleado = doc.data();

            tabla.innerHTML += `
                <tr>

                    <td>${empleado.documento}</td>

                    <td>${empleado.nombre}</td>

                    <td>${empleado.puntoventa}</td>

                    <td>

                        <button onclick="window.editarEmpleado('${doc.id}')">
    ✏️
</button>

                        <button onclick="window.eliminarEmpleado('${doc.id}')">
                            🗑️
                        </button>

                    </td>

                </tr>
            `;

        });

    } catch (error) {

        console.error(error);

        alert("Error al cargar los empleados.");

    }

}
//====================================================
// EDITAR EMPLEADO
//====================================================

window.editarEmpleado = async function(id) {

    try {

        const referencia = doc(db, "empleados", id);

        const documento = await getDoc(referencia);
console.log("ID recibido:", id);
console.log("Documento existe:", documento.exists());
        if (!documento.exists()) {

            alert("Empleado no encontrado.");

            return;

        }

        const empleado = documento.data();
        console.log("Datos del empleado:", empleado);

alert(
    "Documento: " + empleado.documento +
    "\nNombre: " + empleado.nombre +
    "\nPunto: " + empleado.puntoventa
);
console.log(empleado);
        document.getElementById("documento").value = empleado.documento;
        document.getElementById("nombre").value = empleado.nombre;
        document.getElementById("puntoventa").value = empleado.puntoventa;

        empleadoEditando = id;

        document.getElementById("documento").disabled = true;

        document.getElementById("btnGuardar").innerHTML =
            "Actualizar Empleado";
document.getElementById("documento").scrollIntoView({
    behavior: "smooth"
});

document.getElementById("documento").focus();
        alert("Entró a editar");

console.log("Editando:", empleadoEditando);

    } catch (error) {

        console.error(error);

        alert("Error cargando el empleado.");

    }

}
//====================================================
// ELIMINAR EMPLEADO
//====================================================

window.eliminarEmpleado = async function(id) {

    const confirmar = confirm(
        "¿Está seguro de eliminar este empleado?"
    );

    if (!confirmar) {
        return;
    }

    try {

        await deleteDoc(
            doc(db, "empleados", id)
        );

        alert("Empleado eliminado correctamente.");

        cargarEmpleados();

    } catch (error) {

        console.error(error);

        alert("Error eliminando el empleado.");

    }

}
//====================================================
// BUSCAR EMPLEADOS
//====================================================

async function buscarEmpleado() {

    const texto = document
        .getElementById("buscarEmpleado")
        .value
        .toLowerCase();

    const tabla = document.getElementById("tablaEmpleados");

    tabla.innerHTML = "";

    try {

        const consulta = await getDocs(collection(db, "empleados"));

        consulta.forEach((doc) => {

            const empleado = doc.data();

            if (

                empleado.documento.toLowerCase().includes(texto) ||

                empleado.nombre.toLowerCase().includes(texto) ||

                empleado.puntoventa.toLowerCase().includes(texto)

            ) {

                tabla.innerHTML += `

                <tr>

                    <td>${empleado.documento}</td>

                    <td>${empleado.nombre}</td>

                    <td>${empleado.puntoventa}</td>

                    <td>

                        <button onclick="window.editarEmpleado('${doc.id}')">

                            ✏️

                        </button>

                        <button onclick="window.eliminarEmpleado('${doc.id}')">

                            🗑️

                        </button>

                    </td>

                </tr>

                `;

            }

        });

    }

    catch(error){

        console.error(error);

    }

}