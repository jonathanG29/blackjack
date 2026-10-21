import { pedirCarta } from './pedir-carta';
import { calcularPuntos } from './calcular-puntos';

// Como en el casino, el crupier pide con 16 o menos y se planta con 17 o más
const PLANTARSE_EN = 17;

/**
 * La computadora juega como crupier: pide cartas hasta llegar a 17
 * @param {Number} puntosJugador puntos con los que se plantó el jugador
 * @param {Array<String>} deck se le sacan las cartas que pide la computadora
 * @param {Array<String>} manoInicial cartas que ya tiene la computadora, no se modifica
 * @returns {{ mano: Array<String>, puntos: Number }} cartas y puntos de la computadora
 */
export const jugarComputadora = ( puntosJugador, deck, manoInicial = [] ) => {

    if ( puntosJugador === undefined ) throw new Error('Los puntos del jugador son necesarios');

    const mano = [ ...manoInicial ];
    let puntos = calcularPuntos( mano );

    // Si el jugador se pasó de 21, la computadora ya ganó y no pide más
    while( puntosJugador <= 21 && puntos < PLANTARSE_EN ) {
        mano.push( pedirCarta( deck ) );
        puntos = calcularPuntos( mano );
    }

    return { mano, puntos };
}
