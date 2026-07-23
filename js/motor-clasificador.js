/**
 * ==========================================================
 * SICA Enterprise 5.0
 * Motor de Liquidación V2
 * motor-clasificador.js
 * ==========================================================
 */

/**
 * ¿Es domingo?
 */
export function esDomingo(fecha) {
    return fecha.getDay() === 0;
}

/**
 * ¿Es festivo?
 */
export function esFestivo(fecha, festivos = []) {

    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    const fechaTexto = `${año}-${mes}-${dia}`;

    return festivos.includes(fechaTexto);

}

/**
 * ¿Es jornada nocturna?
 */
export function esNocturno(fecha, configuracion) {

    const inicio = configuracion.nocturna.inicio;
    const fin = configuracion.nocturna.fin;

    const hora = fecha.getHours();

    return (hora >= inicio || hora < fin);

}

/**
 * Determina la categoría del minuto.
 */
export function obtenerCategoria({
    esExtra,
    esNocturno,
    esDomingo,
    esFestivo
}) {

    if (!esExtra) {

        if (esDomingo) {
            return esNocturno
                ? "ORDINARIA_DOMINICAL_NOCTURNA"
                : "ORDINARIA_DOMINICAL_DIURNA";
        }

        if (esFestivo) {
            return esNocturno
                ? "ORDINARIA_FESTIVA_NOCTURNA"
                : "ORDINARIA_FESTIVA_DIURNA";
        }

        return esNocturno
            ? "ORDINARIA_NOCTURNA"
            : "ORDINARIA_DIURNA";

    }

    // Horas Extras

    if (esDomingo) {
        return esNocturno
            ? "EXTRA_DOMINICAL_NOCTURNA"
            : "EXTRA_DOMINICAL_DIURNA";
    }

    if (esFestivo) {
        return esNocturno
            ? "EXTRA_FESTIVA_NOCTURNA"
            : "EXTRA_FESTIVA_DIURNA";
    }

    return esNocturno
        ? "EXTRA_NOCTURNA"
        : "EXTRA_DIURNA";

}

/**
 * Clasifica un minuto.
 */
export function clasificarMinuto({

    fechaHora,
    festivos = [],
    configuracion,
    esExtra

}) {

    const domingo = esDomingo(fechaHora);

    const festivo = esFestivo(fechaHora, festivos);

    const nocturno = esNocturno(fechaHora, configuracion);

    return {

        fechaHora,

        esDomingo: domingo,

        esFestivo: festivo,

        esNocturno: nocturno,

        esExtra,

        categoria: obtenerCategoria({
            esExtra,
            esNocturno: nocturno,
            esDomingo: domingo,
            esFestivo: festivo
        })

    };

}