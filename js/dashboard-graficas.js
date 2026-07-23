//====================================================
// SICA 5.0 ENTERPRISE
// dashboard-graficas.js
//====================================================

//====================================================
// VARIABLES GLOBALES
//====================================================

let graficaPV = null;

//====================================================
// INICIAR GRÁFICAS
//====================================================

export function iniciarGraficas() {

    console.log(
        "%cDashboard de gráficas iniciado",
        "color:#1565C0;font-size:14px;font-weight:bold;"
    );

}

//====================================================
// ACTUALIZAR GRÁFICA
// ACTIVIDAD POR PUNTO DE VENTA
//====================================================

export function actualizarGraficaPuntos(

    registros,
    personalPresente

) {

    //--------------------------------------------------
    // VALIDACIONES
    //--------------------------------------------------

    if (!Array.isArray(registros)) {

        registros = [];

    }

    if (!Array.isArray(personalPresente)) {

        personalPresente = [];

    }

    //--------------------------------------------------
    // RESUMEN
    //--------------------------------------------------

    const resumen = {};
    //--------------------------------------------------
    // RECORRER REGISTROS
    //--------------------------------------------------

    registros.forEach((registro) => {

        const punto = registro.puntoNombre || "SIN PUNTO";

        if (!resumen[punto]) {

            resumen[punto] = {

                entradas: 0,
                salidas: 0,
                presentes: 0

            };

        }

        if (registro.tipo === "Entrada") {

            resumen[punto].entradas++;

        }

        if (registro.tipo === "Salida") {

            resumen[punto].salidas++;

        }

    });

    //--------------------------------------------------
    // PERSONAL PRESENTE
    //--------------------------------------------------

    personalPresente.forEach((registro) => {

        const punto = registro.puntoNombre || "SIN PUNTO";

        if (!resumen[punto]) {

            resumen[punto] = {

                entradas: 0,
                salidas: 0,
                presentes: 0

            };

        }

        resumen[punto].presentes++;

    });

    //--------------------------------------------------
    // TOP 10 POR ACTIVIDAD
    //--------------------------------------------------

    const ranking = Object.entries(resumen)

        .sort((a, b) => {

            const totalA =
                a[1].entradas +
                a[1].salidas +
                a[1].presentes;

            const totalB =
                b[1].entradas +
                b[1].salidas +
                b[1].presentes;

            return totalB - totalA;

        })

        .slice(0, 10);

    //--------------------------------------------------
    // PREPARAR DATOS
    //--------------------------------------------------

    const etiquetas = [];
    const datosEntradas = [];
    const datosSalidas = [];
    const datosPresentes = [];

    ranking.forEach(([punto, datos]) => {

        etiquetas.push(punto);

        datosEntradas.push(datos.entradas);

        datosSalidas.push(datos.salidas);

        datosPresentes.push(datos.presentes);

    });
    //--------------------------------------------------
    // OBTENER CANVAS
    //--------------------------------------------------

    const canvas = document.getElementById("graficaPV");

    if (!canvas) {

        console.warn("No existe el canvas graficaPV");

        return;

    }

    //--------------------------------------------------
    // DESTRUIR GRÁFICA ANTERIOR
    //--------------------------------------------------

    if (graficaPV) {

    graficaPV.data.labels = etiquetas;

    graficaPV.data.datasets[0].data = datosEntradas;
    graficaPV.data.datasets[1].data = datosSalidas;
    graficaPV.data.datasets[2].data = datosPresentes;

    graficaPV.update();

    return;

}

graficaPV = new Chart(canvas, {
        type: "bar",

        data: {

            labels: etiquetas,

            datasets: [

                {

                    label: "Entradas",

                    data: datosEntradas,

                    backgroundColor: "#22C55E",

                    borderColor: "#16A34A",

                    borderWidth: 1,

                    borderRadius: 12,

                    borderSkipped: false,

                    maxBarThickness: 38

                },

                {

                    label: "Salidas",

                    data: datosSalidas,

                    backgroundColor: "#EF4444",

                    borderColor: "#DC2626",

                    borderWidth: 1,

                    borderRadius: 12,

                    borderSkipped: false,

                    maxBarThickness: 38

                },

                {

                    label: "Presentes",

                    data: datosPresentes,

                    backgroundColor: "#F59E0B",

                    borderColor: "#D97706",

                    borderWidth: 1,

                    borderRadius: 12,

                    borderSkipped: false,

                    maxBarThickness: 38

                }

            ]

        },
                options: {

            responsive: true,

            maintainAspectRatio: false,

           animation: {

    duration: 300,

    easing: "easeOutQuart"

},
            interaction: {

                mode: "index",

                intersect: false

            },

            plugins: {

                legend: {

                    position: "top",

                    labels: {

                        usePointStyle: true,

                        pointStyle: "circle",

                        padding: 20,

                        font: {

                            size: 13,

                            weight: "bold"

                        }

                    }

                },

                tooltip: {

                    backgroundColor: "#1E293B",

                    titleColor: "#FFFFFF",

                    bodyColor: "#FFFFFF",

                    cornerRadius: 10,

                    padding: 12,

                    displayColors: true

                }

            },

            scales: {

                x: {

                    grid: {

                        display: false

                    },

                    ticks: {

                        maxRotation: 0,

                        minRotation: 0,

                        autoSkip: false,

                        font: {

                            size: 11

                        }

                    }

                },

                y: {

                    beginAtZero: true,

                    ticks: {

                        precision: 0,

                        stepSize: 1,

                        font: {

                            size: 11

                        }

                    },

                    grid: {

                        color: "rgba(0,0,0,0.08)"

                    }

                }

            }

        }
    });

}