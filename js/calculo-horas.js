//====================================================
// SICA Enterprise
// calculo-horas.js
//====================================================
//====================================================
// CONVERTIR HORA A MINUTOS
//====================================================

function convertirHoraAMinutos(horaTexto) {

    if (!horaTexto) return 0;

    let hora = horaTexto.trim();

    const esPM = hora.toLowerCase().includes("p.");

    hora = hora
        .replace("a. m.", "")
        .replace("p. m.", "")
        .trim();

    const partes = hora.split(":");

    let horas = parseInt(partes[0]);

    const minutos = parseInt(partes[1]);

    if (esPM && horas !== 12) horas += 12;

    if (!esPM && horas === 12) horas = 0;

    return (horas * 60) + minutos;

}
export function calcularHoras(registros) {
//====================================================
// CONVERTIR MINUTOS A HORAS
//====================================================

function convertirMinutosAHoras(minutos) {

    const horas = Math.floor(minutos / 60);

    const mins = minutos % 60;

    return `${horas}:${String(mins).padStart(2, "0")}`;

}
    //==========================================
    // ORDENAR POR FECHA
    //==========================================

    registros.sort(

        (a, b) =>

            a.fechaServidor.seconds -

            b.fechaServidor.seconds

    );

    //==========================================
    // RESULTADO
    //==========================================

    const resultado = [];

    //==========================================
    // RECORRER REGISTROS
    //==========================================

   for (let i = 0; i < registros.length; i += 2) {

    const entrada = registros[i];

const salida = registros[i + 1];

if (!entrada) continue;

const minutosEntrada = convertirHoraAMinutos(entrada.hora);

const minutosSalida = convertirHoraAMinutos(salida?.hora);

console.log("Entrada:", minutosEntrada);

console.log("Salida:", minutosSalida);

//==========================================
// CALCULAR MINUTOS TRABAJADOS
//==========================================

let minutosTrabajados = minutosSalida - minutosEntrada;

//==========================================
// DESCONTAR ALMUERZO
//==========================================

const INICIO_ALMUERZO = 13 * 60; // 780

const FIN_ALMUERZO = 14 * 60;    // 840

if (

    minutosEntrada <= INICIO_ALMUERZO &&

    minutosSalida >= FIN_ALMUERZO

) {

    minutosTrabajados -= 60;

}
//==========================================
// HORAS ORDINARIAS
//==========================================

const minutosOrdinarios = Math.min(

    minutosTrabajados,

    420

);

//==========================================
// MINUTOS EXTRAS
//==========================================

const minutosExtras = Math.max(

    minutosTrabajados - 420,

    0

);
//==========================================
// CALCULAR EXTRAS
//==========================================

let extraDiurna = 0;

let extraNocturna = 0;

// Hora en que terminan las 7 horas ordinarias
let inicioExtras = minutosEntrada + minutosOrdinarios;

// Si hubo almuerzo, las extras empiezan una hora después
if (

    minutosEntrada <= 780 &&

    minutosSalida >= 840

) {

    inicioExtras += 60;

}

// 19:00
const LIMITE_NOCTURNO = 19 * 60;

if (inicioExtras < minutosSalida) {

    if (inicioExtras < LIMITE_NOCTURNO) {

        extraDiurna = Math.min(

            minutosSalida,

            LIMITE_NOCTURNO

        ) - inicioExtras;

    }

    if (minutosSalida > LIMITE_NOCTURNO) {

        extraNocturna =

            minutosSalida -

            Math.max(

                inicioExtras,

                LIMITE_NOCTURNO

            );

    }

}
//==========================================
// GUARDAR RESULTADO
//==========================================

resultado.push({

    empleado: entrada.nombre,

    fecha: entrada.fecha,

    entrada: entrada.hora,

    salida: salida ? salida.hora : "",

    ordinarias: convertirMinutosAHoras(minutosOrdinarios),

    extraDiurna: convertirMinutosAHoras(extraDiurna),

    extraNocturna: convertirMinutosAHoras(extraNocturna),

    total: convertirMinutosAHoras(minutosTrabajados)

});

}

console.table(resultado);

return resultado;

}