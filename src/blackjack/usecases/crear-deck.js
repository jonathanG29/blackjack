/**
 * Mezcla un arreglo con el algoritmo Fisher-Yates
 * @param {Array<String>} arreglo arreglo a mezclar, se modifica en el lugar
 * @returns {Array<String>} el mismo arreglo mezclado
 */
const mezclar = ( arreglo ) => {

    for( let i = arreglo.length - 1; i > 0; i-- ) {
        const j = Math.floor( Math.random() * ( i + 1 ) );
        [ arreglo[i], arreglo[j] ] = [ arreglo[j], arreglo[i] ];
    }

    return arreglo;
}

/**
 * Esta función crea un nuevo deck
 * @param {Array<String>} tiposDeCarta Ejemplo: ['C','D','H','S']
 * @param {Array<String>} tiposEspeciales Ejemplo: ['A','J','Q','K']
 * @returns {Array<String>} retorna un nuevo deck de cartas
 */
export const crearDeck = (tiposDeCarta, tiposEspeciales) => {

    if ( !tiposDeCarta || tiposDeCarta.length === 0  ) 
        throw new Error('tiposDeCarta es obligatorio como un arreglo de string');
    
    if ( !tiposEspeciales || tiposEspeciales.length === 0  ) 
        throw new Error('tiposEspeciales es obligatorio como un arreglo de string');

    
    let deck = [];

    for( let i = 2; i <= 10; i++ ) {
        for( let tipo of tiposDeCarta ) {
            deck.push( i + tipo);
        }
    }

    for( let tipo of tiposDeCarta ) {
        for( let esp of tiposEspeciales ) {
            deck.push( esp + tipo);
        }
    }
    return mezclar( deck );
}
