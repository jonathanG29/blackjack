/**
 * Lee un valor guardado en localStorage
 * @param {String} clave
 * @param {*} valorPorDefecto se devuelve si no hay nada guardado o localStorage no está disponible
 * @returns {*} valor guardado
 */
export const leer = ( clave, valorPorDefecto ) => {
    try {
        const valor = localStorage.getItem( clave );
        return ( valor === null ) ? valorPorDefecto : JSON.parse( valor );
    } catch {
        return valorPorDefecto;
    }
}

/**
 * Guarda un valor en localStorage. Si no está disponible (modo privado, bloqueado) no hace nada
 * @param {String} clave
 * @param {*} valor
 */
export const guardar = ( clave, valor ) => {
    try {
        localStorage.setItem( clave, JSON.stringify( valor ) );
    } catch {
        // El juego funciona igual, solo que no se recuerda entre visitas
    }
}
