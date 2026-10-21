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

## Estructura

```
src/blackjack/
├── index.js              # Referencias al DOM y eventos de los botones
└── usecases/
    ├── calcular-puntos.js    # Puntos de una mano (As = 1 u 11)
    ├── crear-carta-html.js   # <img> de una carta
    ├── crear-deck.js         # Crea y mezcla el mazo
    ├── pedir-carta.js        # Saca una carta del mazo
    ├── turno-computadora.js  # Juega la computadora y decide el resultado
    └── valor-carta.js        # Valor de una carta individual
```
