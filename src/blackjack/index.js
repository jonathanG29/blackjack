import {
  crearDeck,
  pedirCarta,
  calcularPuntos,
  turnoComputadora,
  crearCartaHTML,
} from "./usecases";


let deck = [];
const tipos = ["C", "D", "H", "S"];
const especiales = ["A", "J", "Q", "K"];

let puntosJugador = 0,
  puntosComputadora = 0;
let manoJugador = [];

// Referencias del HTML
const btnPedir = document.querySelector("#btnPedir");
const btnDetener = document.querySelector("#btnDetener");
const btnNuevo = document.querySelector("#btnNuevo");

const divCartasJugador = document.querySelector("#jugador-cartas");
const divCartasComputadora = document.querySelector("#computadora-cartas");

const puntosHTML = document.querySelectorAll("small");
const divResultado = document.querySelector("#resultado");

// Debe coincidir con la duración de la animación .carta en style.css
const DURACION_ANIMACION = 500;
let timeoutResultado;

deck = crearDeck(tipos, especiales);

const terminarTurnoJugador = () => {
  btnPedir.disabled = true;
  btnDetener.disabled = true;

  const { mensaje, tipo } = turnoComputadora(
    puntosJugador,
    puntosHTML[1],
    divCartasComputadora,
    deck
  );

  // Esperamos a que termine la animación de la última carta
  timeoutResultado = setTimeout(() => {
    divResultado.innerText = mensaje;
    divResultado.classList.add(tipo);
    divResultado.hidden = false;
  }, DURACION_ANIMACION);
};

// Eventos
btnPedir.addEventListener("click", () => {
  const carta = pedirCarta(deck);

  manoJugador.push(carta);
  puntosJugador = calcularPuntos(manoJugador);
  puntosHTML[0].innerText = puntosJugador;

  // <img class="carta" src="assets/cartas/2C.png">
  const imgCarta = crearCartaHTML(carta);
  divCartasJugador.append(imgCarta);

  if (puntosJugador >= 21) {
    terminarTurnoJugador();
  } else {
    // Solo se puede detener después de pedir al menos una carta
    btnDetener.disabled = false;
  }
});

btnDetener.addEventListener("click", terminarTurnoJugador);

btnNuevo.addEventListener("click", () => {
  console.clear();
  deck = [];
  deck = crearDeck(tipos, especiales);

  puntosJugador = 0;
  puntosComputadora = 0;
  manoJugador = [];

  puntosHTML[0].innerText = 0;
  puntosHTML[1].innerText = 0;

  divCartasComputadora.innerHTML = "";
  divCartasJugador.innerHTML = "";

  clearTimeout(timeoutResultado);
  divResultado.hidden = true;
  divResultado.classList.remove("alert-success", "alert-danger", "alert-secondary");

  btnPedir.disabled = false;
  btnDetener.disabled = true;
});
