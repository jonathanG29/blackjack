import {
  crearDeck,
  pedirCarta,
  calcularPuntos,
  jugarComputadora,
  determinarGanador,
  crearCartaHTML,
} from "./usecases";

let deck = [];
const tipos = ["C", "D", "H", "S"];
const especiales = ["A", "J", "Q", "K"];

let puntosJugador = 0;
let manoJugador = [];
let nombreJugador = "Jugador 1";

// Referencias del HTML
const btnPedir = document.querySelector("#btnPedir");
const btnDetener = document.querySelector("#btnDetener");
const btnNuevo = document.querySelector("#btnNuevo");

const divCartasJugador = document.querySelector("#jugador-cartas");
const divCartasComputadora = document.querySelector("#computadora-cartas");

const puntosJugadorHTML = document.querySelector("#puntos-jugador");
const puntosComputadoraHTML = document.querySelector("#puntos-computadora");
const divResultado = document.querySelector("#resultado");

const modalNombre = document.querySelector("#modal-nombre");
const formNombre = document.querySelector("#form-nombre");
const inputNombre = document.querySelector("#input-nombre");
const nombreJugadorHTML = document.querySelector("#nombre-jugador");

// Debe coincidir con la duración de la animación .carta en style.css
const DURACION_ANIMACION = 500;
let timeoutResultado;

const crearResultado = (ganador) =>
  ({
    jugador: { mensaje: `${nombreJugador} gana`, tipo: "alert-success" },
    computadora: { mensaje: "Computadora gana", tipo: "alert-danger" },
    empate: { mensaje: "Nadie gana :(", tipo: "alert-secondary" },
  })[ganador];

deck = crearDeck(tipos, especiales);

// Pedimos el nombre antes de empezar
modalNombre.showModal();

// Sin nombre no se puede cerrar el modal con Escape
modalNombre.addEventListener("cancel", (event) => event.preventDefault());

inputNombre.addEventListener("input", () => {
  // required acepta un nombre de solo espacios, así que lo validamos aparte
  inputNombre.setCustomValidity(
    inputNombre.value.trim() ? "" : "Escribe tu nombre"
  );
});

formNombre.addEventListener("submit", () => {
  nombreJugador = inputNombre.value.trim();
  nombreJugadorHTML.innerText = nombreJugador;
});

const terminarTurnoJugador = () => {
  btnPedir.disabled = true;
  btnDetener.disabled = true;

  const { mano, puntos } = jugarComputadora(puntosJugador, deck);

  mano.forEach((carta) => divCartasComputadora.append(crearCartaHTML(carta)));
  puntosComputadoraHTML.innerText = puntos;

  const { mensaje, tipo } = crearResultado(determinarGanador(puntosJugador, puntos));

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
  puntosJugadorHTML.innerText = puntosJugador;

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
  deck = crearDeck(tipos, especiales);

  puntosJugador = 0;
  manoJugador = [];

  puntosJugadorHTML.innerText = 0;
  puntosComputadoraHTML.innerText = 0;

  divCartasComputadora.innerHTML = "";
  divCartasJugador.innerHTML = "";

  clearTimeout(timeoutResultado);
  divResultado.hidden = true;
  divResultado.classList.remove("alert-success", "alert-danger", "alert-secondary");

  btnPedir.disabled = false;
  btnDetener.disabled = true;
});
