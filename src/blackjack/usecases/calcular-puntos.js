import { valorCarta } from './valor-carta';

/**
 * Calcula los puntos de una mano, contando los ases como 1 u 11 según convenga
 * @param {Array<String>} mano cartas de la mano. Ejemplo: ['AS','KD']
 * @returns {Number} puntos de la mano
 */
export const calcularPuntos = ( mano ) => {

    let total = 0;
    let ases  = 0;

    for( const carta of mano ) {
        const valor = valorCarta( carta );
        total += valor;
        if ( valor === 11 ) ases++;
    }

    // Si nos pasamos de 21, cada As pasa de valer 11 a valer 1
    while ( total > 21 && ases > 0 ) {
        total -= 10;
        ases--;
    }

    return total;
}
