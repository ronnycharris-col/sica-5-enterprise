//====================================================
// SICA 5.0 ENTERPRISE
// MÓDULO EMPLEADOS
//====================================================

//====================================================
// IMPORTACIONES
//====================================================

import { db } from "../firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    query,
    where,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

//====================================================
// VARIABLES
//====================================================

let idEmpleadoActual = null;


//====================================================
// MOSTRAR MÓDULO
//====================================================

export function mostrarModuloEmpleados(panel){

    panel.innerHTML = `

        <div class="panelCard">

            <h2>

               <i class="fa-solid fa-user-pen"></i>

                Gestión de Empleados

            </h2>

            <p>

                Buscar, registrar y actualizar empleados.

            </p>

            <hr>

            <div class="busqueda">

               <input 
id="txtBuscarEmpleado"
class="input"
type="text"
placeholder="Documento del empleado"
oninput="buscarEmpleado()"
>

                <button

                    id="btnBuscarEmpleado"

                    class="btn btnAzul"

                >

                    <i class="fa-solid fa-magnifying-glass"></i>

                    Buscar

                </button>

            </div>

            <hr>

            <div class="formulario">

              <label>
    Documento *
</label>

<input
    id="txtDocumento"
    class="input"
    type="text"
>
<label>
    Nombre Completo *
</label>

<input
    id="txtNombre"
    class="input"
    type="text"
>
                <label>

                    Punto de Venta *

                </label>

              <div style="position:relative;">

<input
id="buscarPunto"
class="input"
placeholder="Buscar punto de venta..."
autocomplete="off"
>

<div id="listaPuntos"></div>

<input
type="hidden"
id="txtPunto"
>

                <label>

                    Estado

                </label>

                <select

                    id="txtEstado"

                    class="input"

                >

                    <option value="Activo">

                        Activo

                    </option>

                    <option value="Inactivo">

                        Inactivo

                    </option>

                </select>

                <label>
    Teléfono (Opcional)
</label>

<input
    id="txtTelefono"
    class="input"
    type="text"
>

                <label>

                    Correo (Opcional)

                </label>

                <input
    id="txtCorreo"
    class="input"
    type="email"
>

                <label>

                    Fecha de ingreso (Opcional)

                </label>

                <input
    id="txtIngreso"
    class="input"
    type="date"
>

                <br>

               <div class="botones">

<button
id="btnGuardarEmpleado"
class="btn"
>
💾 Guardar
</button>

<br><br>

<button onclick="location.href='menu.html'">
    ⬅️ Volver al Menú
</button>

</div>
            </div>
            <hr>

            <h3>

                Lista de empleados

            </h3>

            <table class="tabla">

                <thead>

                    <tr>

                        <th>Documento</th>

                        <th>Nombre</th>

                        <th>Punto</th>

                        <th>Estado</th>

                        <th>Acción</th>

                    </tr>

                </thead>

                <tbody id="tbodyEmpleados">

                </tbody>

            </table>
        </div>

    `;

    iniciarEventos();

cargarPuntosVenta();

cargarEmpleados();
}


//====================================================
// EVENTOS
//====================================================

function iniciarEventos(){

    const btnGuardar = document.getElementById(
        "btnGuardarEmpleado"
    );

    if(btnGuardar){

        btnGuardar.addEventListener(
            "click",
            guardarEmpleado
        );

    }


    const btnNuevo = document.getElementById(
        "btnNuevoEmpleado"
    );

    if(btnNuevo){

        btnNuevo.addEventListener(
            "click",
            limpiarFormulario
        );

    }


    const btnDesactivar = document.getElementById(
        "btnDesactivarEmpleado"
    );

    if(btnDesactivar){

        btnDesactivar.addEventListener(
            "click",
            desactivarEmpleado
        );

    }


    const btnBuscar = document.getElementById(
        "btnBuscarEmpleado"
    );

    if(btnBuscar){

        btnBuscar.addEventListener(
            "click",
            buscarEmpleado
        );

    }

}
//====================================================
// GUARDAR EMPLEADO
//====================================================

async function guardarEmpleado(){

    const documento = document.getElementById("txtDocumento").value.trim();
    const nombre = document.getElementById("txtNombre").value.trim();
    const puntoVenta = document.getElementById("txtPunto").value;
    const estado = document.getElementById("txtEstado").value;
    const telefono = document.getElementById("txtTelefono").value.trim();
    const correo = document.getElementById("txtCorreo").value.trim();
    const fechaIngreso = document.getElementById("txtIngreso").value;

    if(documento==="" || nombre==="" || puntoVenta===""){

        alert("Documento, Nombre y Punto de Venta son obligatorios.");

        return;

    }

    try{

        if(idEmpleadoActual){

            await updateDoc(

                doc(db,"empleados",idEmpleadoActual),

                {

                    documento,
                    nombre,
                    puntoVenta,
                    estado,
                    telefono,
                    correo,
                    fechaIngreso

                }

            );

            alert("Empleado actualizado correctamente.");

        }

        else{

            const existe = await getDocs(

                query(

                    collection(db,"empleados"),

                    where("documento","==",documento)

                )

            );

            if(!existe.empty){

                alert("Ya existe un empleado con ese documento.");

                return;

            }

            await addDoc(

                collection(db,"empleados"),

                {

                    documento,
                    nombre,
                    puntoVenta,
                    estado,
                    telefono,
                    correo,
                    fechaIngreso,
                    fechaCreacion:new Date()

                }

            );

            alert("Empleado registrado correctamente.");

        }

        limpiarFormulario();

    }

    catch(error){

        console.error(error);

        alert("No fue posible guardar el empleado.");

    }

}

//====================================================
// BUSCAR EMPLEADO
//====================================================

window.buscarEmpleado = async function(){

    const texto = document
        .getElementById("txtBuscarEmpleado")
        .value
        .trim()
        .toLowerCase();
if(texto === ""){

    cargarEmpleados();

    limpiarFormulario();

    return;

}

    const tbody = document.getElementById(
        "tbodyEmpleados"
    );


    try{


        const respuesta = await getDocs(
            collection(db,"empleados")
        );


        tbody.innerHTML = "";


        respuesta.forEach((registro)=>{


            const empleado = registro.data();


            const documento = 
                String(empleado.documento || "")
                .toLowerCase();


            const nombre = 
                String(empleado.nombre || "")
                .toLowerCase();



            // FILTRO
            if(
                texto !== "" &&
                !documento.includes(texto) &&
                !nombre.includes(texto)
            ){

                return;

            }



            tbody.innerHTML += `

            <tr>

                <td>
                    ${empleado.documento || ""}
                </td>


                <td>
                    ${empleado.nombre || ""}
                </td>


                <td>
                    ${empleado.puntoVenta || "-"}
                </td>


                <td>
                    ${empleado.estado || "Activo"}
                </td>


                <td class="acciones">


                    <button
                    class="btn-icon btnAzul"
                    onclick="verEmpleado('${registro.id}')">

                    <i class="fa-solid fa-eye"></i>

                    </button>



                    <button
                    class="btn-icon btnAmarillo"
                    onclick="editarEmpleado('${registro.id}')">

                    <i class="fa-solid fa-pen"></i>

                    </button>



                    <button
                    class="btn-icon btnRojo"
                    onclick="eliminar('${registro.id}')">

                    <i class="fa-solid fa-trash"></i>

                    </button>


                </td>


            </tr>

            `;


        });


    }


    catch(error){

        console.error(error);

        alert(
            "Error buscando empleado."
        );

    }


};
//====================================================
// CARGAR PUNTOS DE VENTA
//====================================================

async function cargarPuntosVenta(){

    const input = document.getElementById(
        "buscarPunto"
    );

    const lista = document.getElementById(
        "listaPuntos"
    );

    const campoOculto = document.getElementById(
        "txtPunto"
    );


    if(!input || !lista || !campoOculto){
        return;
    }


    let puntos = [];


    try{

        const datos = await getDocs(
            collection(db,"puntosVenta")
        );


        datos.forEach((registro)=>{

            const punto = registro.data();

            puntos.push(
                punto.nombre
            );

        });


    }
    catch(error){

        console.error(
            "Error cargando puntos:",
            error
        );

        return;

    }



    input.addEventListener(
        "input",
        ()=>{


            const texto = input.value
            .toLowerCase()
            .trim();


            lista.innerHTML = "";


            if(texto===""){
                return;
            }



            const encontrados = puntos.filter(
                p => p.toLowerCase()
                .includes(texto)
            );



            encontrados.forEach((punto)=>{


                const div = document.createElement(
                    "div"
                );


                div.className =
                "opcionPunto";


                div.textContent =
                punto;



                div.onclick = ()=>{


                    input.value =
                    punto;


                    campoOculto.value =
                    punto;


                    lista.innerHTML =
                    "";

                };


                lista.appendChild(div);


            });


        }
    );

}
//====================================================
// CARGAR EMPLEADOS
//====================================================

async function cargarEmpleados(){

    const tbody = document.getElementById(
        "tbodyEmpleados"
    );


    if(!tbody){
        return;
    }
window.cargarEmpleados = cargarEmpleados;

    tbody.innerHTML = "";


    try{


        const respuesta = await getDocs(
            collection(
                db,
                "empleados"
            )
        );


        if(respuesta.empty){

            tbody.innerHTML = `

            <tr>

                <td colspan="5">

                    No hay empleados registrados.

                </td>

            </tr>

            `;

            return;

        }



        respuesta.forEach((registro)=>{


            const empleado = registro.data();



            const punto =

                empleado.puntoVenta ||

                empleado.puntoventa ||

                empleado.punto ||

                "-";



            const estado =

                empleado.estado ||

                empleado.estadoEmpleado ||

                "Activo";



            tbody.innerHTML += `

            <tr>


                <td>
                    ${empleado.documento || "-"}
                </td>


                <td>
                    ${empleado.nombre || "-"}
                </td>


                <td>
                    ${punto}
                </td>


                <td>
                    ${estado}
                </td>


                <td class="acciones">

<button 
onclick="verEmpleado('${registro.id}')"
class="circulo azul">
<i class="fa-solid fa-eye"></i>
</button>

<button 
onclick="editarEmpleado('${registro.id}')"
class="circulo naranja">
<i class="fa-solid fa-pen"></i>
</button>

<button 
onclick="eliminar('${empleado.documento}')"
class="circulo rojo">
<i class="fa-solid fa-trash"></i>
</button>
</td>
            </tr>

            `;


        });


    }

    catch(error){

        console.error(
            "Error cargando empleados:",
            error
        );

    }

}
//====================================================
// LIMPIAR FORMULARIO
//====================================================

function limpiarFormulario(){

    idEmpleadoActual = null;

    document.getElementById(

        "txtBuscarEmpleado"

    ).value = "";

    document.getElementById(

        "txtDocumento"

    ).value = "";

    document.getElementById(

        "txtNombre"

    ).value = "";

    document.getElementById(

        "txtPunto"

    ).value = "";

    document.getElementById(

        "txtEstado"

    ).value = "Activo";

    document.getElementById(

        "txtTelefono"

    ).value = "";

    document.getElementById(

        "txtCorreo"

    ).value = "";

    document.getElementById(

        "txtIngreso"

    ).value = "";

    document.getElementById(

        "btnGuardarEmpleado"

    ).innerHTML = "💾 Guardar";

    //------------------------------------------------
// RESTABLECER BOTÓN DESACTIVAR
//------------------------------------------------

const btnDesactivar = document.getElementById(
    "btnDesactivarEmpleado"
);

if(btnDesactivar){

    btnDesactivar.disabled = true;

    btnDesactivar.innerHTML = "🚫 Desactivar";

}
    //------------------------------------------------

    document.getElementById(

        "txtDocumento"

    ).focus();

}   
//====================================================
// EDITAR EMPLEADO
//====================================================

window.editarEmpleado = async function(id){

    try{

        const respuesta = await getDoc(

            doc(
                db,
                "empleados",
                id
            )

        );


        if(!respuesta.exists()){

            alert(
                "Empleado no encontrado."
            );

            return;

        }


        const empleado = respuesta.data();


        idEmpleadoActual = id;


        document.getElementById("txtDocumento").value =
            empleado.documento || "";


        document.getElementById("txtNombre").value =
            empleado.nombre || "";


        document.getElementById("txtPunto").value =
            empleado.puntoVenta || "";


        document.getElementById("txtEstado").value =
            empleado.estado || "Activo";


        document.getElementById("txtTelefono").value =
            empleado.telefono || "";


        document.getElementById("txtCorreo").value =
            empleado.correo || "";


        document.getElementById("txtIngreso").value =
            empleado.fechaIngreso || "";


        //------------------------------------------------
        // CAMBIAR BOTÓN GUARDAR A ACTUALIZAR
        //------------------------------------------------

        const btnGuardar = document.getElementById(
            "btnGuardarEmpleado"
        );


        if(btnGuardar){

            btnGuardar.innerHTML =
                "✏️ Actualizar";

            btnGuardar.dataset.modo =
                "editar";

        }



        //------------------------------------------------
        // ACTIVAR BOTÓN DESACTIVAR SI EXISTE
        //------------------------------------------------

        const btnDesactivar = document.getElementById(
            "btnDesactivarEmpleado"
        );


        if(btnDesactivar){

            btnDesactivar.disabled = false;

            btnDesactivar.innerHTML =
                "🚫 Desactivar";

        }



        //------------------------------------------------
        // SUBIR AL FORMULARIO
        //------------------------------------------------

        const formulario = document.querySelector(
            ".formulario"
        );


        if(formulario){

            formulario.scrollIntoView({

                behavior:"smooth",

                block:"start"

            });

        }


    }

    catch(error){

        console.error(
            error
        );


        alert(
            "No fue posible cargar el empleado."
        );

    }

};
//====================================================
// DESACTIVAR EMPLEADO
//====================================================

async function desactivarEmpleado(){

    if(idEmpleadoActual===null){

        alert(

            "Primero seleccione un empleado."

        );

        return;

    }

    const confirmar = confirm(

        "¿Desea desactivar este empleado?"

    );

    if(!confirmar){

        return;

    }

    try{

        await updateDoc(

            doc(

                db,

                "empleados",

                idEmpleadoActual

            ),

            {

                estado:"Inactivo"

            }

        );

        alert(

            "Empleado desactivado correctamente."

        );

        limpiarFormulario();

        cargarEmpleados();

    }

    catch(error){

        console.error(error);

        alert(

            "No fue posible desactivar el empleado."

        );

    }

}
//====================================================
// CREAR USUARIO OPERADOR DESDE EMPLEADO
//====================================================

async function crearUsuarioOperador(id){

    try{

        const sesion = JSON.parse(
            sessionStorage.getItem("usuarioActivo")
        );


        if(
            sesion.rol !== "administrador" &&
            sesion.rol !== "coordinador"
        ){

            alert(
                "No tiene permisos para crear usuarios."
            );

            return;

        }


        const empleadoDoc = await getDoc(

            doc(
                db,
                "empleados",
                id
            )

        );


        if(!empleadoDoc.exists()){

            alert(
                "Empleado no encontrado."
            );

            return;

        }



        const empleado = empleadoDoc.data();



        const existe = await getDocs(

            query(

                collection(db,"usuarios"),

                where(
                    "usuario",
                    "==",
                    empleado.documento
                )

            )

        );



        if(!existe.empty){

            alert(
                "Este empleado ya tiene usuario creado."
            );

            return;

        }



        await addDoc(

            collection(db,"usuarios"),

            {

                usuario: empleado.documento,

                nombre: empleado.nombre,

                rol:"operador",

                estado:"Activo",

                primerIngreso:true,


                permisos:{

                    entradasSalidas:true,

                    horas:false,
                    usuarios:false,
                    empleados:false,
                    puntosVenta:false,
                    dashboard:false,
                    backup:false,
                    mantenimiento:false,
                    reportes:false

                }

            }

        );


        alert(
            "Usuario operador creado correctamente."
        );


    }

    catch(error){

        console.error(error);

        alert(
            "Error creando usuario."
        );

    


}
//====================================================
// CREAR USUARIO OPERADOR
//====================================================

window.crearUsuarioOperador = async function(id){


    try{


        const empleadoRef = doc(
            db,
            "empleados",
            id
        );


        const empleadoSnap = await getDoc(
            empleadoRef
        );


        if(!empleadoSnap.exists()){

            alert("Empleado no encontrado.");
            return;

        }


        const empleado = empleadoSnap.data();


        // verificar usuario existente

        const usuarios = await getDocs(

            query(

                collection(db,"usuarios"),

                where(
                    "usuario",
                    "==",
                    empleado.documento
                )

            )

        );


        if(!usuarios.empty){

            alert(
                "Este empleado ya tiene usuario creado."
            );

            return;

        }



        // generar clave automática

        const clave = Math.random()
        .toString(36)
        .substring(2,10)
        .toUpperCase();



        await addDoc(

            collection(db,"usuarios"),

            {

                usuario: empleado.documento,

                nombre: empleado.nombre,

                rol:"operador",

                estado:"Activo",

                clave: clave,

                primerIngreso:true,


                permisos:{

                    entradasSalidas:true,

                    horas:false,

                    usuarios:false,

                    empleados:false,

                    puntosVenta:false,

                    dashboard:false,

                    backup:false,

                    mantenimiento:false,

                    reportes:false

                }

            }

        );



        alert(
`Usuario operador creado.

Usuario: ${empleado.documento}

Clave temporal: ${clave}`
        );


    }


        catch(error){

        console.error(error);

        alert(
            "Error creando usuario operador."
        );

    }

};};
//====================================================
// VER EMPLEADO
//====================================================

window.verEmpleado = async function(id){

    try{

        console.log("ID RECIBIDO:",id);


        const respuesta = await getDoc(
            doc(db,"empleados",id)
        );


        if(!respuesta.exists()){

            alert("Empleado no encontrado.");

            return;

        }


        const empleado = respuesta.data();


        console.log("DATOS:",empleado);


        idEmpleadoActual = id;


        const campos = {

            txtDocumento: empleado.documento || "",
            txtNombre: empleado.nombre || "",
            txtPunto: empleado.puntoVenta || "",
            txtEstado: empleado.estado || "Activo",
            txtTelefono: empleado.telefono || "",
            txtCorreo: empleado.correo || "",
            txtIngreso: empleado.fechaIngreso || ""

        };


        for(const idCampo in campos){

            const campo = document.getElementById(idCampo);


            if(campo){

                campo.value = campos[idCampo];

            }else{

                console.warn(
                    "Campo no encontrado:",
                    idCampo
                );

            }

        }


        const buscarPunto =
            document.getElementById("buscarPunto");


        if(buscarPunto){

            buscarPunto.value =
                empleado.puntoVenta || "";

        }


        const boton =
            document.getElementById("btnGuardarEmpleado");


        if(boton){

            boton.innerHTML =
                "✏️ Actualizar";

        }


        const formulario =
            document.querySelector(".formulario");


        if(formulario){

            formulario.scrollIntoView({

                behavior:"smooth",
                block:"start"

            });

        }


    }
    catch(error){

        console.error(
            "ERROR VER EMPLEADO:",
            error
        );


        alert(
            "No fue posible cargar el empleado."
        );

    }

};
//====================================================
// ELIMINAR EMPLEADO
//====================================================

window.eliminar = async function(documento){

    const confirmar = confirm(
        "¿Desea eliminar este empleado?"
    );


    if(!confirmar){

        return;

    }


    try{


        const respuesta = await getDocs(

            query(

                collection(db,"empleados"),

                where(
                    "documento",
                    "==",
                    documento
                )

            )

        );


        if(respuesta.empty){

            alert(
                "Empleado no encontrado."
            );

            return;

        }


        respuesta.forEach(async(registro)=>{


            await updateDoc(

                doc(
                    db,
                    "empleados",
                    registro.id
                ),

                {

                    estado:"Inactivo"

                }

            );


        });


        alert(
            "Empleado desactivado correctamente."
        );


        cargarEmpleados();


        limpiarFormulario();


    }


    catch(error){

        console.error(error);

        alert(
            "No fue posible eliminar el empleado."
        );

    }

};