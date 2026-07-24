/**
 * ==========================================================
 * SICA Enterprise 5.0
 * Motor de Jornada
 * ==========================================================
 */

/**
 * Determina si un empleado tiene derecho a almuerzo.
 */
export function tieneAlmuerzo(configuracion) {

    return configuracion?.almuerzo?.descontar === true;

}

/**
 * Determina si un minuto pertenece al almuerzo.
 *
 * Por ahora usa una hora fija.
 * Más adelante leeremos el horario desde la programación del turno.
 */
/**
 * Determina si un minuto pertenece al almuerzo.
 */
export function esMinutoAlmuerzo(fechaHora, configuracion) {

    if (!tieneAlmuerzo(configuracion)) {
        return false;
    }

    const hora = fechaHora.getHours();

    const inicio = configuracion.almuerzo.inicio;
    const fin = configuracion.almuerzo.fin;

    return hora >= inicio && hora < fin;

}

/**
 * Indica si este minuto debe contarse
 * como tiempo efectivo trabajado.
 */
export function esMinutoLaborado(fechaHora, configuracion) {

    if (esMinutoAlmuerzo(fechaHora, configuracion)) {
        return false;
    }

    return true;

}