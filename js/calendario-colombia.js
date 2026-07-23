//====================================================
// SICA Enterprise
// Calendario Corporativo Colombia
// calendario-colombia.js
//====================================================

//====================================================
// OBTENER FECHA DE PASCUA
// (Algoritmo de Meeus)
//====================================================

function obtenerPascua(anio) {

    const a = anio % 19;
    const b = Math.floor(anio / 100);
    const c = anio % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);

    const mes = Math.floor((h + l - 7 * m + 114) / 31);
    const dia = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(anio, mes - 1, dia);

}

//====================================================
// MOVER AL LUNES (LEY EMILIANI)
//====================================================

function moverAlLunes(fecha) {

    const nueva = new Date(fecha);

    while (nueva.getDay() !== 1) {

        nueva.setDate(nueva.getDate() + 1);

    }

    return nueva;

}

//====================================================
// FORMATO YYYY-MM-DD
//====================================================

function formatearFecha(fecha) {

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;

}
//====================================================
// GENERAR FESTIVOS DE COLOMBIA
//====================================================

export function obtenerFestivos(anio) {

    const festivos = [];

    //==========================================
    // AGREGAR FESTIVO
    //==========================================

    function agregar(fecha, nombre) {

        festivos.push({

            fecha: formatearFecha(fecha),
            nombre

        });

    }

    //==========================================
    // FESTIVOS FIJOS
    //==========================================

    agregar(new Date(anio, 0, 1), "Año Nuevo");
    agregar(new Date(anio, 4, 1), "Día del Trabajo");
    agregar(new Date(anio, 6, 20), "Independencia");
    agregar(new Date(anio, 7, 7), "Batalla de Boyacá");
    agregar(new Date(anio, 11, 8), "Inmaculada Concepción");
    agregar(new Date(anio, 11, 25), "Navidad");

    //==========================================
    // NUEVO FESTIVO NACIONAL
    // (Ajustaremos la fecha exacta en la
    // siguiente etapa)
    //==========================================

    // agregar(new Date(anio, ?, ?), "Nuestra Señora del Rosario de Chiquinquirá");
    //==========================================
    // FESTIVOS LEY EMILIANI
    //==========================================

    agregar(
        moverAlLunes(new Date(anio, 0, 6)),
        "Reyes Magos"
    );

    agregar(
        moverAlLunes(new Date(anio, 2, 19)),
        "San José"
    );

    agregar(
        moverAlLunes(new Date(anio, 5, 29)),
        "San Pedro y San Pablo"
    );

    agregar(
        moverAlLunes(new Date(anio, 7, 15)),
        "La Asunción de la Virgen"
    );

    agregar(
        moverAlLunes(new Date(anio, 9, 12)),
        "Día de la Raza"
    );

    agregar(
        moverAlLunes(new Date(anio, 10, 1)),
        "Todos los Santos"
    );

    agregar(
        moverAlLunes(new Date(anio, 10, 11)),
        "Independencia de Cartagena"
    );
        //==========================================
    // FESTIVOS RELIGIOSOS
    //==========================================

    const pascua = obtenerPascua(anio);

    function sumarDias(fecha, dias) {

        const nueva = new Date(fecha);

        nueva.setDate(nueva.getDate() + dias);

        return nueva;

    }

    // Jueves Santo
    agregar(
        sumarDias(pascua, -3),
        "Jueves Santo"
    );

    // Viernes Santo
    agregar(
        sumarDias(pascua, -2),
        "Viernes Santo"
    );

    // Ascensión del Señor
    agregar(
        moverAlLunes(sumarDias(pascua, 43)),
        "Ascensión del Señor"
    );

    // Corpus Christi
    agregar(
        moverAlLunes(sumarDias(pascua, 64)),
        "Corpus Christi"
    );

    // Sagrado Corazón
    agregar(
        moverAlLunes(sumarDias(pascua, 71)),
        "Sagrado Corazón"
    );
        //==========================================
    // ORDENAR POR FECHA
    //==========================================

    festivos.sort(

        (a, b) =>

            a.fecha.localeCompare(b.fecha)

    );
    return festivos;

}
//====================================================
// ¿ES DOMINGO?
//====================================================

export function esDomingo(fecha) {

    const f = new Date(fecha);

    return f.getDay() === 0;

}

//====================================================
// ¿ES FESTIVO?
//====================================================

export function esFestivo(fecha) {

    const anio = new Date(fecha).getFullYear();

    const fechaTexto = formatearFecha(new Date(fecha));

    return obtenerFestivos(anio).some(

        f => f.fecha === fechaTexto

    );

}

//====================================================
// TIPO DE DÍA
//====================================================

export function tipoDia(fecha) {

    const domingo = esDomingo(fecha);
    const festivo = esFestivo(fecha);

    if (domingo && festivo) {

        return "DOMINGO_FESTIVO";

    }

    if (festivo) {

        return "FESTIVO";

    }

    if (domingo) {

        return "DOMINGO";

    }

    return "ORDINARIO";

}