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

                <i class="fa-solid fa-id-card"></i>

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

                <select

                    id="txtPunto"

                    class="input"

                >

                    <option value="">

                        Seleccione...

                    </option>

                </select>

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

        id="btnNuevoEmpleado"

        class="btn btnGris"

    >

        🆕 Nuevo

    </button>

    <button

        id="btnGuardarEmpleado"

        class="btn btnVerde"

    >

        💾 Guardar

    </button>

    <button

        id="btnDesactivarEmpleado"

        class="btn btnRojo"

    >

        🚫 Desactivar

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

    document.getElementById(

        "btnGuardarEmpleado"

    ).addEventListener(

        "click",

        guardarEmpleado

    );

    document.getElementById(

        "btnNuevoEmpleado"

    ).addEventListener(

        "click",

        limpiarFormulario

    );

    document.getElementById(

        "btnDesactivarEmpleado"

    ).addEventListener(

        "click",

        desactivarEmpleado

    );

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

async function buscarEmpleado(){

    const documento = document.getElementById(

        "txtBuscarEmpleado"

    ).value.trim();

    if(documento===""){

        alert("Ingrese un documento.");

        return;

    }

    try{

        const respuesta = await getDocs(

            query(

                collection(db,"empleados"),

                where("documento","==",documento)

            )

        );

        if(respuesta.empty){

            alert("Empleado no encontrado.");

            return;

        }

        respuesta.forEach((registro)=>{

            idEmpleadoActual = registro.id;
document.getElementById(
    "btnGuardarEmpleado"
).innerHTML = "✏️ Actualizar";
            const empleado = registro.data();

            document.getElementById("txtDocumento").value = empleado.documento;
            document.getElementById("txtNombre").value = empleado.nombre;
            document.getElementById("txtPunto").value = empleado.puntoVenta;
            document.getElementById("txtEstado").value = empleado.estado;
            document.getElementById("txtTelefono").value = empleado.telefono || "";
            document.getElementById("txtCorreo").value = empleado.correo || "";
            document.getElementById("txtIngreso").value = empleado.fechaIngreso || "";

        });

    }

    catch(error){

        console.error(error);

        alert("Error buscando empleado.");

    }

}

//====================================================
// CARGAR PUNTOS DE VENTA
//====================================================

async function cargarPuntosVenta(){

    const combo = document.getElementById("txtPunto");

    if(!combo){

        return;

    }

    combo.innerHTML = `

        <option value="">

            Seleccione...

        </option>

    `;

    try{

        const datos = await getDocs(

            collection(db,"puntosVenta")

        );

        datos.forEach((registro)=>{

            const punto = registro.data();

            combo.innerHTML += `

                <option value="${punto.nombre}">

                    ${punto.nombre}

                </option>

            `;

        });

    }

    catch(error){

        console.error(error);

    }

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

            //==========================================
            // COMPATIBILIDAD CON REGISTROS ANTIGUOS
            //==========================================

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

                    <td>

                        <button

                            class="btn btnAzul"

                            onclick="editarEmpleado('${registro.id}')"

                        >

                            ✏️

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

    btnDesactivar.disabled = false;

    btnDesactivar.innerHTML = "🚫 Desactivar";

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

        document.getElementById(

            "txtDocumento"

        ).value = empleado.documento;

        document.getElementById(

            "txtNombre"

        ).value = empleado.nombre;

        document.getElementById(

            "txtPunto"

        ).value = empleado.puntoVenta;

        document.getElementById(

            "txtEstado"

        ).value = empleado.estado || "Activo";

        document.getElementById(

            "txtTelefono"

        ).value = empleado.telefono || "";

        document.getElementById(

            "txtCorreo"

        ).value = empleado.correo || "";

        document.getElementById(

            "txtIngreso"

        ).value = empleado.fechaIngreso || "";

        document.getElementById(

            "btnGuardarEmpleado"

        ).innerHTML = "✏️ Actualizar";
//------------------------------------------------
// BOTÓN DESACTIVAR
//------------------------------------------------

const btnDesactivar = document.getElementById(

    "btnDesactivarEmpleado"

);

if(empleado.estado==="Inactivo"){

    btnDesactivar.disabled = true;

    btnDesactivar.innerHTML = "🚫 Ya está Inactivo";

}

else{

    btnDesactivar.disabled = false;

    btnDesactivar.innerHTML = "🚫 Desactivar";

}
        //------------------------------------------------
        // SUBIR AL FORMULARIO
        //------------------------------------------------

        document.querySelector(

            ".formulario"

        ).scrollIntoView({

            behavior:"smooth",

            block:"start"

        });

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