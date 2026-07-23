console.log("REGISTRO.JS CORRECTO CARGADO");
//====================================================
// SICA
// ADMINISTRACIÓN DE USUARIOS
// registro.js
//====================================================

import { db } from "./firebase.js";
import { iniciarBuscadorEmpleados } from "./componentes/buscador-empleados.js";

import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    getDoc,
    setDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

console.log("REGISTRO.JS CORRECTO CARGADO");
//====================================================
// CONTROLES
//====================================================

const cmbEmpleado = document.getElementById("empleado");
const txtBuscarEmpleado = document.getElementById("buscarEmpleado");
const txtUsuario = document.getElementById("usuario");
const txtClave = document.getElementById("clave");
const cmbRol = document.getElementById("tipo");
const txtBuscar = document.getElementById("buscarUsuario");
const tablaUsuarios = document.getElementById("tablaUsuarios");
const btnGuardar = document.getElementById("btnGuardar");


//====================================================
// VARIABLES
//====================================================

let empleados = [];
let usuarios = [];
//====================================================
// USUARIO ACTIVO
//====================================================

let usuarioActivo = null;

//====================================================
// CARGAR EMPLEADOS
//====================================================

async function cargarEmpleados() {

    cmbEmpleado.innerHTML = `
        <option value="">Seleccione un empleado</option>
    `;

    empleados = [];

    try {

        const consulta = query(
            collection(db, "empleados"),
            orderBy("nombre")
        );

        const snapshot = await getDocs(consulta);

        snapshot.forEach((documento) => {

            const empleado = documento.data();

            empleados.push(empleado);

            const option = document.createElement("option");

            option.value = empleado.documento;
            option.textContent =
                empleado.documento + " - " + empleado.nombre;

            cmbEmpleado.appendChild(option);

        });

    } catch (error) {

        console.error(error);

        alert("No fue posible cargar los empleados.");

    }

}
//====================================================
// FILTRAR EMPLEADOS
//====================================================

function filtrarEmpleados() {

    const texto = txtBuscarEmpleado.value
        .toLowerCase()
        .trim();

    cmbEmpleado.innerHTML = `
        <option value="">
            Seleccione un empleado
        </option>
    `;

    empleados
        .filter((empleado) => {

            return (

                empleado.nombre
                    .toLowerCase()
                    .includes(texto)

                ||

                empleado.documento
                    .toString()
                    .includes(texto)

            );

        })

        .forEach((empleado) => {

            const option = document.createElement("option");

            option.value = empleado.documento;

            option.textContent =
                empleado.documento +
                " - " +
                empleado.nombre;

            cmbEmpleado.appendChild(option);

        });

}
//----------------------------------------------------
// SI SOLO QUEDA UN EMPLEADO
//----------------------------------------------------

if (cmbEmpleado.options.length === 2) {

    cmbEmpleado.selectedIndex = 1;

    txtUsuario.value = cmbEmpleado.value;

}

//====================================================
// EMPLEADO SELECCIONADO
//====================================================

cmbEmpleado.addEventListener("change", () => {

    txtUsuario.value = cmbEmpleado.value;

});


//====================================================
// CARGAR USUARIOS
//====================================================

async function cargarUsuarios() {

    usuarios = [];

    tablaUsuarios.innerHTML = "";

    try {

        const consulta = query(
            collection(db, "usuarios"),
            orderBy("nombre")
        );

        const snapshot = await getDocs(consulta);

        snapshot.forEach((documento) => {

            usuarios.push(documento.data());

        });

        mostrarUsuarios(usuarios);

    } catch (error) {

        console.error(error);

        alert("No fue posible cargar los usuarios.");

    }

}
//====================================================
// CARGAR USUARIO ACTIVO
//====================================================

async function cargarUsuarioActivo() {

    const sesion = JSON.parse(

        sessionStorage.getItem("usuarioActivo")

    );

    if (!sesion) {

        location.href = "index.html";

        return;

    }

    usuarioActivo = sesion;

    //------------------------------------------------
    // SI ES COORDINADOR
    //------------------------------------------------

    if (usuarioActivo.rol === "coordinador") {

        cmbRol.innerHTML = `

            <option value="operador">

                Operador

            </option>

        `;

    }

}

//====================================================
// INICIAR PÁGINA
//====================================================

window.addEventListener("load", async () => {

    await cargarUsuarioActivo();

    await cargarEmpleados();

    await cargarUsuarios();

   iniciarBuscadorEmpleados({

    empleados,

    input: "buscarEmpleado",

    lista: "listaEmpleados",

    onSelect: (empleado) => {

    document.getElementById("empleado").value =
        empleado.documento;

    document.getElementById("usuario").value =
        empleado.documento;

}

});

});
//====================================================
// GUARDAR USUARIO
//====================================================

async function guardarUsuario() {

    const documento = txtUsuario.value.trim();
    const clave = txtClave.value.trim();
    const rol = cmbRol.value;

    if (cmbEmpleado.value === "") {

        alert("Seleccione un empleado.");
        return;

    }

    if (clave === "") {

        alert("Ingrese una contraseña.");
        txtClave.focus();
        return;

    }

    const empleado = empleados.find(
        e => e.documento === documento
    );

    if (!empleado) {

        alert("No se encontró el empleado seleccionado.");
        return;

    }

    try {

        //------------------------------------------------
        // VALIDAR SI EL USUARIO YA EXISTE
        //------------------------------------------------

        const referencia = doc(db, "usuarios", documento);

        const existe = await getDoc(referencia);

        if (existe.exists()) {

            alert("Ya existe un usuario con esa cédula.");
            return;

        }

        //------------------------------------------------
        // GUARDAR EN FIRESTORE
        //------------------------------------------------

        await setDoc(referencia, {

    usuario: documento,
    nombre: empleado.nombre,
    clave: clave,
    rol: rol,
    estado: "Activo",

    //=========================================
    // SEGURIDAD SICA 4.0
    //=========================================
    primerIngreso: true,

    fechaCreacion: new Date(),

    fechaCambioClave: null

});

        alert("Usuario registrado correctamente.");

        limpiarFormulario();

        await cargarUsuarios();

    } catch (error) {

        console.error(error);

        alert("Error al registrar el usuario.");

    }

}


//====================================================
// LIMPIAR FORMULARIO
//====================================================

function limpiarFormulario() {

    cmbEmpleado.selectedIndex = 0;

    txtUsuario.value = "";

    txtClave.value = "";

    cmbRol.value = "operador";

}


//====================================================
// BOTÓN GUARDAR
//====================================================

btnGuardar.addEventListener("click", guardarUsuario);
//====================================================
// MOSTRAR USUARIOS EN LA TABLA
//====================================================

function mostrarUsuarios(lista) {

    tablaUsuarios.innerHTML = "";

    lista.forEach((usuario) => {

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${usuario.usuario}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.rol}</td>
            <td>${usuario.estado || "Activo"}</td>
            <td>
                <button onclick="editarRol('${usuario.usuario}')">
                    Editar
                </button>

                <button onclick="cambiarClave('${usuario.usuario}')">
                    Clave
                </button>

                <button onclick="cambiarEstado('${usuario.usuario}')">
                    ${usuario.estado === "Inactivo" ? "Activar" : "Inactivar"}
                </button>
            </td>
        `;

        tablaUsuarios.appendChild(fila);

    });

}


//====================================================
// BUSCAR USUARIOS
//====================================================

txtBuscar.addEventListener("keyup", () => {

    const texto = txtBuscar.value.toLowerCase().trim();

    const resultado = usuarios.filter((usuario) => {

        return (
            usuario.usuario.toLowerCase().includes(texto) ||
            usuario.nombre.toLowerCase().includes(texto)
        );

    });

    mostrarUsuarios(resultado);

});


//====================================================
// EDITAR ROL
//====================================================

window.editarRol = async function (documento) {

    const usuario = usuarios.find(u => u.usuario === documento);

    if (!usuario) return;

   //------------------------------------------------
// PERMISOS DEL COORDINADOR
//------------------------------------------------

let mensaje = "";

if (usuarioActivo.rol === "coordinador") {

    mensaje =
        "Nuevo rol (solo operador)";

} else {

    mensaje =
        "Nuevo rol (administrador, coordinador u operador)";

}

let nuevoRol = prompt(

    mensaje,

    usuario.rol

);

if (nuevoRol === null) return;

nuevoRol = nuevoRol.toLowerCase().trim();

    


    //------------------------------------------------
// VALIDAR ROL
//------------------------------------------------

if (usuarioActivo.rol === "coordinador") {

    if (nuevoRol !== "operador") {

        alert(
            "El Coordinador solo puede asignar el rol Operador."
        );

        return;

    }

} else {

    if (

        nuevoRol !== "administrador" &&

        nuevoRol !== "coordinador" &&

        nuevoRol !== "operador"

    ) {

        alert("Rol no válido.");

        return;

    }

}

    try {

        const referencia = doc(db, "usuarios", documento);

        await updateDoc(referencia, {

            rol: nuevoRol

        });

        alert("Rol actualizado correctamente.");

        await cargarUsuarios();

    } catch (error) {

        console.error(error);

        alert("No fue posible actualizar el rol.");

    }

};
//====================================================
// CAMBIAR CONTRASEÑA
//====================================================

window.cambiarClave = async function (documento) {

    const nuevaClave = prompt("Ingrese la nueva contraseña:");

    if (nuevaClave === null) return;

    if (nuevaClave.trim() === "") {

        alert("Debe ingresar una contraseña.");
        return;

    }

    try {

        const referencia = doc(db, "usuarios", documento);

        await updateDoc(referencia, {
            clave: nuevaClave.trim()
        });

        alert("Contraseña actualizada correctamente.");

        await cargarUsuarios();

    } catch (error) {

        console.error(error);

        alert("Error al actualizar la contraseña.");

    }

};


//====================================================
// CAMBIAR ESTADO
//====================================================

window.cambiarEstado = async function (documento) {

    const usuario = usuarios.find(u => u.usuario === documento);

    if (!usuario) return;

    const nuevoEstado =
        usuario.estado === "Inactivo"
            ? "Activo"
            : "Inactivo";

    try {

        const referencia = doc(db, "usuarios", documento);

        await updateDoc(referencia, {
            estado: nuevoEstado
        });

        alert("Estado actualizado correctamente.");

        await cargarUsuarios();

    } catch (error) {

        console.error(error);

        alert("Error al actualizar el estado.");

    }

};


//====================================================
// ACTUALIZAR TABLA
//====================================================

async function actualizarTabla() {

    await cargarUsuarios();

}
//====================================================
// BUSCADOR DE EMPLEADOS
//====================================================

txtBuscarEmpleado.addEventListener(

    "keyup",

    filtrarEmpleados

);

