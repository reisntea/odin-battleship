import { Ship } from "./ship.js";
import { Gameboard } from "./gameboard.js";

// Ship tests

test('sink a ship', () => {
  const testShip = new Ship(3);
  testShip.hit();
  testShip.hit();
  testShip.hit();
  expect(testShip.isSunk()).toBe(true);
});

test('get ship length', () => {
  const testShip = new Ship(5);
  expect(testShip.length).toBe(5);
});

// Gameboard tests

const testBoard = Gameboard();

test('recieve attack miss and invalid placement work', () => {
  testBoard.placeShip(0, 6, 0, true); // should not place ship bc out of bounds
  expect(testBoard.receiveAttack(6, 0)).toBe(false);
  expect(testBoard.receiveAttack(7, 0)).toBe(false);
});

test('recieve attack hit and valid placement work', () => {
  testBoard.placeShip(0, 5, 1, false); // should place ship
  expect(testBoard.receiveAttack(5, 1)).toBe(true);
  expect(testBoard.receiveAttack(5, 2)).toBe(true);
  expect(testBoard.receiveAttack(5, 3)).toBe(true);
  expect(testBoard.receiveAttack(5, 4)).toBe(true);
  expect(testBoard.receiveAttack(5, 5)).toBe(true);
});

test('shots on same coordinates is false', () => {
  expect(testBoard.receiveAttack(5, 1)).toBe(false);
  expect(testBoard.receiveAttack(5, 2)).toBe(false);
  expect(testBoard.receiveAttack(5, 3)).toBe(false);
  expect(testBoard.receiveAttack(5, 4)).toBe(false);
  expect(testBoard.receiveAttack(5, 5)).toBe(false);
});

test('all sunk check works', () => {
  expect(testBoard.areAllSunk()).toBe(false);
});

