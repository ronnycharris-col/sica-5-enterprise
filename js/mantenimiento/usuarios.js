//====================================================
// SICA 5.0 ENTERPRISE
// MÓDULO DE USUARIOS
// PARTE 1 DE 8
//====================================================


//====================================================
// IMPORTACIONES
//====================================================

import { db } from "../firebase.js";

import {

    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    deleteDoc

} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";


//====================================================
// MOSTRAR MÓDULO
//====================================================

export function mostrarModuloUsuarios(panel){

    panel.innerHTML = `

        <section class="panelCard">

            <header>

                <h2>

                    <i class="fa-solid fa-users-gear"></i>

                    Gestión de Usuarios

                </h2>

                <p>

                    Administre usuarios, permisos y accesos al sistema SICA Enterprise.

                </p>

            </header>


            <!--==========================================
                    BUSCADOR
            ==========================================-->

            <div class="busqueda">

                <input

                    id="txtBuscarUsuario"

                    class="input"

                    type="text"

                    autocomplete="off"

                    placeholder="Ingrese el documento del usuario"

                >

                <button

                    id="btnBuscarUsuario"

                    class="btn btnAzul"

                >

                    <i class="fa-solid fa-magnifying-glass"></i>

                    Buscar

                </button>

            </div>


            <hr>


            <!--==========================================
                    RESULTADO
            ==========================================-->

            <div id="resultadoUsuarios">

                <div
                    style="
                        text-align:center;
                        padding:50px 20px;
                        color:#6B7280;
                    ">

                    <i
                        class="fa-solid fa-user-large"

                        style="
                            font-size:62px;
                            color:#1565C0;
                            margin-bottom:20px;
                        ">

                    </i>

                    <h3>

                        Gestión de Usuarios

                    </h3>

                    <p>

                        Busque un usuario mediante su documento
                        para administrar permisos,
                        contraseña y estado del sistema.

                    </p>

                </div>

            </div>

        </section>

    `;

    iniciarEventos();

}
//====================================================
// EVENTOS
//====================================================

function iniciarEventos(){

    const btnBuscar = document.getElementById("btnBuscarUsuario");
    const txtBuscar = document.getElementById("txtBuscarUsuario");

    if(btnBuscar){

        btnBuscar.addEventListener("click", buscarUsuario);

    }

    if(txtBuscar){

        txtBuscar.focus();

        txtBuscar.addEventListener("keydown",(e)=>{

            if(e.key==="Enter"){

                buscarUsuario();

            }

        });

    }

}


//====================================================
// BUSCAR USUARIO
//====================================================

async function buscarUsuario(){

    const txtBuscar=document.getElementById("txtBuscarUsuario");

    const documento=txtBuscar.value.trim();

    const resultado=document.getElementById("resultadoUsuarios");

    //------------------------------------------------
    // VALIDACIÓN
    //------------------------------------------------

    if(documento===""){

        resultado.innerHTML=`

            <div class="panelCard">

                <h3>

                    Documento requerido

                </h3>

                <p>

                    Debe ingresar el documento del usuario.

                </p>

            </div>

        `;

        txtBuscar.focus();

        return;

    }


    //------------------------------------------------
    // CARGANDO
    //------------------------------------------------

    resultado.innerHTML=`

        <div class="panelCard"

            style="text-align:center;padding:40px;">

            <i

                class="fa-solid fa-spinner fa-spin"

                style="font-size:35px;color:#1565C0;">

            </i>

            <p style="margin-top:15px;">

                Consultando usuario...

            </p>

        </div>

    `;


    try{

        const consulta=query(

            collection(db,"usuarios"),

            where("usuario","==",documento)

        );

        const respuesta=await getDocs(consulta);

        //------------------------------------------------
        // NO ENCONTRADO
        //------------------------------------------------

        if(respuesta.empty){

            resultado.innerHTML=`

                <div class="panelCard"

                    style="text-align:center;">

                    <i

                        class="fa-solid fa-circle-xmark"

                        style="font-size:45px;color:#E53935;">

                    </i>

                    <h3>

                        Usuario no encontrado

                    </h3>

                    <p>

                        No existe ningún usuario registrado
                        con el documento <strong>${documento}</strong>.

                    </p>

                </div>

            `;

            txtBuscar.select();

            return;

        }


        //------------------------------------------------
        // MOSTRAR FICHA
        //------------------------------------------------

        respuesta.forEach((registro)=>{

            mostrarFichaUsuario(

                registro.id,

                registro.data()

            );

        });

    }

    catch(error){

        console.error(error);

        resultado.innerHTML=`

            <div class="panelCard"

                style="text-align:center;">

                <i

                    class="fa-solid fa-triangle-exclamation"

                    style="font-size:45px;color:#F57C00;">

                </i>

                <h3>

                    Error de conexión

                </h3>

                <p>

                    No fue posible consultar la información
                    en Firebase.

                </p>

            </div>

        `;

    }

}
//====================================================
// MOSTRAR FICHA DEL USUARIO
//====================================================

function mostrarFichaUsuario(idUsuario, usuario){

    const resultado = document.getElementById(

        "resultadoUsuarios"

    );

    resultado.innerHTML = `

        <div class="panelCard panelFichaUsuario">

    <div class="cabeceraUsuario">

        <div class="iconoUsuario">

            <i class="fa-solid fa-user"></i>

        </div>

        <div class="datosCabecera">

            <h2>${usuario.nombre}</h2>

            <span>Documento: ${usuario.usuario}</span>

        </div>

        <div class="${
            usuario.estado === "Activo"
                ? "estadoActivo"
                : "estadoInactivo"
        }">

            ${usuario.estado}

        </div>

    </div>

    <hr>

            <p>

                <strong>Documento:</strong>

                ${usuario.usuario}

            </p>

            <p>

                <strong>Rol</strong>

            </p>

            <select
                id="txtRol"
                class="input">

                <option
                    value="administrador"
                    ${usuario.rol==="administrador" ? "selected" : ""}>

                    Administrador

                </option>

                <option
                    value="coordinador"
                    ${usuario.rol==="coordinador" ? "selected" : ""}>

                    Coordinador

                </option>

                <option
                    value="operador"
                    ${usuario.rol==="operador" ? "selected" : ""}>

                    Operador

                </option>

            </select>

            <br><br>

            <p>

               <strong>Estado:</strong>

<span style="font-weight:bold;
color:${usuario.estado==="Activo"
    ? "#2E7D32"
    : "#C62828"}">

    ${usuario.estado}

</span>

            </p>

            <br>

            <label>

                <input

                    type="checkbox"

                    id="chkMantenimiento"

                    ${usuario.permisoMantenimiento ? "checked" : ""}

                >

              🛠 Permitir acceso al Centro de Mantenimiento

            </label>

            <br><br>

            <div class="botones">

                <button
                    id="btnGuardar"
                    class="btn btnVerde">

                    💾 Guardar Cambios

                </button>
<button
    id="btnClave"
    class="btn btnAzul">

    🔑 Restablecer Clave

</button>
                <button
                    id="btnEstado"
                    class="btn btnRojo">

                    ${usuario.estado==="Activo"

                        ? "🚫 Desactivar"

                        : "✅ Activar"}

                </button>
<button
    id="btnEliminar"
    class="btn btnRojo">

    🗑️ Eliminar Usuario

</button>
            </div>

        </div>

    `;

    //------------------------------------------------
    // EVENTOS
    //------------------------------------------------

    document.getElementById(

        "btnGuardar"

    ).addEventListener(

        "click",

        ()=>guardarCambios(

            idUsuario,

            usuario

        )

    );
document.getElementById(

    "btnClave"

).addEventListener(

    "click",

    ()=>restablecerClave(

        idUsuario,

        usuario

    )

);
    document.getElementById(

        "btnEstado"

    ).addEventListener(

        "click",

        ()=>cambiarEstado(

            idUsuario,

            usuario

        )

    );
document.getElementById(

    "btnEliminar"

).addEventListener(

    "click",

    ()=>eliminarUsuario(

        idUsuario,

        usuario

    )

);
}
//====================================================
// GUARDAR CAMBIOS
//====================================================

async function guardarCambios(idUsuario, usuario){

    try{

        const rol = document.getElementById(

            "txtRol"

        ).value;

        const permisoMantenimiento = document.getElementById(

            "chkMantenimiento"

        ).checked;

        await updateDoc(

            doc(db,"usuarios",idUsuario),

            {

                rol,

                permisoMantenimiento

            }

        );

        usuario.rol = rol;

        usuario.permisoMantenimiento = permisoMantenimiento;

        alert(

            "Cambios guardados correctamente."

        );

    }

    catch(error){

        console.error(error);

        alert(

            "Error guardando cambios."

        );

    }

}

//====================================================
// CAMBIAR ESTADO
//====================================================

async function cambiarEstado(idUsuario, usuario){
const confirmar = confirm(

    usuario.estado==="Activo"

    ? "¿Desea desactivar este usuario?"

    : "¿Desea activar este usuario?"

);

if(!confirmar){

    return;

}
    try{

        const nuevoEstado =

            usuario.estado==="Activo"

            ? "Inactivo"

            : "Activo";

        await updateDoc(

            doc(db,"usuarios",idUsuario),

            {

                estado:nuevoEstado

            }

        );

        usuario.estado = nuevoEstado;

        mostrarFichaUsuario(

            idUsuario,

            usuario

        );

        alert(

            "Estado actualizado."

        );

    }

    catch(error){

        console.error(error);

        alert(

            "No fue posible actualizar."

        );

    }

}
//====================================================
// RESTABLECER CLAVE
//====================================================

async function restablecerClave(idUsuario, usuario){

    const confirmar = confirm(

        `¿Desea restablecer la contraseña de ${usuario.nombre}?`

    );

    if(!confirmar){

        return;

    }

    try{
//----------------------------------------------------
// CONTRASEÑA TEMPORAL
//----------------------------------------------------

const claveTemporal =

    "SICA" +

    Math.floor(

        1000 +

        Math.random()*9000

    );
        await updateDoc(

            doc(db,"usuarios",idUsuario),

            {

                clave: claveTemporal,

                primerIngreso: true

            }

        );

        

           alert(

    "Contraseña restablecida correctamente.\n\n" +

    "Contraseña temporal: " +

    claveTemporal

);

    }

    catch(error){

        console.error(error);

        alert(

            "No fue posible restablecer la contraseña."

        );

    }

}
//====================================================
// ELIMINAR USUARIO
//====================================================

async function eliminarUsuario(idUsuario, usuario){

    const confirmar = confirm(
        `¿Está seguro de eliminar al usuario ${usuario.nombre}?\n\nEsta acción no se puede deshacer.`
    );

    if(!confirmar) return;

    try{

        await deleteDoc(
            doc(db,"usuarios",idUsuario)
        );

        alert("Usuario eliminado correctamente.");

        document.getElementById("resultadoUsuarios").innerHTML = `
            <div class="panelCard" style="text-align:center;padding:40px;">
                <i class="fa-solid fa-circle-check"
                   style="font-size:48px;color:#2E7D32;"></i>

                <h3>Usuario eliminado</h3>

                <p>El usuario fue eliminado correctamente.</p>

            </div>
        `;

        document.getElementById("txtBuscarUsuario").value="";
        document.getElementById("txtBuscarUsuario").focus();

    }

    catch(error){

        console.error(error);

        alert("No fue posible eliminar el usuario.");

    }

}