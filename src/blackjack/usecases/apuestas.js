/**
 * Fichas que recibe el jugador al terminar la partida, incluida su apuesta si la recupera.
 * Victoria paga 1:1, blackjack 3:2 y el empate devuelve la apuesta
 * @param {'jugador' | 'computadora' | 'empate'} ganador
 * @param {Number} apuesta fichas apostadas
 * @param {Boolean} blackjack si el jugador ganó con blackjack
 * @returns {Number} fichas que se suman al saldo
 */
export const calcularPago = ( ganador, apuesta, blackjack = false ) => {

    if ( ganador === 'empate' ) return apuesta;
    if ( ganador === 'computadora' ) return 0;

    // Con apuestas impares el 3:2 da medias fichas, que se redondean hacia abajo
    return blackjack
        ? apuesta + Math.floor( apuesta * 3 / 2 )
        : apuesta * 2;
}

/**
 * Solo se puede doblar con las dos primeras cartas y si alcanza el saldo para igualar la apuesta
 * @param {Array<String>} mano cartas del jugador
 * @param {Number} saldo fichas disponibles, sin contar la apuesta en juego
 * @param {Number} apuesta fichas apostadas
 * @returns {Boolean}
 */
export const puedeDoblar = ( mano, saldo, apuesta ) => mano.length === 2 && saldo >= apuesta;
