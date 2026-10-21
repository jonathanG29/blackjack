import { pedirCarta } from './pedir-carta';
import { calcularPuntos } from './calcular-puntos';

/**
 * La computadora pide cartas hasta igualar o superar los puntos del jugador
 * @param {Number} puntosMinimos puntos minimos que la computadora necesita para ganar
 * @param {Array<String>} deck se le sacan las cartas que pide la computadora
 * @param {Array<String>} manoInicial cartas que ya tiene la computadora, no se modifica
 * @returns {{ mano: Array<String>, puntos: Number }} cartas y puntos de la computadora
 */
export const jugarComputadora = ( puntosMinimos, deck, manoInicial = [] ) => {

    if ( puntosMinimos === undefined ) throw new Error('Puntos mínimos son necesarios');

    const mano = [ ...manoInicial ];
    let puntos = calcularPuntos( mano );

    // Si el jugador se pasó de 21, la computadora ya ganó y no pide más
    while( puntosMinimos <= 21 && puntos < puntosMinimos ) {
        mano.push( pedirCarta( deck ) );
        puntos = calcularPuntos( mano );
    }

    return { mano, puntos };
}
