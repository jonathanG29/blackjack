import {
  crearDeck,
  pedirCarta,
  calcularPuntos,
  jugarComputadora,
  determinarGanador,
  esBlackjack,
  calcularPago,
  puedeDoblar,
  crearCartaHTML,
} from "./usecases";
import { leer, guardar } from "./almacenamiento";

let deck = [];
const tipos = ["C", "D", "H", "S"];
const especiales = ["A", "J", "Q", "K"];

const SALDO_INICIAL = 1000;

let puntosJugador = 0;
let manoJugador = [];
let manoComputadora = [];
let nombreJugador = "Jugador 1";
let nombreConfirmado = false;

// Fichas disponibles. Durante la partida no incluye la apuesta en juego
const saldoGuardado = leer("blackjack-saldo", SALDO_INICIAL);
let saldo = Number.isFinite(saldoGuardado) ? saldoGuardado : SALDO_INICIAL;
let apuesta = 0;
// Apuesta elegida antes de repartir, se repite en la siguiente partida aunque se doble
let apuestaBase = 0;

// Partidas ganadas, perdidas y empatadas, por ganador
let marcador = {
  jugador: 0,
  computadora: 0,
  empate: 0,
  ...leer("blackjack-marcador", {}),
};

// Referencias del HTML
const panelApuesta = document.querySelector("#panel-apuesta");
const botonesFicha = document.querySelectorAll(".ficha");
const btnLimpiarApuesta = document.querySelector("#btnLimpiarApuesta");
const btnRepartir = document.querySelector("#btnRepartir");
const btnRecargar = document.querySelector("#btnRecargar");

const panelJuego = document.querySelector("#panel-juego");
const btnPedir = document.querySelector("#btnPedir");
const btnDoblar = document.querySelector("#btnDoblar");
const btnDetener = document.querySelector("#btnDetener");

const saldoHTML = document.querySelector("#saldo");
const circuloApuesta = document.querySelector("#circulo-apuesta");
const pista = document.querySelector("#pista");

const divCartasJugador = document.querySelector("#jugador-cartas");
const divCartasComputadora = document.querySelector("#computadora-cartas");

const puntosJugadorHTML = document.querySelector("#puntos-jugador");
const puntosComputadoraHTML = document.querySelector("#puntos-computadora");
const divResultado = document.querySelector("#resultado");
const resultadoTitulo = document.querySelector("#resultado-titulo");
const resultadoDetalle = document.querySelector("#resultado-detalle");

const modalNombre = document.querySelector("#modal-nombre");
const formNombre = document.querySelector("#form-nombre");
const inputNombre = document.querySelector("#input-nombre");
// El nombre aparece en la barra superior y junto a la mano del jugador
const nombresJugadorHTML = document.querySelectorAll(".nombre-jugador");

const btnMenu = document.querySelector("#btnMenu");
const menuOpciones = document.querySelector("#menu-opciones");
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

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const crearResultado = (ganador, fichasGanadas) => {
  const fichas = fichasGanadas > 0 ? `+${fichasGanadas} fichas` : `−${-fichasGanadas} fichas`;

  if (ganador === "empate") {
    return { titulo: "Empate", detalle: "Recuperas tu apuesta", tipo: "empate" };
  }

  if (ganador === "jugador") {
    return esBlackjack(manoJugador)
      ? { titulo: "¡Blackjack!", detalle: `${nombreJugador} gana ${fichas}`, tipo: "gana" }
      : { titulo: `${nombreJugador} gana`, detalle: fichas, tipo: "gana" };
  }

  let titulo = "Gana el crupier";
  if (puntosJugador > 21) titulo = "Te pasaste";
  else if (esBlackjack(manoComputadora)) titulo = "Blackjack del crupier";

  return { titulo, detalle: fichas, tipo: "pierde" };
};

// Etiqueta de puntos junto a cada mano: roja si se pasa de 21, dorada con blackjack
const pintarPuntos = (elemento, mano) => {
  const puntos = calcularPuntos(mano);

  elemento.innerText = puntos;
  elemento.hidden = mano.length === 0;
  elemento.classList.toggle("pasado", puntos > 21);
  elemento.classList.toggle("blackjack", esBlackjack(mano));
};

// Las fichas de la apuesta se apilan en el círculo del paño, de mayor a menor valor
const pintarApuesta = () => {
  if (apuesta === 0) {
    circuloApuesta.innerHTML = '<span class="vacio">Apuesta</span>';
    return;
  }

  const fichas = [];
  let resto = apuesta;
  for (const valor of [100, 50, 25, 10]) {
    while (resto >= valor && fichas.length < 6) {
      fichas.push(valor);
      resto -= valor;
    }
  }

  circuloApuesta.innerHTML = `
    <div class="pila">
      ${fichas.map((valor, i) => `<span class="ficha f${valor}" style="top: ${-i * 5}px">${valor}</span>`).join("")}
    </div>
    <span class="monto">${apuesta} fichas</span>`;
};

const pintarMarcador = () => {
  for (const ganador in marcadorHTML) {
    marcadorHTML[ganador].innerText = marcador[ganador];
  }
};

const pintarFichas = () => {
  saldoHTML.innerText = saldo;
  pintarApuesta();

  // Con la mesa vacía se indica cómo empezar
  pista.hidden = !(manoJugador.length === 0 && apuesta === 0 && !panelApuesta.hidden);

  // No se puede apostar más de lo que hay en el saldo
  botonesFicha.forEach((boton) => {
    boton.disabled = Number(boton.dataset.valor) > saldo - apuesta;
  });
  btnLimpiarApuesta.disabled = apuesta === 0;
  btnRepartir.disabled = apuesta === 0;
  btnRecargar.hidden = saldo > 0;
};

const guardarSaldo = () => {
  guardar("blackjack-saldo", saldo);
  pintarFichas();
};

const prepararApuesta = () => {
  // Se repite la apuesta anterior si el saldo alcanza
  apuesta = apuestaBase <= saldo ? apuestaBase : 0;

  panelJuego.hidden = true;
  panelApuesta.hidden = false;
  pintarFichas();
};

const darCartaJugador = () => {
  const carta = pedirCarta(deck);

  manoJugador.push(carta);
  puntosJugador = calcularPuntos(manoJugador);
  pintarPuntos(puntosJugadorHTML, manoJugador);

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
    pintarPuntos(puntosComputadoraHTML, manoComputadora);
  }
};

const terminarTurnoJugador = async () => {
  btnPedir.disabled = true;
  btnDoblar.disabled = true;
  btnDetener.disabled = true;

  const { mano } = jugarComputadora(puntosJugador, deck, manoComputadora);

  // Volteamos la carta oculta
  const cartaVolteada = crearCartaHTML(manoComputadora[1]);
  cartaVolteada.classList.add("volteada");
  cartaOcultaHTML.replaceWith(cartaVolteada);
  pintarPuntos(puntosComputadoraHTML, manoComputadora);
  await esperar(DURACION_ANIMACION);

  // La computadora saca sus cartas nuevas una por una
  for (let i = manoComputadora.length; i < mano.length; i++) {
    divCartasComputadora.append(crearCartaHTML(mano[i]));
    pintarPuntos(puntosComputadoraHTML, mano.slice(0, i + 1));
    await esperar(DURACION_ANIMACION);
  }

  manoComputadora = mano;

  const ganador = determinarGanador(manoJugador, manoComputadora);
  const pago = calcularPago(ganador, apuesta, ganador === "jugador" && esBlackjack(manoJugador));

  saldo += pago;
  guardarSaldo();

  const { titulo, detalle, tipo } = crearResultado(ganador, pago - apuesta);
  resultadoTitulo.innerText = titulo;
  resultadoDetalle.innerText = detalle;
  divResultado.className = `cartel ${tipo}`;
  divResultado.hidden = false;

  marcador[ganador]++;
  guardar("blackjack-marcador", marcador);
  pintarMarcador();

  prepararApuesta();
};

const iniciarJuego = async () => {
  // La apuesta sale del saldo al repartir
  saldo -= apuesta;
  apuestaBase = apuesta;
  guardarSaldo();

  panelApuesta.hidden = true;
  panelJuego.hidden = false;

  deck = crearDeck(tipos, especiales);

  puntosJugador = 0;
  manoJugador = [];
  manoComputadora = [];

  pintarPuntos(puntosJugadorHTML, manoJugador);
  pintarPuntos(puntosComputadoraHTML, manoComputadora);

  divCartasComputadora.innerHTML = "";
  divCartasJugador.innerHTML = "";

  divResultado.hidden = true;

  btnPedir.disabled = true;
  btnDoblar.disabled = true;
  btnDetener.disabled = true;

  // Se reparte como en el casino, alternando y con la última carta de la computadora boca abajo
  const repartos = [
    () => darCartaJugador(),
    () => darCartaComputadora(),
    () => darCartaJugador(),
    () => darCartaComputadora(true),
  ];

  for (const repartir of repartos) {
    repartir();
    await esperar(DURACION_ANIMACION);
  }

  // Blackjack: con 21 en las dos primeras cartas no hace falta seguir
  if (puntosJugador === 21) {
    terminarTurnoJugador();
    return;
  }

  btnPedir.disabled = false;
  btnDoblar.disabled = !puedeDoblar(manoJugador, saldo, apuesta);
  btnDetener.disabled = false;
};

pintarMarcador();
pintarFichas();

// Pedimos el nombre antes de empezar, con el último que se usó ya escrito
inputNombre.value = leer("blackjack-nombre", "");
modalNombre.showModal();

// La primera vez no se puede cerrar el modal con Escape
modalNombre.addEventListener("cancel", (event) => {
  if (!nombreConfirmado) event.preventDefault();
});

inputNombre.addEventListener("input", () => {
  // required acepta un nombre de solo espacios, así que lo validamos aparte
  inputNombre.setCustomValidity(
    inputNombre.value.trim() ? "" : "Escribe tu nombre"
  );
});

formNombre.addEventListener("submit", () => {
  nombreJugador = inputNombre.value.trim();
  nombresJugadorHTML.forEach((elemento) => (elemento.innerText = nombreJugador));
  guardar("blackjack-nombre", nombreJugador);

  // Al cambiar el nombre a mitad de partida no se reinicia el juego
  if (!nombreConfirmado) {
    nombreConfirmado = true;
    prepararApuesta();
  }
});

// Eventos
botonesFicha.forEach((boton) => {
  boton.addEventListener("click", () => {
    apuesta += Number(boton.dataset.valor);
    pintarFichas();
  });
});

btnLimpiarApuesta.addEventListener("click", () => {
  apuesta = 0;
  pintarFichas();
});

btnRepartir.addEventListener("click", iniciarJuego);

btnRecargar.addEventListener("click", () => {
  saldo = SALDO_INICIAL;
  guardarSaldo();
});

btnPedir.addEventListener("click", () => {
  darCartaJugador();
  btnDoblar.disabled = true;

  if (puntosJugador >= 21) {
    terminarTurnoJugador();
  }
});

btnDoblar.addEventListener("click", () => {
  // Se dobla la apuesta, se recibe una sola carta y se planta
  saldo -= apuesta;
  apuesta *= 2;
  guardarSaldo();

  darCartaJugador();
  terminarTurnoJugador();
});

btnDetener.addEventListener("click", terminarTurnoJugador);

const cerrarMenu = () => {
  menuOpciones.hidden = true;
  btnMenu.setAttribute("aria-expanded", "false");
};

btnMenu.addEventListener("click", (event) => {
  event.stopPropagation();
  menuOpciones.hidden = !menuOpciones.hidden;
  btnMenu.setAttribute("aria-expanded", String(!menuOpciones.hidden));
});

// El menú se cierra al hacer clic fuera o con Escape
document.addEventListener("click", cerrarMenu);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") cerrarMenu();
});

btnCambiarNombre.addEventListener("click", () => {
  cerrarMenu();
  inputNombre.value = nombreJugador;
  modalNombre.showModal();
});

btnReiniciarMarcador.addEventListener("click", () => {
  cerrarMenu();
  marcador = { jugador: 0, computadora: 0, empate: 0 };
  guardar("blackjack-marcador", marcador);
  pintarMarcador();
});
