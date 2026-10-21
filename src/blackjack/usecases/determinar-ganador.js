import { calcularPuntos } from './calcular-puntos';

/**
 * Indica si la mano es un blackjack: 21 con las dos primeras cartas
 * @param {Array<String>} mano
 * @returns {Boolean}
 */
export const esBlackjack = ( mano ) => mano.length === 2 && calcularPuntos( mano ) === 21;

/**
 * Decide quién gana la partida. El blackjack gana a cualquier otro 21
 * @param {Array<String>} manoJugador
 * @param {Array<String>} manoComputadora
 * @returns {'jugador' | 'computadora' | 'empate'} ganador de la partida
 */
export const determinarGanador = ( manoJugador, manoComputadora ) => {

    const puntosJugador     = calcularPuntos( manoJugador );
    const puntosComputadora = calcularPuntos( manoComputadora );

    if ( puntosJugador > 21 ) return 'computadora';
    if ( puntosComputadora > 21 ) return 'jugador';

    const blackjackJugador     = esBlackjack( manoJugador );
    const blackjackComputadora = esBlackjack( manoComputadora );

    if ( blackjackJugador && !blackjackComputadora ) return 'jugador';
    if ( blackjackComputadora && !blackjackJugador ) return 'computadora';

    if ( puntosJugador === puntosComputadora ) return 'empate';

    return ( puntosComputadora > puntosJugador ) ? 'computadora' : 'jugador';
}
