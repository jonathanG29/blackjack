import { describe, expect, test } from 'vitest';
import {
    calcularPuntos,
    crearDeck,
    determinarGanador,
    esBlackjack,
    jugarComputadora,
    nombreCarta,
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

describe('nombreCarta', () => {
    test('nombra las cartas numéricas con su palo', () => {
        expect( nombreCarta('2C') ).toBe('2 de tréboles');
        expect( nombreCarta('10H') ).toBe('10 de corazones');
    });

    test('nombra las figuras y el As', () => {
        expect( nombreCarta('AS') ).toBe('As de picas');
        expect( nombreCarta('JD') ).toBe('Jota de diamantes');
        expect( nombreCarta('QH') ).toBe('Reina de corazones');
        expect( nombreCarta('KC') ).toBe('Rey de tréboles');
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

    test('pide con 16 o menos aunque se pase de 21', () => {
        const deck = ['KC', '9H', '5D'];
        expect( jugarComputadora(20, deck) ).toEqual({ mano: ['5D', '9H', 'KC'], puntos: 24 });
    });

    test('continúa desde la mano inicial', () => {
        const deck = ['KC', '9H'];
        expect( jugarComputadora(18, deck, ['5D', '4C']) ).toEqual({ mano: ['5D', '4C', '9H'], puntos: 18 });
    });

    test('se planta con 17 aunque el jugador tenga más', () => {
        const deck = ['2C'];
        expect( jugarComputadora(20, deck, ['KC', '7D']) ).toEqual({ mano: ['KC', '7D'], puntos: 17 });
        expect( deck ).toEqual(['2C']);
    });

    test('se planta con 17 usando el As como 11', () => {
        const deck = ['5C'];
        expect( jugarComputadora(19, deck, ['AS', '6D']) ).toEqual({ mano: ['AS', '6D'], puntos: 17 });
    });

    test('pide carta con 16', () => {
        const deck = ['5C'];
        expect( jugarComputadora(18, deck, ['KC', '6D']) ).toEqual({ mano: ['KC', '6D', '5C'], puntos: 21 });
    });

    test('no pide cartas si el jugador se pasó de 21', () => {
        const deck = ['KC', '2H'];
        expect( jugarComputadora(25, deck, ['5D', '3S']) ).toEqual({ mano: ['5D', '3S'], puntos: 8 });
    });

    test('no modifica la mano inicial', () => {
        const manoInicial = ['5D', '4C'];
        jugarComputadora(18, ['KC', '9H'], manoInicial);
        expect( manoInicial ).toEqual(['5D', '4C']);
    });

    test('lanza error sin los puntos del jugador', () => {
        expect( () => jugarComputadora(undefined, ['2C']) ).toThrow();
    });
});

describe('esBlackjack', () => {
    test('es blackjack con 21 en dos cartas', () => {
        expect( esBlackjack(['AS', 'KD']) ).toBe(true);
    });

    test('no es blackjack con 21 en más de dos cartas', () => {
        expect( esBlackjack(['7C', '7D', '7H']) ).toBe(false);
    });

    test('no es blackjack con dos cartas que no suman 21', () => {
        expect( esBlackjack(['AS', '9D']) ).toBe(false);
    });
});

describe('determinarGanador', () => {
    test('si el jugador se pasa de 21, gana la computadora', () => {
        expect( determinarGanador(['KC', 'QD', '5H'], ['5C']) ).toBe('computadora');
    });

    test('si la computadora se pasa de 21, gana el jugador', () => {
        expect( determinarGanador(['KC', '8D'], ['KH', '6D', '8H']) ).toBe('jugador');
    });

    test('con los mismos puntos hay empate', () => {
        expect( determinarGanador(['KC', '9D'], ['QH', '9S']) ).toBe('empate');
    });

    test('gana quien tenga más puntos sin pasarse', () => {
        expect( determinarGanador(['KC', '7D'], ['QH', 'QS']) ).toBe('computadora');
        expect( determinarGanador(['QH', 'QS'], ['KC', '7D']) ).toBe('jugador');
    });

    test('el blackjack del jugador gana a un 21 de tres cartas', () => {
        expect( determinarGanador(['AS', 'KD'], ['7C', '7D', '7H']) ).toBe('jugador');
    });

    test('el blackjack de la computadora gana a un 21 de tres cartas', () => {
        expect( determinarGanador(['7C', '7D', '7H'], ['AS', 'KD']) ).toBe('computadora');
    });

    test('si los dos tienen blackjack hay empate', () => {
        expect( determinarGanador(['AS', 'KD'], ['AH', 'QC']) ).toBe('empate');
    });
});
