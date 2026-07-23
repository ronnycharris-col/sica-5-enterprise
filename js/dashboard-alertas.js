//====================================================
// SICA 5.0 ENTERPRISE
// dashboard-alertas.js
//====================================================

//====================================================
// ACTUALIZAR CENTRO DE ALERTAS
//====================================================

export function actualizarAlertas(

    registros,
    personalPresente

){

    //--------------------------------------------------
    // CONTENEDOR
    //--------------------------------------------------

    const contenedor = document.getElementById("centroAlertas");

    if(!contenedor){

        return;

    }

    //--------------------------------------------------
    // LIMPIAR
    //--------------------------------------------------

    contenedor.innerHTML="";

    //--------------------------------------------------
    // SIN MOVIMIENTOS
    //--------------------------------------------------

    if(personalPresente.length===0){

        contenedor.innerHTML=`

            <div class="alerta info">

                <i class="fa-solid fa-circle-info"></i>

                <div>

                    <strong>Sin novedades</strong>

                    <p>No hay operadores presentes.</p>

                </div>

            </div>

        `;

        return;

    }

    //--------------------------------------------------
    // ORDENAR POR HORA
    //--------------------------------------------------

    const lista=[...personalPresente];

    lista.sort((a,b)=>{

        return (b.hora || "").localeCompare(a.hora || "");

    });

    //--------------------------------------------------
    // MOSTRAR ÚLTIMOS 10
    //--------------------------------------------------

    lista.slice(0,10).forEach((operador)=>{

    contenedor.innerHTML += `

        <div class="alerta-card">

            <div class="alerta-icono">

                <i class="fa-solid fa-user-check"></i>

            </div>

            <div class="alerta-info">

                <h4>

                    ${operador.nombre}

                </h4>

                <p>

                    Ingresó a <strong>${operador.puntoNombre}</strong>

                </p>

                <small>

                    <i class="fa-regular fa-clock"></i>

                    ${operador.hora}

                </small>

            </div>

        </div>

    `;

});

}