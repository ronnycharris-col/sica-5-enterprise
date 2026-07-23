/**
 * ==========================================================
 * SICA Enterprise 5.0
 * Motor de Liquidación V2
 * motor-configuracion.js
 * ==========================================================
 */

/**
 * Configuración por defecto.
 * Se utiliza cuando aún no existe configuración en Firebase.
 */
export const CONFIGURACION_DEFECTO = {

    empresa: "",

    jornada: {
    horasProgramadas: 8,
    horasOrdinariasEfectivas: 7,
    horasSemana: 46
},

    nocturna: {
        inicio: 21,
        fin: 6
    },

    almuerzo: {
        descontar: true,
        minutos: 60
    },

    extras: {
        habilitadas: true,
        calcularAutomaticamente: true
    },

    dominicales: {
        habilitado: true
    },

    festivos: {
        habilitado: true
    },

    precision: {
        unidad: "MINUTO"
    }

};

/**
 * Combina la configuración guardada en Firebase
 * con la configuración por defecto.
 */
export function obtenerConfiguracion(configFirebase = {}) {

    return {

        ...CONFIGURACION_DEFECTO,

        ...configFirebase,

        jornada: {
            ...CONFIGURACION_DEFECTO.jornada,
            ...(configFirebase.jornada || {})
        },

        nocturna: {
            ...CONFIGURACION_DEFECTO.nocturna,
            ...(configFirebase.nocturna || {})
        },

        almuerzo: {
            ...CONFIGURACION_DEFECTO.almuerzo,
            ...(configFirebase.almuerzo || {})
        },

        extras: {
            ...CONFIGURACION_DEFECTO.extras,
            ...(configFirebase.extras || {})
        },

        dominicales: {
            ...CONFIGURACION_DEFECTO.dominicales,
            ...(configFirebase.dominicales || {})
        },

        festivos: {
            ...CONFIGURACION_DEFECTO.festivos,
            ...(configFirebase.festivos || {})
        },

        precision: {
            ...CONFIGURACION_DEFECTO.precision,
            ...(configFirebase.precision || {})
        }

    };

}