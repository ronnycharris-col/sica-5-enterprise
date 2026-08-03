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
    doc,
    query,
    where
    
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
//====================================================
// VARIABLES
//====================================================

let empleadoEditando = null;
let puntosVenta = [];
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

    document
    .getElementById("buscarPuntoEmpleado")
    .addEventListener("input", buscarPuntoEmpleado);    

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

            puntosVenta.push(punto);

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

//====================================================
// BUSCAR PUNTO DE VENTA
//====================================================

function buscarPuntoEmpleado() {

    const texto = document
        .getElementById("buscarPuntoEmpleado")
        .value
        .toLowerCase()
        .trim();


    const lista = document.getElementById("listaPuntosEmpleado");


    lista.innerHTML = "";


    if (texto === "") {
        return;
    }


    const encontrados = puntosVenta.filter((punto)=>{


        return (

            punto.nombre.toLowerCase().includes(texto)

            ||

            punto.ciudad.toLowerCase().includes(texto)

        );


    });



    encontrados.forEach((punto)=>{


        const opcion = document.createElement("div");

opcion.innerHTML = `
    ${punto.nombre} - ${punto.ciudad}
`;

opcion.style.padding = "8px";
opcion.style.borderBottom = "1px solid #ccc";
opcion.style.cursor = "pointer";
opcion.style.background = "white";
opcion.style.color = "#000";
opcion.style.marginTop = "2px";
opcion.style.borderRadius = "5px";

        opcion.style.cursor = "pointer";


        opcion.onclick = function(){

    // Guardar valor real para Firebase
    document.getElementById("puntoventa").value =
        punto.nombre;


    // Mostrar selección en el buscador
    document.getElementById("buscarPuntoEmpleado").value =
        punto.nombre + " - " + punto.ciudad;


    // Ocultar resultados
    lista.innerHTML = "";


};


        


        lista.appendChild(opcion);


    });


}
//========================================
// GUARDAR EMPLEADO
//========================================

async function guardarEmpleado() {

    const documento = document.getElementById("documento").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const puntoventa = document.getElementById("puntoventa").value;
    const tipoOperador = document.getElementById("tipoOperador").value;
    if (
    documento === "" ||
    nombre === "" ||
    puntoventa === "" ||
    tipoOperador === ""
) {

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
    String(empleado.documento) === String(documento) &&
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
    puntoventa,
    tipoOperador

};

        // Guardar en Firebase

        // Si estamos editando, actualizar
if (empleadoEditando) {

    await updateDoc(
        doc(db, "empleados", empleadoEditando),
        empleado
    );


    // ACTUALIZAR TIPO DE OPERADOR EN USUARIO

    const usuarios = await getDocs(
        collection(db, "usuarios")
    );


    usuarios.forEach(async (registro) => {

        const usuario = registro.data();


        if (
            String(usuario.usuario) === String(documento)
        ) {


            await updateDoc(
                doc(db, "usuarios", registro.id),
                {
                    tipoOperador: tipoOperador
                }
            );


        }

    });


    alert("Empleado actualizado correctamente.");

} else {

    await addDoc(
        collection(db, "empleados"),
        empleado
    );

    alert("Empleado registrado correctamente.");


    const crearUsuario = confirm(
        "¿Desea crear usuario operador para este empleado?"
    );


        if(crearUsuario){


    const existeUsuario = await getDocs(
        query(
            collection(db,"usuarios"),
            where(
                "usuario",
                "==",
                empleado.documento
            )
        )
    );


    if(!existeUsuario.empty){

        alert(
            "Este empleado ya tiene usuario creado."
        );

        return;

    }


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
                    tipoOperador: empleado.tipoOperador,
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

                    <td class="acciones">

    <button 
class="btnAccion btnAzul"
onclick="verEmpleado('${empleado.documento}')">

👁 Ver

</button>


<button 
class="btnAccion btnAmarillo"
onclick="editarEmpleado('${doc.id}')">

✏️ Editar

</button>


<button 
class="btnAccion btnRojo"
onclick="eliminarEmpleado('${doc.id}')">

🗑 Eliminar

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

        document.getElementById("tipoOperador").value =
        empleado.tipoOperador || "";
        
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

    (empleado.documento || "").toLowerCase().includes(texto) ||

    (empleado.nombre || "").toLowerCase().includes(texto) ||

    (empleado.puntoventa || "").toLowerCase().includes(texto)

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
//====================================================
// VER DETALLE EMPLEADO
//====================================================

window.verEmpleado = async function(documento){

    const consulta = await getDocs(
        collection(db,"empleados")
    );


    let encontrado = null;


    consulta.forEach((doc)=>{

        const empleado = doc.data();


        if(String(empleado.documento) === String(documento)){

            encontrado = empleado;

        }

    });


    if(!encontrado){

        alert("Empleado no encontrado");

        return;

    }


    alert(
`DETALLE DEL OPERADOR

Nombre:
${encontrado.nombre}

Documento:
${encontrado.documento}

Punto de venta:
${encontrado.puntoventa}

Tipo:
${encontrado.tipoOperador || "Sin clasificar"}`
    );


}