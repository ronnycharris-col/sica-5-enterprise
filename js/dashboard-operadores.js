//====================================================
// SICA 5.0
// OPERADORES ACTIVOS
//====================================================

//====================================================
// ACTUALIZAR PANEL
//====================================================

export function actualizarOperadores(registros){

    const contenedor = document.getElementById("operadoresActivos");

    if(!contenedor) return;

    contenedor.innerHTML = "";

    //------------------------------------------------
    // ORDENAR POR FECHA (MÁS RECIENTE PRIMERO)
    //------------------------------------------------

    registros.sort((a,b)=>{

        if(!a.fechaServidor || !b.fechaServidor){

            return 0;

        }

        return b.fechaServidor.seconds - a.fechaServidor.seconds;

    });

    //------------------------------------------------
    // ÚLTIMO REGISTRO POR OPERADOR
    //------------------------------------------------

    const operadores = new Map();

    registros.forEach((registro)=>{

        if(!operadores.has(registro.documento)){

            operadores.set(

                registro.documento,

                registro

            );

        }

    });

    //------------------------------------------------
    // MOSTRAR SOLO ACTIVOS
    //------------------------------------------------

    const activos = Array.from(

        operadores.values()

    ).filter((registro)=>

        registro.tipo === "Entrada"

    );

    //------------------------------------------------
    // TARJETAS
    //------------------------------------------------

    activos.forEach((registro)=>{

        crearTarjeta(

            contenedor,

            registro

        );

    });

}
//====================================================
// TARJETA
//====================================================

function crearTarjeta(

    contenedor,

    registro

){

    const tarjeta = document.createElement("div");

    tarjeta.className =

        "operador-card";

    //------------------------------------------------

    const inicial =

        registro.nombre

        ?

        registro.nombre.charAt(0)

        :

        "?";

    //------------------------------------------------

    tarjeta.innerHTML =

    `

    <div class="operador-info">

        <div class="operador-avatar">

            ${inicial}

        </div>

        <div class="operador-datos">

            <strong>

                ${registro.nombre}

            </strong>

            <span>

                ${registro.puntoNombre}

            </span>

        </div>

    </div>

    <span class="estado">

        ${registro.tipo}

    </span>

    `;

    //------------------------------------------------

    tarjeta.addEventListener(

        "click",

        ()=>{

            seleccionarOperador(

                registro

            );

        }

    );

    //------------------------------------------------

    contenedor.appendChild(

        tarjeta

    );

}

//====================================================
// SELECCIONAR
//====================================================

//====================================================
// SELECCIONAR OPERADOR
//====================================================

function seleccionarOperador(operador){

    console.log(

        "Operador seleccionado:",

        operador.nombre

    );

    //------------------------------------------------

    if(

        typeof window.mostrarOperadorMapa === "function"

    ){

        window.mostrarOperadorMapa(

            operador

        );

    }

}

