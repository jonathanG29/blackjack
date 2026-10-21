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
let manoComputadora = [];
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

// Carta de la computadora boca abajo hasta que el jugador se planta
let cartaOcultaHTML;

// Debe coincidir con la duración de la animación .carta en style.css
const DURACION_ANIMACION = 500;
let timeoutResultado;

const crearResultado = (ganador) =>
  ({
    jugador: { mensaje: `${nombreJugador} gana`, tipo: "alert-success" },
    computadora: { mensaje: "Computadora gana", tipo: "alert-danger" },
    empate: { mensaje: "Nadie gana :(", tipo: "alert-secondary" },
  })[ganador];

const darCartaJugador = () => {
  const carta = pedirCarta(deck);

  manoJugador.push(carta);
  puntosJugador = calcularPuntos(manoJugador);
  puntosJugadorHTML.innerText = puntosJugador;

  // <img class="carta" src="assets/cartas/2C.png">
  divCartasJugador.append(crearCartaHTML(carta));
};

const terminarTurnoJugador = () => {
  btnPedir.disabled = true;
  btnDetener.disabled = true;

  // Volteamos la carta oculta
  cartaOcultaHTML.replaceWith(crearCartaHTML(manoComputadora[1]));

  const { mano, puntos } = jugarComputadora(puntosJugador, deck, manoComputadora);

  // Solo pintamos las cartas nuevas, las dos primeras ya están en la mesa
  mano
    .slice(manoComputadora.length)
    .forEach((carta) => divCartasComputadora.append(crearCartaHTML(carta)));
  manoComputadora = mano;
  puntosComputadoraHTML.innerText = puntos;

  const { mensaje, tipo } = crearResultado(determinarGanador(puntosJugador, puntos));

  // Esperamos a que termine la animación de la última carta
  timeoutResultado = setTimeout(() => {
    divResultado.innerText = mensaje;
    divResultado.classList.add(tipo);
    divResultado.hidden = false;
  }, DURACION_ANIMACION);
};

const iniciarJuego = () => {
  deck = crearDeck(tipos, especiales);

  puntosJugador = 0;
  manoJugador = [];

  divCartasComputadora.innerHTML = "";
  divCartasJugador.innerHTML = "";

  clearTimeout(timeoutResultado);
  divResultado.hidden = true;
  divResultado.classList.remove("alert-success", "alert-danger", "alert-secondary");

  // Dos cartas para cada uno, la segunda de la computadora boca abajo
  darCartaJugador();
  darCartaJugador();

  manoComputadora = [pedirCarta(deck), pedirCarta(deck)];
  cartaOcultaHTML = crearCartaHTML(manoComputadora[1], true);
  divCartasComputadora.append(crearCartaHTML(manoComputadora[0]), cartaOcultaHTML);
  puntosComputadoraHTML.innerText = calcularPuntos([manoComputadora[0]]);

  btnPedir.disabled = false;
  btnDetener.disabled = false;

  // Blackjack: con 21 en las dos primeras cartas no hace falta seguir
  if (puntosJugador === 21) {
    terminarTurnoJugador();
  }
};

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
  iniciarJuego();
});

// Eventos
btnPedir.addEventListener("click", () => {
  darCartaJugador();

  if (puntosJugador >= 21) {
    terminarTurnoJugador();
  }
});

btnDetener.addEventListener("click", terminarTurnoJugador);

btnNuevo.addEventListener("click", iniciarJuego);
