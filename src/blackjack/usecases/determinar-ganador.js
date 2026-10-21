/**
 * Decide quién gana la partida
 * @param {Number} puntosJugador
 * @param {Number} puntosComputadora
 * @returns {'jugador' | 'computadora' | 'empate'} ganador de la partida
 */
export const determinarGanador = ( puntosJugador, puntosComputadora ) => {

    if ( puntosJugador > 21 ) return 'computadora';
    if ( puntosComputadora > 21 ) return 'jugador';
    if ( puntosJugador === puntosComputadora ) return 'empate';

    return ( puntosComputadora > puntosJugador ) ? 'computadora' : 'jugador';
}
