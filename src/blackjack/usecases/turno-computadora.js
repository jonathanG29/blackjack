import { pedirCarta } from './pedir-carta';
import { calcularPuntos } from './calcular-puntos';
import { crearCartaHTML } from './crear-carta-html';

/**
 * turno de la computadora
 * @param {Number} puntosMinimos puntos minimos que la computadora necesita para ganar
 * @param {HTMLElement} puntosHTML elemento HTML para mostrar los puntos 
 * @param {HTMLElement} divCartasComputadora elemento HTML para mostrar las cartas 
 * @param {Array<String>} deck
 * @returns {{ mensaje: String, tipo: String }} resultado de la partida, tipo es una clase de alert de Bootstrap
 */
export const turnoComputadora = ( puntosMinimos, puntosHTML, divCartasComputadora, deck = [] ) => {

    if ( puntosMinimos === undefined ) throw new Error('Puntos mínimos son necesarios');
    if ( !puntosHTML ) throw new Error('Argumento puntosHTML es necesario');

    let puntosComputadora = 0;
    const manoComputadora = [];

    do {
        const carta = pedirCarta( deck );

        manoComputadora.push( carta );
        puntosComputadora = calcularPuntos( manoComputadora );
        puntosHTML.innerText = puntosComputadora;
        
        const imgCarta = crearCartaHTML( carta );
        divCartasComputadora.append( imgCarta );

        if( puntosMinimos > 21 ) {
            break;
        }

    } while(  (puntosComputadora < puntosMinimos)  && (puntosMinimos <= 21 ) );

    if( puntosComputadora === puntosMinimos ) {
        return { mensaje: 'Nadie gana :(', tipo: 'alert-secondary' };
    } else if ( puntosMinimos > 21 ) {
        return { mensaje: 'Computadora gana', tipo: 'alert-danger' };
    } else if( puntosComputadora > 21 ) {
        return { mensaje: 'Jugador gana', tipo: 'alert-success' };
    } else {
        return { mensaje: 'Computadora gana', tipo: 'alert-danger' };
    }
}
