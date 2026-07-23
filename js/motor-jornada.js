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
export function esMinutoAlmuerzo(fechaHora, configuracion) {

    if (!tieneAlmuerzo(configuracion)) {
        return false;
    }

    const hora = fechaHora.getHours();

    // Temporal: almuerzo de 12:00 a 12:59
    return hora === 12;

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