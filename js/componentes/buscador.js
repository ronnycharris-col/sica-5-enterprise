//====================================================
// RCH Systems
// COMPONENTE BUSCADOR
// Version 1.0
//====================================================

export function crearBuscador(config) {

    const input = document.getElementById(config.input);

    const lista = document.getElementById(config.lista);

    const hidden = document.getElementById(config.hidden);

    if (!input || !lista || !hidden) {

        console.error("Buscador: elementos no encontrados.");

        return;

    }

    input.addEventListener("input", () => {

        const texto = input.value
            .trim()
            .toLowerCase();

        lista.innerHTML = "";

        hidden.value = "";

        if (texto === "") {

            lista.style.display = "none";

            return;

        }

        const encontrados = config.datos.filter(item => {

            const textoPrincipal = String(
                item[config.campoTexto] || ""
            ).toLowerCase();

            const valor = String(
                item[config.campoValor] || ""
            ).toLowerCase();

            return (

                textoPrincipal.includes(texto) ||

                valor.includes(texto)

            );

        });
        //--------------------------------------------------
// SIN RESULTADOS
//--------------------------------------------------

if (encontrados.length === 0) {

    lista.style.display = "none";

    return;

}

//--------------------------------------------------
// CREAR LISTA
//--------------------------------------------------

encontrados
    .slice(0, 8)
    .forEach(item => {

        const opcion = document.createElement("div");

        opcion.className = "item-empleado";

        opcion.innerHTML = `

            <strong>${item[config.campoTexto]}</strong>

            <br>

            <small>${item[config.campoValor]}</small>

        `;

        opcion.addEventListener("click", () => {

            input.value = item[config.campoTexto];

            hidden.value = item[config.campoValor];

            lista.innerHTML = "";

            lista.style.display = "none";

            if (config.onSeleccionar) {

                config.onSeleccionar(item);

            }

        });

        lista.appendChild(opcion);

    });

lista.style.display = "block";
    });

    //--------------------------------------------------
    // CERRAR LISTA
    //--------------------------------------------------

    document.addEventListener("click", (e) => {

        if (

            !input.contains(e.target) &&

            !lista.contains(e.target)

        ) {

            lista.style.display = "none";

        }

    });
        //--------------------------------------------------
    // OCULTAR LISTA AL INICIAR
    //--------------------------------------------------

    lista.style.display = "none";

}