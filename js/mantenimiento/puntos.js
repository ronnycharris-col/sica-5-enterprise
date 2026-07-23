//====================================================
// SICA 5.0 ENTERPRISE
// MÓDULO PUNTOS DE VENTA
// PARTE 1
//====================================================

//====================================================
// IMPORTACIONES
//====================================================

import { db } from "../firebase.js";

import {

    collection,
getDocs,
addDoc,
updateDoc,
doc,
getDoc,
query,
where,
deleteDoc

} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

//====================================================
// VARIABLES
//====================================================

let idPuntoActual = null;

//====================================================
// MOSTRAR MÓDULO
//====================================================

export function mostrarModuloPuntos(panelTrabajo){

    panelTrabajo.innerHTML = `

    <section class="moduloMantenimiento">

        <h2>

            <i class="fa-solid fa-store"></i>

            Mantenimiento de Puntos de Venta

        </h2>

        <div class="formulario">

            <button
                class="btn btnAzul"
                id="btnBuscarPunto">

                🔍 Buscar

            </button>

            <label>Código *</label>

            <input
                type="text"
                id="txtCodigoPunto">

            <label>Nombre *</label>

            <input
                type="text"
                id="txtNombrePunto">

            <label>Ciudad *</label>

            <input
                type="text"
                id="txtCiudadPunto">

            <label>Estado</label>

            <select id="txtEstadoPunto">

                <option>Activo</option>

                <option>Inactivo</option>

            </select>

            <button
                class="btn btnGris"
                id="btnNuevoPunto">

                🆕 Nuevo

            </button>

            <button
                class="btn btnVerde"
                id="btnGuardarPunto">

                💾 Guardar

            </button>

            <button
                class="btn btnRojo"
                id="btnDesactivarPunto">

                🚫 Desactivar

            </button>
<button
    class="btn btnRojo"
    id="btnEliminarPunto">

    🗑️ Eliminar

</button>
        </div>

        <hr>

<h3>

    Lista de Puntos de Venta

</h3>

<div class="resumenEmpleados">

    <div class="cardResumen">

        <i class="fa-solid fa-store"></i>

        <div>

            <span>Total</span>

            <strong id="lblTotalPuntos">

                0

            </strong>

        </div>

    </div>

    <div class="cardResumen">

        <i class="fa-solid fa-circle-check"></i>

        <div>

            <span>Activos</span>

            <strong id="lblActivosPuntos">

                0

            </strong>

        </div>

    </div>

    <div class="cardResumen">

        <i class="fa-solid fa-circle-xmark"></i>

        <div>

            <span>Inactivos</span>

            <strong id="lblInactivosPuntos">

                0

            </strong>

        </div>

    </div>

</div>

        <table class="tabla">

            <thead>

                <tr>

                    <th>Código</th>

                    <th>Nombre</th>

                    <th>Ciudad</th>

                    <th>Estado</th>

                    <th>Acción</th>

                </tr>

            </thead>

            <tbody id="tbodyPuntos">

            </tbody>

        </table>

    </section>

    `;

   console.log("Módulo Puntos cargado.");

cargarPuntos();

}
//====================================================
// EVENTOS
//====================================================

document.addEventListener("click",function(e){

    //------------------------------------------------
    // NUEVO
    //------------------------------------------------

    if(e.target.id==="btnNuevoPunto"){

        limpiarFormularioPuntos();

    }

    //------------------------------------------------
    // GUARDAR
    //------------------------------------------------

    if(e.target.id==="btnGuardarPunto"){

        guardarPunto();

    }

});

//====================================================
// LIMPIAR FORMULARIO
//====================================================

function limpiarFormularioPuntos(){

    idPuntoActual = null;

    document.getElementById("txtCodigoPunto").value="";

    document.getElementById("txtNombrePunto").value="";

    document.getElementById("txtCiudadPunto").value="";

    document.getElementById("txtEstadoPunto").value="Activo";

    document.getElementById("btnGuardarPunto").innerHTML="💾 Guardar";

    document.getElementById("txtCodigoPunto").focus();

}

//====================================================
// GUARDAR PUNTO
//====================================================

async function guardarPunto(){

    const codigo=

        document.getElementById("txtCodigoPunto").value.trim().toUpperCase();

    const nombre=

        document.getElementById("txtNombrePunto").value.trim();

    const ciudad=

        document.getElementById("txtCiudadPunto").value.trim();

    const estado=

        document.getElementById("txtEstadoPunto").value;

    //------------------------------------------------

    if(codigo===""){

        alert("Digite el código.");

        return;

    }

    if(nombre===""){

        alert("Digite el nombre.");

        return;

    }

    if(ciudad===""){

        alert("Digite la ciudad.");

        return;

    }

    //------------------------------------------------
    // NUEVO
    //------------------------------------------------

    if(idPuntoActual===null){

        const consulta=query(

            collection(db,"puntosVenta"),

            where("codigo","==",codigo)

        );

        const existe=await getDocs(consulta);

        if(!existe.empty){

            alert("Ya existe un punto de venta con ese código.");

            return;

        }

        await addDoc(

            collection(db,"puntosVenta"),

            {

                codigo,

                nombre,

                ciudad,

                estado

            }

        );

        alert("Punto de venta registrado correctamente.");

    }

    //------------------------------------------------
    // ACTUALIZAR
    //------------------------------------------------

    else{

        await updateDoc(

            doc(db,"puntosVenta",idPuntoActual),

            {

                codigo,

                nombre,

                ciudad,

                estado

            }

        );

        alert("Punto de venta actualizado.");

    }

    limpiarFormularioPuntos();

    cargarPuntos();

}
//====================================================
// CARGAR PUNTOS
//====================================================

async function cargarPuntos(){

    const tbody = document.getElementById("tbodyPuntos");

    if(!tbody){

        return;

    }

    tbody.innerHTML = "";

    try{

        const respuesta = await getDocs(

            collection(db,"puntosVenta")

        );

        //------------------------------------------------
        // CONTADORES
        //------------------------------------------------

        let total = 0;

        let activos = 0;

        let inactivos = 0;

        if(respuesta.empty){

            tbody.innerHTML = `

                <tr>

                    <td colspan="5">

                        No hay puntos de venta registrados.

                    </td>

                </tr>

            `;

            document.getElementById("lblTotalPuntos").textContent = 0;

            document.getElementById("lblActivosPuntos").textContent = 0;

            document.getElementById("lblInactivosPuntos").textContent = 0;

            return;

        }

        respuesta.forEach((registro)=>{

            const punto = registro.data();

            total++;

            if((punto.estado || "Activo")==="Activo"){

                activos++;

            }else{

                inactivos++;

            }

            const badgeEstado =

                (punto.estado || "Activo")==="Activo"

                ?

                `

                <span class="badgeEstado badgeActivo">

                    <i class="fa-solid fa-circle"></i>

                    Activo

                </span>

                `

                :

                `

                <span class="badgeEstado badgeInactivo">

                    <i class="fa-solid fa-circle"></i>

                    Inactivo

                </span>

                `;

            tbody.innerHTML += `

                <tr>

                    <td>${punto.codigo || "-"}</td>

                    <td>${punto.nombre || "-"}</td>

                    <td>${punto.ciudad || "-"}</td>

                    <td>${badgeEstado}</td>

                    <td>

    <button
        class="btn btnAzul"
        onclick="editarPunto('${registro.id}')">

        ✏️

    </button>

    <button
        class="btn btnRojo"
        onclick="eliminarPunto('${registro.id}')">

        🗑️

    </button>

</td>
                </tr>

            `;

        });

        //------------------------------------------------
        // ACTUALIZAR RESUMEN
        //------------------------------------------------

        document.getElementById("lblTotalPuntos").textContent = total;

        document.getElementById("lblActivosPuntos").textContent = activos;

        document.getElementById("lblInactivosPuntos").textContent = inactivos;

    }

    catch(error){

        console.error(error);

        alert("No fue posible cargar los puntos de venta.");

    }

}
//====================================================
// CARGAR TABLA AL ABRIR
//====================================================

setTimeout(()=>{

    cargarPuntos();

},200);
//====================================================
// EDITAR PUNTO
//====================================================

window.editarPunto = async function(id){

    try{

        const respuesta = await getDoc(

            doc(db,"puntosVenta",id)

        );

        if(!respuesta.exists()){

            alert("Punto de venta no encontrado.");

            return;

        }

        const punto = respuesta.data();

        idPuntoActual = id;

        //------------------------------------------------
        // CARGAR DATOS
        //------------------------------------------------

        document.getElementById("txtCodigoPunto").value =
            punto.codigo || "";

        document.getElementById("txtNombrePunto").value =
            punto.nombre || "";

        document.getElementById("txtCiudadPunto").value =
            punto.ciudad || "";

        document.getElementById("txtEstadoPunto").value =
            punto.estado || "Activo";

        //------------------------------------------------
        // BOTÓN GUARDAR
        //------------------------------------------------

        document.getElementById("btnGuardarPunto").innerHTML =
            "✏️ Actualizar";

        //------------------------------------------------
        // BOTÓN DESACTIVAR / REACTIVAR
        //------------------------------------------------

        const btnDesactivar =
            document.getElementById("btnDesactivarPunto");

        if(btnDesactivar){

            if((punto.estado || "Activo")==="Activo"){

                btnDesactivar.innerHTML =
                    "🚫 Desactivar";

            }else{

                btnDesactivar.innerHTML =
                    "✅ Reactivar";

            }

            btnDesactivar.disabled = false;

        }

        //------------------------------------------------
        // SUBIR AL FORMULARIO
        //------------------------------------------------

        document.querySelector(".formulario").scrollIntoView({

            behavior:"smooth",

            block:"start"

        });

        document.getElementById("txtNombrePunto").focus();

    }

    catch(error){

        console.error(error);

        alert("No fue posible cargar el punto de venta.");

    }

};
//====================================================
// BUSCAR PUNTO
//====================================================

async function buscarPunto(){

    const texto = document
        .getElementById("txtCodigoPunto")
        .value
        .trim()
        .toLowerCase();

    if(texto===""){

        alert("Digite el código o el nombre del punto de venta.");

        document
            .getElementById("txtCodigoPunto")
            .focus();

        return;

    }

    try{

        const respuesta = await getDocs(
            collection(db,"puntosVenta")
        );

        let encontrado = null;

        respuesta.forEach((registro)=>{

            if(encontrado) return;

            const punto = registro.data();

            const codigo = (punto.codigo || "").toLowerCase();
            const nombre = (punto.nombre || "").toLowerCase();

            if(
                codigo.includes(texto) ||
                nombre.includes(texto)
            ){
                encontrado = registro.id;
            }

        });

        if(!encontrado){

            alert("No se encontró el punto de venta.");

            return;

        }

        await editarPunto(encontrado);

    }
    catch(error){

        console.error(error);

        alert("No fue posible buscar el punto de venta.");

    }

}
//====================================================
// CAMBIAR ESTADO
//====================================================

async function desactivarPunto(){

    if(idPuntoActual===null){

        alert("Primero seleccione un punto de venta.");

        return;

    }

    try{

        const referencia =

            doc(db,"puntosVenta",idPuntoActual);

        const respuesta =

            await getDoc(referencia);

        if(!respuesta.exists()){

            alert("Punto de venta no encontrado.");

            return;

        }

        const punto = respuesta.data();

        const nuevoEstado =

            (punto.estado || "Activo")==="Activo"

                ? "Inactivo"

                : "Activo";

        await updateDoc(

            referencia,

            {

                estado:nuevoEstado

            }

        );

        alert(

            nuevoEstado==="Activo"

                ? "Punto reactivado correctamente."

                : "Punto desactivado correctamente."

        );

        limpiarFormularioPuntos();

        cargarPuntos();

    }

    catch(error){

        console.error(error);

        alert("No fue posible cambiar el estado.");

    }

}

//====================================================
// EVENTOS FINALES
//====================================================

document.addEventListener("click",(e)=>{

    if(e.target.id==="btnBuscarPunto"){

        buscarPunto();

    }

    if(e.target.id==="btnDesactivarPunto"){

        desactivarPunto();

    }
    if(e.target.id==="btnEliminarPunto"){

    if(idPuntoActual===null){

        alert("Primero seleccione un punto de venta.");

        return;

    }

    eliminarPunto(idPuntoActual);

}
if(e.target.id==="btnEliminarPunto"){

    if(idPuntoActual===null){

        alert("Primero seleccione un punto de venta.");

        return;

    }

    eliminarPunto(idPuntoActual);

}
});
//====================================================
// ELIMINAR PUNTO DE VENTA
//====================================================

window.eliminarPunto = async function(id){

    const confirmar = confirm(
        "¿Desea eliminar este punto de venta?"
    );

    if(!confirmar){
        return;
    }

    try{

        await deleteDoc(
            doc(db, "puntosVenta", id)
        );

        alert("Punto de venta eliminado correctamente.");

        if(idPuntoActual === id){
            limpiarFormularioPuntos();
        }

        cargarPuntos();

    }
    catch(error){

        console.error(error);

        alert("No fue posible eliminar el punto de venta.");

    }

};
