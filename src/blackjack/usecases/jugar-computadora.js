import { pedirCarta } from './pedir-carta';
import { calcularPuntos } from './calcular-puntos';

/**
 * La computadora pide cartas hasta igualar o superar los puntos del jugador
 * @param {Number} puntosMinimos puntos minimos que la computadora necesita para ganar
 * @param {Array<String>} deck se le sacan las cartas que pide la computadora
 * @returns {{ mano: Array<String>, puntos: Number }} cartas y puntos de la computadora
 */
export const jugarComputadora = ( puntosMinimos, deck ) => {

    if ( puntosMinimos === undefined ) throw new Error('Puntos mínimos son necesarios');

    const mano = [];
    let puntos = 0;

    // Si el jugador se pasó de 21, la computadora gana con una sola carta
    do {
        mano.push( pedirCarta( deck ) );
        puntos = calcularPuntos( mano );
    } while( puntosMinimos <= 21 && puntos < puntosMinimos );

    return { mano, puntos };
}
