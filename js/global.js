//====================================================
// SICA Enterprise
// PANEL GLOBAL
//====================================================


import { db } from "./firebase.js";


import {

collection,
getDocs

} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";




//====================================================
// CARGAR EMPRESAS
//====================================================


async function cargarEmpresas(){


const tabla = document.getElementById(
    "tablaEmpresas"
);



const consulta = await getDocs(
    collection(db,"empresas")
);



consulta.forEach((documento)=>{


const empresa = documento.data();



tabla.innerHTML += `

<tr>

<td>${documento.id}</td>

<td>${empresa.nombre}</td>

<td>${empresa.plan}</td>

<td>${empresa.estado}</td>


<td>

<button onclick="location.href='configurar-empresa.html?empresa=${documento.id}'">
Configurar
</button>

</td>


</tr>


`;



});



}



//====================================================
// INICIO
//====================================================


cargarEmpresas();