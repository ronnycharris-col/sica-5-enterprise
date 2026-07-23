/**
 * ==========================================================
 * SICA Enterprise 5.0
 * Motor de Liquidación Eventuales
 * ==========================================================
 */

export function liquidarEventual({

    fechaEntrada,
    fechaSalida,
    valorHora

}) {

    const minutos = Math.floor(
        (fechaSalida - fechaEntrada) / 60000
    );

    const horas = minutos / 60;

    return {

        minutosTrabajados: minutos,

        horasTrabajadas: horas,

        valorHora,

        totalPagar: horas * valorHora

    };

}