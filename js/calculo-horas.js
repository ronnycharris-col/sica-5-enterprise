//====================================================
// SICA Enterprise 5.0
// Módulo de Liquidación
// calculo-horas.js
//====================================================

import { obtenerFestivos } from "./calendario-colombia.js";
import { liquidarJornada } from "./motor-liquidacion.js";
import { obtenerConfiguracion } from "./motor-configuracion.js";

///====================================================
// CONVERTIR HORA (12 HORAS) A HORAS, MINUTOS Y SEGUNDOS
//====================================================
function convertirHora(horaTexto) {

    if (!horaTexto) {
        return {
            horas: 0,
            minutos: 0,
            segundos: 0
        };
    }

    let hora = horaTexto.trim();

    const esPM = hora.toLowerCase().includes("p.");

    hora = hora
        .replace("a. m.", "")
        .replace("p. m.", "")
        .trim();

    const partes = hora.split(":");

    let horas = parseInt(partes[0], 10);
    const minutos = parseInt(partes[1], 10);
    const segundos = partes.length >= 3
        ? parseInt(partes[2], 10)
        : 0;

    if (esPM && horas !== 12) {
        horas += 12;
    }

    if (!esPM && horas === 12) {
        horas = 0;
    }

    return {
        horas,
        minutos,
        segundos
    };

}

//====================================================
// CONVERTIR MINUTOS A FORMATO HH:MM
//====================================================
function convertirMinutosAHoras(minutos) {

    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;

    return `${horas}:${String(mins).padStart(2, "0")}`;

}

//====================================================
// FUNCIÓN PRINCIPAL
//====================================================
export function calcularHoras(registros) {

    //==========================================
    // ORDENAR REGISTROS POR FECHA
    //==========================================

    registros.sort(
        (a, b) => a.fechaServidor.seconds - b.fechaServidor.seconds
    );

    //==========================================
    // RESULTADO FINAL
    //==========================================

    const resultado = [];
        //==========================================
    // RECORRER REGISTROS (ENTRADA / SALIDA)
    //==========================================

    for (let i = 0; i < registros.length; i += 2) {

        const entrada = registros[i];
        const salida = registros[i + 1];
console.table([
    {
        tipo: entrada?.tipo,
        fecha: entrada?.fecha,
        hora: entrada?.hora,
        documento: entrada?.documento
    },
    {
        tipo: salida?.tipo,
        fecha: salida?.fecha,
        hora: salida?.hora,
        documento: salida?.documento
    }
]);
        //==========================================
        // VALIDACIONES BÁSICAS
        //==========================================

        if (!entrada) {
            continue;
        }

        if (!salida) {
            console.warn(`El empleado ${entrada.nombre} no tiene registro de salida.`);
            continue;
        }

        if (!entrada.fecha) {
            console.warn("Registro sin fecha:", entrada);
            continue;
        }

        if (!entrada.hora || !salida.hora) {
            console.warn("Registro con hora incompleta:", {
                entrada,
                salida
            });
            continue;
        }

        //==========================================
// CONVERTIR HORAS
//==========================================

const horaEntrada = convertirHora(entrada.hora);
const horaSalida = convertirHora(salida.hora);
console.table([
    {
        tipo: entrada.tipo,
        fecha: entrada.fecha,
        hora: entrada.hora
    },
    {
        tipo: salida.tipo,
        fecha: salida.fecha,
        hora: salida.hora
    }
]);
//==========================================
// CREAR FECHAS COMPLETAS
//==========================================

const [dia, mes, anio] = entrada.fecha.split("/").map(Number);

const fechaEntrada = new Date(
    anio,
    mes - 1,
    dia,
    horaEntrada.horas,
    horaEntrada.minutos,
    horaEntrada.segundos
);

const fechaSalida = new Date(
    anio,
    mes - 1,
    dia,
    horaSalida.horas,
    horaSalida.minutos,
    horaSalida.segundos
);

        //==========================================
        // JORNADA QUE TERMINA AL DÍA SIGUIENTE
        //==========================================

        if (fechaSalida <= fechaEntrada) {
            fechaSalida.setDate(fechaSalida.getDate() + 1);
        }

        //==========================================
        // VALIDAR DURACIÓN DE LA JORNADA
        //==========================================

        const minutosTrabajados =
            (fechaSalida - fechaEntrada) / 60000;
console.log("========== JORNADA ==========");
console.log({
    empleado: entrada.nombre,
    fecha: entrada.fecha,
    entrada: entrada.hora,
    salida: salida.hora,
    tipoEntrada: entrada.tipo,
    tipoSalida: salida.tipo,
    minutosTrabajados
});
       

        if (minutosTrabajados > (16 * 60)) {
            console.warn(
                `Registro inválido: duración superior a 16 horas. Empleado: ${entrada.nombre}`
            );
            continue;
        }

        //==========================================
        // CONFIGURACIÓN Y FESTIVOS
        //==========================================

        const configuracion = obtenerConfiguracion();
        const festivos = obtenerFestivos(fechaEntrada.getFullYear());

        //==========================================
        // LIQUIDAR JORNADA
        //==========================================

        const liquidacion = liquidarJornada({
            fechaEntrada,
            fechaSalida,
            festivos,
            configuracion
        });

        //==========================================
        // TOTALES DE HORAS EXTRAS
        //==========================================

        const extraDiurnaTotal =
            liquidacion.EXTRA_DIURNA +
            liquidacion.EXTRA_DOMINICAL_DIURNA +
            liquidacion.EXTRA_FESTIVA_DIURNA;

        const extraNocturnaTotal =
            liquidacion.EXTRA_NOCTURNA +
            liquidacion.EXTRA_DOMINICAL_NOCTURNA +
            liquidacion.EXTRA_FESTIVA_NOCTURNA;
                    //==========================================
        // GUARDAR RESULTADO
        //==========================================

        resultado.push({

            empleado: entrada.nombre,

            fecha: entrada.fecha,

            entrada: entrada.hora,

            salida: salida.hora,

            ordinariaDiurna:
                convertirMinutosAHoras(
                    liquidacion.ORDINARIA_DIURNA
                ),

            ordinariaNocturna:
                convertirMinutosAHoras(
                    liquidacion.ORDINARIA_NOCTURNA
                ),

            dominicalDiurna:
                convertirMinutosAHoras(
                    liquidacion.ORDINARIA_DOMINICAL_DIURNA
                ),

            dominicalNocturna:
                convertirMinutosAHoras(
                    liquidacion.ORDINARIA_DOMINICAL_NOCTURNA
                ),

            festivaDiurna:
                convertirMinutosAHoras(
                    liquidacion.ORDINARIA_FESTIVA_DIURNA
                ),

            festivaNocturna:
                convertirMinutosAHoras(
                    liquidacion.ORDINARIA_FESTIVA_NOCTURNA
                ),

            //======================================
            // HORAS EXTRAS TOTALES
            //======================================

            extraDiurna:
                convertirMinutosAHoras(
                    extraDiurnaTotal
                ),

            extraNocturna:
                convertirMinutosAHoras(
                    extraNocturnaTotal
                ),

            //======================================
            // DETALLE DE EXTRAS
            //======================================

            extraDominicalDiurna:
                convertirMinutosAHoras(
                    liquidacion.EXTRA_DOMINICAL_DIURNA
                ),

            extraDominicalNocturna:
                convertirMinutosAHoras(
                    liquidacion.EXTRA_DOMINICAL_NOCTURNA
                ),

            extraFestivaDiurna:
                convertirMinutosAHoras(
                    liquidacion.EXTRA_FESTIVA_DIURNA
                ),

            extraFestivaNocturna:
                convertirMinutosAHoras(
                    liquidacion.EXTRA_FESTIVA_NOCTURNA
                ),

            //======================================
            // TOTAL LABORADO
            //======================================

            total:
                convertirMinutosAHoras(
                    liquidacion.minutosTrabajados
                )

        });
            }

    //==========================================
    // RETORNAR RESULTADO
    //==========================================

    return resultado;

}