
/**
 * 
 * @param {String} carta
 * @param {Boolean} oculta si es true se muestra el reverso de la carta
 * @returns {HTMLImageElement} imagen de retorno
 */
export const crearCartaHTML = ( carta, oculta = false ) => {

    if ( !carta ) throw new Error('La carta es un argumento obligatorio');

    // <img class="carta" src="assets/cartas/2C.png">
    const imgCarta = document.createElement('img');
    const imagen = oculta ? 'red_back' : carta; //3H, JD
    // BASE_URL permite publicar en una subruta, por ejemplo en GitHub Pages
    imgCarta.src = `${ import.meta.env.BASE_URL }assets/cartas/${ imagen }.png`;
    imgCarta.classList.add('carta');

    return imgCarta;
}