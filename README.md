# Blackjack

Juego de Blackjack contra la computadora hecho con JavaScript vanilla, [Vite](https://vitejs.dev/) y [Bootstrap](https://getbootstrap.com/).

## Cómo jugar

Al empezar escribes tu nombre y se reparten 2 cartas a cada uno. Una de las cartas de la computadora queda boca abajo hasta que te plantas.
Si sacas 21 con las dos primeras cartas (blackjack), tu turno termina solo. El blackjack gana a cualquier otro 21; si los dos tienen blackjack, es empate.

- **Pedir carta:** saca una carta. Si llegas a 21 o te pasas, el turno termina solo.
- **Detener:** te plantas, se voltea la carta oculta y juega la computadora.
- **Nuevo juego:** reinicia la partida con un mazo nuevo.

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
└── usecases/
    ├── calcular-puntos.js    # Puntos de una mano (As = 1 u 11)
    ├── crear-carta-html.js   # <img> de una carta
    ├── crear-deck.js         # Crea y mezcla el mazo
    ├── determinar-ganador.js # Decide quién gana
    ├── jugar-computadora.js  # Cartas que pide la computadora
    ├── pedir-carta.js        # Saca una carta del mazo
    ├── valor-carta.js        # Valor de una carta individual
    └── usecases.test.js      # Tests de la lógica del juego
```

La lógica del juego (`usecases/`, salvo `crear-carta-html.js`) no toca el DOM, por eso se puede probar con Vitest sin navegador.
