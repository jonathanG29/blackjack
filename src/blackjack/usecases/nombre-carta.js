const VALORES = { A: 'As', J: 'Jota', Q: 'Reina', K: 'Rey' };
const PALOS = { C: 'tréboles', D: 'diamantes', H: 'corazones', S: 'picas' };

/**
 * Nombre legible de una carta, por ejemplo para el texto alternativo de su imagen
 * @param {String} carta Ejemplo: 'AS', '10H'
 * @returns {String} Ejemplo: 'As de picas', '10 de corazones'
 */
export const nombreCarta = ( carta ) => {

    const valor = carta.substring( 0, carta.length - 1 );
    const palo  = carta.at( -1 );

    return `${ VALORES[valor] ?? valor } de ${ PALOS[palo] }`;
}
