import { describe, expect, test } from 'vitest';
import {
    calcularPuntos,
    crearDeck,
    determinarGanador,
    jugarComputadora,
    pedirCarta,
    valorCarta,
} from './';

const tipos = ['C', 'D', 'H', 'S'];
const especiales = ['A', 'J', 'Q', 'K'];

describe('valorCarta', () => {
    test('las cartas numéricas valen su número', () => {
        expect( valorCarta('2C') ).toBe(2);
        expect( valorCarta('10H') ).toBe(10);
    });

    test('J, Q y K valen 10 y el As 11', () => {
        expect( valorCarta('JD') ).toBe(10);
        expect( valorCarta('QS') ).toBe(10);
        expect( valorCarta('KC') ).toBe(10);
        expect( valorCarta('AH') ).toBe(11);
    });
});

describe('calcularPuntos', () => {
    test('suma las cartas de la mano', () => {
        expect( calcularPuntos([]) ).toBe(0);
        expect( calcularPuntos(['5C', 'KD']) ).toBe(15);
    });

    test('el As vale 11 si no se pasa de 21', () => {
        expect( calcularPuntos(['AS', 'KD']) ).toBe(21);
    });

    test('el As vale 1 si con 11 se pasa de 21', () => {
        expect( calcularPuntos(['AS', 'AH']) ).toBe(12);
        expect( calcularPuntos(['AS', '9C', '5D']) ).toBe(15);
        expect( calcularPuntos(['AS', 'AH', 'AD', 'AC']) ).toBe(14);
    });

    test('puede pasarse de 21 aunque los ases valgan 1', () => {
        expect( calcularPuntos(['AS', 'KD', 'QH', '5C']) ).toBe(26);
    });
});

describe('crearDeck', () => {
    test('crea un mazo de 52 cartas distintas', () => {
        const deck = crearDeck( tipos, especiales );
        expect( deck ).toHaveLength(52);
        expect( new Set(deck).size ).toBe(52);
    });

    test('lanza error sin tipos de carta', () => {
        expect( () => crearDeck([], especiales) ).toThrow();
        expect( () => crearDeck(tipos) ).toThrow();
    });
});

describe('pedirCarta', () => {
    test('saca la última carta del mazo', () => {
        const deck = ['2C', '3D'];
        expect( pedirCarta(deck) ).toBe('3D');
        expect( deck ).toEqual(['2C']);
    });

    test('lanza error si el mazo está vacío', () => {
        expect( () => pedirCarta([]) ).toThrow();
    });
});

describe('jugarComputadora', () => {
    // pedirCarta saca del final, así que la primera carta en salir es la última del arreglo

    test('pide cartas hasta igualar o superar al jugador', () => {
        const deck = ['KC', '9H', '5D'];
        expect( jugarComputadora(14, deck) ).toEqual({ mano: ['5D', '9H'], puntos: 14 });
    });

    test('se pasa de 21 si no le queda otra', () => {
        const deck = ['KC', '9H', '5D'];
        expect( jugarComputadora(20, deck) ).toEqual({ mano: ['5D', '9H', 'KC'], puntos: 24 });
    });

    test('pide una sola carta si el jugador se pasó de 21', () => {
        const deck = ['KC', '2H'];
        expect( jugarComputadora(25, deck) ).toEqual({ mano: ['2H'], puntos: 2 });
    });

    test('pide al menos una carta aunque el jugador tenga 0 puntos', () => {
        const deck = ['KC', '2H'];
        expect( jugarComputadora(0, deck).mano ).toHaveLength(1);
    });

    test('lanza error sin puntos mínimos', () => {
        expect( () => jugarComputadora(undefined, ['2C']) ).toThrow();
    });
});

describe('determinarGanador', () => {
    test('si el jugador se pasa de 21, gana la computadora', () => {
        expect( determinarGanador(22, 5) ).toBe('computadora');
    });

    test('si la computadora se pasa de 21, gana el jugador', () => {
        expect( determinarGanador(18, 24) ).toBe('jugador');
    });

    test('con los mismos puntos hay empate', () => {
        expect( determinarGanador(19, 19) ).toBe('empate');
    });

    test('gana quien tenga más puntos sin pasarse', () => {
        expect( determinarGanador(17, 20) ).toBe('computadora');
        expect( determinarGanador(20, 17) ).toBe('jugador');
    });
});
