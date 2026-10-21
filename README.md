# Blackjack

Juego de Blackjack contra la computadora hecho con JavaScript vanilla, CSS propio y [Vite](https://vitejs.dev/).

## Cómo jugar

Al empezar escribes tu nombre y recibes 1000 fichas. En cada partida:

1. **Apuesta:** suma fichas con los botones +10, +25, +50 y +100, y pulsa **Repartir**. La partida repite la apuesta anterior si te alcanza el saldo.
2. Se reparten 2 cartas a cada uno. Una de las cartas de la computadora queda boca abajo hasta que te plantas.
3. Juega tu mano:
   - **Pedir carta:** saca una carta. Si llegas a 21 o te pasas, el turno termina solo.
   - **Doblar:** solo con tus dos primeras cartas. Duplicas la apuesta, recibes una carta más y te plantas.
   - **Plantarse:** te quedas con tus cartas, se voltea la carta oculta y juega la computadora.

Si sacas 21 con las dos primeras cartas (blackjack), tu turno termina solo. El blackjack gana a cualquier otro 21; si los dos tienen blackjack, es empate.

**Pagos:** una victoria paga 1:1, el blackjack paga 3:2 (redondeando hacia abajo) y el empate te devuelve la apuesta. Si te quedas sin fichas puedes recargar 1000.

En la barra superior están tu saldo y el marcador de partidas ganadas, perdidas y empatadas. El menú (⋮) permite **cambiar el nombre** y **reiniciar el marcador**. El saldo, el marcador y tu nombre se guardan en el navegador (`localStorage`).

Las cartas numéricas valen su número, J, Q y K valen 10, y el As vale 11 o 1 según convenga.
La computadora juega como un crupier de casino: pide carta con 16 o menos y se planta con 17 o más. Si te pasas de 21, no pide más.

## Ejecutar en local

```bash
npm install
npm run dev
```

## Scripts

| Comando           | Descripción                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Servidor de desarrollo               |
| `npm run build`   | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la versión de `dist/` |
| `npm test`        | Ejecuta los tests con Vitest         |

## Estructura

```
src/blackjack/
├── index.js              # Interfaz: referencias al DOM, eventos y pintado
├── almacenamiento.js     # Lectura y escritura en localStorage
└── usecases/
    ├── apuestas.js           # Pagos y cuándo se puede doblar
    ├── calcular-puntos.js    # Puntos de una mano (As = 1 u 11)
    ├── crear-carta-html.js   # <img> de una carta
    ├── crear-deck.js         # Crea y mezcla el mazo
    ├── determinar-ganador.js # Decide quién gana
    ├── jugar-computadora.js  # Cartas que pide la computadora
    ├── nombre-carta.js       # Nombre legible de una carta ("As de picas")
    ├── pedir-carta.js        # Saca una carta del mazo
    ├── valor-carta.js        # Valor de una carta individual
    └── usecases.test.js      # Tests de la lógica del juego
```

La lógica del juego (`usecases/`, salvo `crear-carta-html.js`) no toca el DOM, por eso se puede probar con Vitest sin navegador.
