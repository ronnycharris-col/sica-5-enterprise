/**
 * ==========================================================
 * SICA Enterprise 5.0
 * Motor de Liquidación V2
 * motor-liquidacion.js
 * ==========================================================
 */
import { esMinutoLaborado } from "./motor-jornada.js";
import { clasificarMinuto } from "./motor-clasificador.js";
import { obtenerConfiguracion } from "./motor-configuracion.js";

/**
 * Liquida una jornada recorriendo minuto a minuto.
 */
export function liquidarJornada({

    fechaEntrada,
    fechaSalida,
    festivos = [],
    configuracion = {}

}) {

    // Obtiene la configuración completa de la empresa
    const config = obtenerConfiguracion(configuracion);

    // Límite de minutos ordinarios efectivos
    const limiteOrdinarias =
        config.jornada.horasOrdinariasEfectivas * 60;

    const resultado = {

        ORDINARIA_DIURNA: 0,
        ORDINARIA_NOCTURNA: 0,

        EXTRA_DIURNA: 0,
        EXTRA_NOCTURNA: 0,

        ORDINARIA_DOMINICAL_DIURNA: 0,
        ORDINARIA_DOMINICAL_NOCTURNA: 0,

        EXTRA_DOMINICAL_DIURNA: 0,
        EXTRA_DOMINICAL_NOCTURNA: 0,

        ORDINARIA_FESTIVA_DIURNA: 0,
        ORDINARIA_FESTIVA_NOCTURNA: 0,

        EXTRA_FESTIVA_DIURNA: 0,
        EXTRA_FESTIVA_NOCTURNA: 0,

        minutosTrabajados: 0,
        minutosOrdinarios: 0,
        minutosExtras: 0

    };

    let minutosEfectivos = 0;

    const actual = new Date(fechaEntrada);

    while (actual < fechaSalida) {

    // ¿Este minuto cuenta como trabajo efectivo?
    if (!esMinutoLaborado(actual, config)) {

        actual.setMinutes(actual.getMinutes() + 1);
        continue;

    }

    // ¿Ya terminó las horas ordinarias?
    const esExtra = minutosEfectivos >= limiteOrdinarias;

    const info = clasificarMinuto({

        fechaHora: new Date(actual),
        festivos,
        configuracion: config,
        esExtra

    });

    if (resultado.hasOwnProperty(info.categoria)) {

        resultado[info.categoria]++;

    }

    resultado.minutosTrabajados++;

    if (esExtra) {

        resultado.minutosExtras++;

    } else {

        resultado.minutosOrdinarios++;

    }

    minutosEfectivos++;

    actual.setMinutes(actual.getMinutes() + 1);

}
console.log("=== RESULTADO MOTOR ===");
console.log(resultado);
console.log("Minutos efectivos:", minutosEfectivos);
console.log("Límite ordinarias:", limiteOrdinarias);
    return resultado;

}