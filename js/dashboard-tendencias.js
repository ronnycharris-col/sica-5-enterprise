//====================================================
// SICA 5.0 ENTERPRISE
// dashboard-tendencias.js
//====================================================

//====================================================
// VARIABLES
//====================================================

let graficaTendencias = null;

//====================================================
// INICIAR
//====================================================

export function iniciarTendencias(){

    console.log(

        "%cMódulo Tendencias iniciado",

        "color:#0EA5E9;font-weight:bold;"

    );

}

//====================================================
// ACTUALIZAR TENDENCIAS
//====================================================

export function actualizarTendencias(registros){

    if(!Array.isArray(registros)){

        return;

    }

    //--------------------------------------------------
    // CONTROLES
    //--------------------------------------------------

    const canvas = document.getElementById("graficaTendencias");

    if(!canvas){

        return;

    }

    const lblHoraPico = document.getElementById("lblHoraPico");

    const lblMovimientosHora = document.getElementById("lblMovimientosHora");

    //--------------------------------------------------
    // INICIALIZAR 24 HORAS
    //--------------------------------------------------

    const actividadHora = [];

    for(let hora=0; hora<24; hora++){

        actividadHora.push({

            hora,

            entradas:0,

            salidas:0

        });

    }

    //--------------------------------------------------
    // RECORRER REGISTROS
    //--------------------------------------------------

    registros.forEach((registro)=>{

        if(!registro.hora){

            return;

        }

        const hora = parseInt(

            registro.hora.split(":")[0]

        );

        if(isNaN(hora)){

            return;

        }

        if(registro.tipo==="Entrada"){

            actividadHora[hora].entradas++;

        }

        if(registro.tipo==="Salida"){

            actividadHora[hora].salidas++;

        }

    });

    //--------------------------------------------------
    // PREPARAR DATOS
    //--------------------------------------------------

    const etiquetas=[];

    const entradas=[];

    const salidas=[];

    let horaPico="--";

    let mayorMovimiento=0;

    actividadHora.forEach((item)=>{

        etiquetas.push(

            item.hora.toString().padStart(2,"0")+":00"

        );

        entradas.push(item.entradas);

        salidas.push(item.salidas);

        const total =

            item.entradas +

            item.salidas;

        if(total>mayorMovimiento){

            mayorMovimiento=total;

            horaPico=

                item.hora.toString().padStart(2,"0")+":00";

        }

    });

    //--------------------------------------------------
    // ACTUALIZAR INDICADORES
    //--------------------------------------------------

    if(lblHoraPico){

        lblHoraPico.textContent=horaPico;

    }

    if(lblMovimientosHora){

        lblMovimientosHora.textContent=mayorMovimiento;

    }
//--------------------------------------------------
// INDICADORES DEL DÍA
//--------------------------------------------------

const indHoraPico = document.getElementById("indHoraPico");

if(indHoraPico){

    indHoraPico.textContent = horaPico;

}
    //--------------------------------------------------
    // ELIMINAR GRÁFICA ANTERIOR
    //--------------------------------------------------

    if(graficaTendencias){

        graficaTendencias.destroy();

    }

    //--------------------------------------------------
    // CREAR GRÁFICA
    //--------------------------------------------------

    graficaTendencias = new Chart(canvas,{
                type:"line",

        data:{

            labels:etiquetas,

            datasets:[

                {

                    label:"Entradas",

                    data:entradas,

                    borderColor:"#22C55E",

                    backgroundColor:"rgba(34,197,94,0.15)",

                    borderWidth:3,

                    tension:0.35,

                    fill:true,

                    pointRadius:4,

                    pointHoverRadius:6

                },

                {

                    label:"Salidas",

                    data:salidas,

                    borderColor:"#EF4444",

                    backgroundColor:"rgba(239,68,68,0.15)",

                    borderWidth:3,

                    tension:0.35,

                    fill:true,

                    pointRadius:4,

                    pointHoverRadius:6

                }

            ]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            interaction:{

                mode:"index",

                intersect:false

            },

            animation:{

                duration:1000,

                easing:"easeOutQuart"

            },

            plugins:{

                legend:{

                    position:"top",

                    labels:{

                        usePointStyle:true,

                        pointStyle:"circle"

                    }

                },

                tooltip:{

                    backgroundColor:"#1E293B",

                    titleColor:"#FFFFFF",

                    bodyColor:"#FFFFFF",

                    cornerRadius:8,

                    padding:12

                }

            },

            scales:{

                x:{

                    grid:{

                        display:false

                    },

                    ticks:{

                        maxRotation:0,

                        autoSkip:true,

                        maxTicksLimit:12

                    }

                },

                y:{

                    beginAtZero:true,

                    ticks:{

                        precision:0,

                        stepSize:1

                    },

                    grid:{

                        color:"rgba(0,0,0,0.08)"

                    }

                }

            }

        }

    });

}