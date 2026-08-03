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


    <button

        id="btnActualizarPermisos"

        class="btn btnAzul"

        style="display:none;"

    >

        🔄 Actualizar permisos por rol

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
const btnActualizarPermisos =
document.getElementById("btnActualizarPermisos");


if(btnActualizarPermisos){

    const usuarioSesion = JSON.parse(
        sessionStorage.getItem("usuarioActivo")
    );


    if(usuarioSesion?.rol !== "administrador"){

        btnActualizarPermisos.style.display="none";

    }else{

        btnActualizarPermisos.onclick =
        actualizarPermisosPorRol;

    }

}
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

    const usuarioSesion = JSON.parse(
        sessionStorage.getItem("usuarioActivo")
    );


    const resultado = document.getElementById(
        "resultadoUsuarios"
    );


    const esAdministrador =
        usuarioSesion?.rol === "administrador";


    const esCoordinador =
        usuarioSesion?.rol === "coordinador";


    let opcionesRol = "";


    if(esAdministrador){

        opcionesRol = `

        <option value="administrador"
        ${usuario.rol==="administrador"?"selected":""}>
        👑 Administrador
        </option>


        <option value="coordinador"
        ${usuario.rol==="coordinador"?"selected":""}>
        🛠 Coordinador
        </option>


        <option value="operador"
        ${usuario.rol==="operador"?"selected":""}>
        👤 Operador
        </option>

        `;

    }


    if(esCoordinador){

        opcionesRol = `

        <option value="operador"
        selected>
        👤 Operador
        </option>

        `;

    }



    let permisosHTML = "";


    if(esAdministrador){

        permisosHTML = `

<h3 class="tituloPermisos">

<i class="fa-solid fa-shield-halved"></i>

Permisos del usuario

</h3>


<div class="permisosGrid">


<label>
<input type="checkbox" id="permDashboard"
${usuario.permisos?.dashboard?"checked":""}>
📊 Dashboard
</label>


<label>
<input type="checkbox" id="permEmpleados"
${usuario.permisos?.empleados?"checked":""}>
👥 Empleados
</label>


<label>
<input type="checkbox" id="permPuntosVenta"
${usuario.permisos?.puntosVenta?"checked":""}>
🏪 Puntos de Venta
</label>


<label>
<input type="checkbox" id="permHoras"
${usuario.permisos?.horas?"checked":""}>
⏱ Horas
</label>

<label>
<input type="checkbox" id="permEntradas"
${usuario.permisos?.entradasSalidas?"checked":""}>
📷 Entradas / Salidas
</label>


<label>
<input type="checkbox" id="permBackup"
${usuario.permisos?.backup?"checked":""}>
💾 Respaldo
</label>

<label>
<input type="checkbox" id="permReportes"
${usuario.permisos?.reportes?"checked":""}>
📄 Reportes
</label>


<label>
<input type="checkbox" id="permUsuarios"
${usuario.permisos?.usuarios?"checked":""}>
👤 Usuarios
</label>


<label>
<input type="checkbox" id="permConfiguracion"
${usuario.permisos?.configuracion?"checked":""}>
⚙️ Configuración
</label>

<label>
<input type="checkbox" id="permMantenimiento"
${usuario.permisos?.mantenimiento ? "checked" : ""}>
🛠️ Mantenimiento
</label>

</div>

`;

    }



    resultado.innerHTML = `

<div class="panelCard panelFichaUsuario">


<h2>${usuario.nombre}</h2>

<p>
Documento:
<strong>${usuario.usuario}</strong>
</p>


<div class="rol-box">

<label>
Rol
</label>


<select id="txtRol" class="input">

${opcionesRol}

</select>


</div>


${permisosHTML}


<div class="botones">


<button id="btnClave"
class="btn-premium">

🔑 Restablecer Clave

</button>


<button id="btnEstado"
class="btn-premium">

${usuario.estado==="Activo"?"🚫 Desactivar":"✅ Activar"}

</button>



${
(
esAdministrador ||
esCoordinador
)
&& usuario.rol==="operador"
?
`
<button id="btnEliminar"
class="btn-premium">

🗑️ Eliminar Usuario

</button>
`
:""
}


${
esAdministrador
?
`
<button id="btnGuardar"
class="btn-premium">

💾 Guardar Cambios

</button>
`
:""
}


</div>


</div>

`;



const btnGuardar =
document.getElementById("btnGuardar");


const btnClave =
document.getElementById("btnClave");


const btnEstado =
document.getElementById("btnEstado");


const btnEliminar =
document.getElementById("btnEliminar");

console.log("SESION:", usuarioSesion);
console.log("USUARIO CONSULTADO:", usuario);
console.log("ROL SESION:", usuarioSesion?.rol);
console.log("ROL USUARIO:", usuario.rol);


if(btnGuardar){

btnGuardar.onclick = ()=>guardarCambios(
    idUsuario,
    usuario
);

}



if(btnClave){

btnClave.onclick = ()=>restablecerClave(
    idUsuario,
    usuario
);

}



if(btnEstado){

btnEstado.onclick = ()=>cambiarEstado(
    idUsuario,
    usuario
);

}



if(btnEliminar){

btnEliminar.onclick = ()=>eliminarUsuario(
    idUsuario,
    usuario
);

}


}
//====================================================
// GUARDAR CAMBIOS
//====================================================

async function guardarCambios(idUsuario, usuario){

    const usuarioSesion = JSON.parse(
        sessionStorage.getItem("usuarioActivo")
    );


    //================================================
    // SEGURIDAD COORDINADOR
    //================================================

    if(usuarioSesion?.rol === "coordinador"){

        alert(
            "Un coordinador no puede modificar roles ni permisos."
        );

        return;

    }


    try{


        const rol = document.getElementById(
            "txtRol"
        ).value;



        const permisos = {

            dashboard:
            document.getElementById("permDashboard")?.checked || false,


            empleados:
            document.getElementById("permEmpleados")?.checked || false,


            puntosVenta:
            document.getElementById("permPuntosVenta")?.checked || false,


            horas:
            document.getElementById("permHoras")?.checked || false,


            reportes:
            document.getElementById("permReportes")?.checked || false,


            usuarios:
            document.getElementById("permUsuarios")?.checked || false,


            configuracion:
            document.getElementById("permConfiguracion")?.checked || false,
            entradasSalidas:
document.getElementById("permEntradas")?.checked || false,


backup:
document.getElementById("permBackup")?.checked || false,
            

        };



        await updateDoc(

            doc(db,"usuarios",idUsuario),

            {

                rol,

                permisos

            }

        );



        usuario.rol = rol;

        usuario.permisos = permisos;



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
        "¿Desea restablecer la contraseña de " + usuario.nombre + "?"
    );

    if(!confirmar){

        return;

    }

    try{

        const claveTemporal =
            "SICA" +
            Math.floor(
                1000 + Math.random()*9000
            );


        await updateDoc(

            doc(db,"usuarios",idUsuario),

            {

                clave: claveTemporal,

                primerIngreso:true

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
        "¿Está seguro de eliminar al usuario " + usuario.nombre +
        "?\n\nEsta acción no se puede deshacer."
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
//====================================================
// MIGRACIÓN MASIVA DE PERMISOS POR ROL
// SOLO ADMINISTRADOR
//====================================================

export async function actualizarPermisosPorRol(){

    const usuarioSesion = JSON.parse(
        sessionStorage.getItem("usuarioActivo")
    );


    if(usuarioSesion?.rol !== "administrador"){

        alert(
            "Solo el administrador puede ejecutar esta actualización."
        );

        return;
    }


    const confirmar = confirm(
        "¿Desea actualizar los permisos de todos los usuarios según su rol?"
    );


    if(!confirmar) return;


    try{


        const usuarios = await getDocs(
            collection(db,"usuarios")
        );


        let actualizados = 0;


        for(const usuarioDoc of usuarios.docs){


            const usuario = usuarioDoc.data();


            // NO TOCAR ADMINISTRADORES

            if(usuario.rol === "administrador"){

                continue;

            }



            let permisos = {};



            //=============================
            // OPERADOR
            //=============================

            if(usuario.rol === "operador"){


                permisos = {

                    entradasSalidas:true,

                    horas:false,
                    usuarios:false,
                    empleados:false,
                    puntosVenta:false,
                    dashboard:false,
                    backup:false,
                    mantenimiento:false,
                    reportes:false,
                    configuracion:false

                };

            }



            //=============================
            // COORDINADOR
            //=============================

            if(usuario.rol === "coordinador"){


                permisos = {

                    usuarios:true,
                    empleados:true,
                    puntosVenta:true,
                    reportes:true,
                    entradasSalidas:true,

                    horas:false,

                    dashboard:false,
                    backup:false,
                    mantenimiento:false,
                    configuracion:false

                };

            }



            await updateDoc(

                doc(
                    db,
                    "usuarios",
                    usuarioDoc.id
                ),

                {
                    permisos
                }

            );


            actualizados++;


        }



        alert(
            "Proceso terminado.\nUsuarios actualizados: "
            + actualizados
        );


    }
    catch(error){

        console.error(error);

        alert(
            "Error actualizando permisos."
        );

    }

}