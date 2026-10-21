import {
  crearDeck,
  pedirCarta,
  calcularPuntos,
  jugarComputadora,
  determinarGanador,
  esBlackjack,
  crearCartaHTML,
} from "./usecases";
import { leer, guardar } from "./almacenamiento";

let deck = [];
const tipos = ["C", "D", "H", "S"];
const especiales = ["A", "J", "Q", "K"];

let puntosJugador = 0;
let manoJugador = [];
let manoComputadora = [];
let nombreJugador = "Jugador 1";

// Partidas ganadas, perdidas y empatadas, por ganador
let marcador = {
  jugador: 0,
  computadora: 0,
  empate: 0,
  ...leer("blackjack-marcador", {}),
};

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

const btnCambiarNombre = document.querySelector("#btnCambiarNombre");
const btnReiniciarMarcador = document.querySelector("#btnReiniciarMarcador");
const marcadorHTML = {
  jugador: document.querySelector("#ganadas"),
  computadora: document.querySelector("#perdidas"),
  empate: document.querySelector("#empates"),
};

// Carta de la computadora boca abajo hasta que el jugador se planta
let cartaOcultaHTML;

// Debe coincidir con la duración de las animaciones .carta en style.css
const DURACION_ANIMACION = 500;

// Cambia en cada partida para cortar la animación si se empieza un nuevo juego
let partida = 0;

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const crearResultado = (ganador, manoGanadora) => {
  const blackjack = esBlackjack(manoGanadora) ? "¡Blackjack! " : "";

  return {
    jugador: { mensaje: `${blackjack}${nombreJugador} gana`, tipo: "alert-success" },
    computadora: { mensaje: `${blackjack}Computadora gana`, tipo: "alert-danger" },
    empate: { mensaje: "Nadie gana :(", tipo: "alert-secondary" },
  }[ganador];
};

const pintarMarcador = () => {
  for (const ganador in marcadorHTML) {
    marcadorHTML[ganador].innerText = marcador[ganador];
  }
};

const darCartaJugador = () => {
  const carta = pedirCarta(deck);

  manoJugador.push(carta);
  puntosJugador = calcularPuntos(manoJugador);
  puntosJugadorHTML.innerText = puntosJugador;

  // <img class="carta" src="assets/cartas/2C.png">
  divCartasJugador.append(crearCartaHTML(carta));
};

const darCartaComputadora = (oculta = false) => {
  const carta = pedirCarta(deck);
  manoComputadora.push(carta);

  const cartaHTML = crearCartaHTML(carta, oculta);
  divCartasComputadora.append(cartaHTML);

  // Mientras la carta esté oculta, los puntos solo cuentan las cartas visibles
  if (oculta) {
    cartaOcultaHTML = cartaHTML;
  } else {
    puntosComputadoraHTML.innerText = calcularPuntos(manoComputadora);
  }
};

const terminarTurnoJugador = async () => {
  btnPedir.disabled = true;
  btnDetener.disabled = true;

  const partidaActual = partida;
  const { mano } = jugarComputadora(puntosJugador, deck, manoComputadora);

  // Volteamos la carta oculta
  const cartaVolteada = crearCartaHTML(manoComputadora[1]);
  cartaVolteada.classList.add("volteada");
  cartaOcultaHTML.replaceWith(cartaVolteada);
  puntosComputadoraHTML.innerText = calcularPuntos(manoComputadora);
  await esperar(DURACION_ANIMACION);

  // La computadora saca sus cartas nuevas una por una
  for (let i = manoComputadora.length; i < mano.length; i++) {
    if (partidaActual !== partida) return;

    divCartasComputadora.append(crearCartaHTML(mano[i]));
    puntosComputadoraHTML.innerText = calcularPuntos(mano.slice(0, i + 1));
    await esperar(DURACION_ANIMACION);
  }

  if (partidaActual !== partida) return;
  manoComputadora = mano;

  const ganador = determinarGanador(manoJugador, manoComputadora);
  const manoGanadora = ganador === "jugador" ? manoJugador : manoComputadora;
  const { mensaje, tipo } = crearResultado(ganador, manoGanadora);
  divResultado.innerText = mensaje;
  divResultado.classList.add(tipo);
  divResultado.hidden = false;

  marcador[ganador]++;
  guardar("blackjack-marcador", marcador);
  pintarMarcador();
};

const iniciarJuego = async () => {
  partida++;
  const partidaActual = partida;
  deck = crearDeck(tipos, especiales);

  puntosJugador = 0;
  manoJugador = [];
  manoComputadora = [];

  puntosJugadorHTML.innerText = 0;
  puntosComputadoraHTML.innerText = 0;

  divCartasComputadora.innerHTML = "";
  divCartasJugador.innerHTML = "";

  divResultado.hidden = true;
  divResultado.classList.remove("alert-success", "alert-danger", "alert-secondary");

  btnPedir.disabled = true;
  btnDetener.disabled = true;

  // Se reparte como en el casino, alternando y con la última carta de la computadora boca abajo
  const repartos = [
    () => darCartaJugador(),
    () => darCartaComputadora(),
    () => darCartaJugador(),
    () => darCartaComputadora(true),
  ];

  for (const repartir of repartos) {
    if (partidaActual !== partida) return;

    repartir();
    await esperar(DURACION_ANIMACION);
  }

  if (partidaActual !== partida) return;

  btnPedir.disabled = false;
  btnDetener.disabled = false;

  // Blackjack: con 21 en las dos primeras cartas no hace falta seguir
  if (puntosJugador === 21) {
    terminarTurnoJugador();
  }
};

pintarMarcador();

// Pedimos el nombre antes de empezar, con el último que se usó ya escrito
inputNombre.value = leer("blackjack-nombre", "");
modalNombre.showModal();

// Antes de la primera partida no se puede cerrar el modal con Escape
modalNombre.addEventListener("cancel", (event) => {
  if (partida === 0) event.preventDefault();
});

inputNombre.addEventListener("input", () => {
  // required acepta un nombre de solo espacios, así que lo validamos aparte
  inputNombre.setCustomValidity(
    inputNombre.value.trim() ? "" : "Escribe tu nombre"
  );
});

formNombre.addEventListener("submit", () => {
  nombreJugador = inputNombre.value.trim();
  nombreJugadorHTML.innerText = nombreJugador;
  guardar("blackjack-nombre", nombreJugador);

  // Al cambiar el nombre a mitad de partida no se reinicia el juego
  if (partida === 0) iniciarJuego();
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

btnCambiarNombre.addEventListener("click", () => {
  inputNombre.value = nombreJugador;
  modalNombre.showModal();
});

btnReiniciarMarcador.addEventListener("click", () => {
  marcador = { jugador: 0, computadora: 0, empate: 0 };
  guardar("blackjack-marcador", marcador);
  pintarMarcador();
});
