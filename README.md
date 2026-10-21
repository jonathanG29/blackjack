# Blackjack

Juego de Blackjack contra la computadora hecho con JavaScript vanilla, [Vite](https://vitejs.dev/) y [Bootstrap](https://getbootstrap.com/).

## Cómo jugar

- **Pedir carta:** saca una carta. Si llegas a 21 o te pasas, el turno termina solo.
- **Detener:** te plantas y juega la computadora (debes pedir al menos una carta antes).
- **Nuevo juego:** reinicia la partida con un mazo nuevo.

Las cartas numéricas valen su número, J, Q y K valen 10, y el As vale 11 o 1 según convenga.
La computadora pide cartas hasta igualar o superar tus puntos sin pasarse de 21.

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
