//====================================================
// SICA ENTERPRISE
// COMPONENTE BUSCADOR DE EMPLEADOS
//====================================================

export function iniciarBuscadorEmpleados(config) {

    const {
        empleados,
        input,
        lista,
        onSelect
    } = config;

    const txtBuscar = document.getElementById(input);
    const listaResultados = document.getElementById(lista);

    if (!txtBuscar || !listaResultados) {

        console.error("No se encontró el buscador.");

        return;

    }

    console.log("✅ Buscador de empleados iniciado");

    txtBuscar.addEventListener("keyup", () => {

        const texto = txtBuscar.value
            .toLowerCase()
            .trim();

        if (texto === "") {

            ocultarResultados(listaResultados);

            return;

        }

        const encontrados = filtrarEmpleados(empleados, texto);

        mostrarResultados(
            encontrados,
            txtBuscar,
            listaResultados,
            onSelect
        );

    });

}

//====================================================
// FILTRAR EMPLEADOS
//====================================================

function filtrarEmpleados(empleados, texto) {

    return empleados.filter((empleado) => {

        return (

            empleado.nombre.toLowerCase().includes(texto)

            ||

            empleado.documento.toString().includes(texto)

        );

    });

}

//====================================================
// MOSTRAR RESULTADOS
//====================================================

function mostrarResultados(
    encontrados,
    txtBuscar,
    listaResultados,
    onSelect
) {

    listaResultados.innerHTML = "";

    if (encontrados.length === 0) {

        ocultarResultados(listaResultados);

        return;

    }

    listaResultados.style.display = "block";

    encontrados.forEach((empleado) => {

        const item = document.createElement("div");

        item.className = "itemBuscador";

        item.innerHTML = `
            <strong>${empleado.nombre}</strong>
            <span>${empleado.documento}</span>
        `;

        item.addEventListener("click", () => {

            seleccionarEmpleado(
                empleado,
                txtBuscar,
                listaResultados,
                onSelect
            );

        });

        listaResultados.appendChild(item);

    });

}

//====================================================
// SELECCIONAR EMPLEADO
//====================================================

function seleccionarEmpleado(
    empleado,
    txtBuscar,
    listaResultados,
    onSelect
) {

    txtBuscar.value = empleado.nombre;

    ocultarResultados(listaResultados);

    onSelect(empleado);

}

//====================================================
// OCULTAR RESULTADOS
//====================================================

function ocultarResultados(listaResultados) {

    listaResultados.innerHTML = "";

    listaResultados.style.display = "none";

}