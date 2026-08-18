import { Ship } from "./ship.js";
import { Gameboard } from "./gameboard.js";
import { Player } from "./players.js";

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

// Player tests

const testPlayer = Player(false); // human player

test('is human player', () => {
  expect(testPlayer.isComp()).toBe(false);
});

// Huge test to simulate if a round of battleship works
test('can sink every ship in player', () => {
  // Place ships horizontally across first value in x-axis (so starting from upper-left corner)
  for (let i = 0; i < 5; i++) {
    testPlayer.placeShip(i, 0, i, true);
  }
  expect(testPlayer.areAllSunk()).toBe(false); // No ships are sunk so false
  expect(testPlayer.receiveAttack(9, 9)).toBe(false);

  // Sinking carrier
  expect(testPlayer.receiveAttack(0, 0)).toBe(true);
  expect(testPlayer.receiveAttack(1, 0)).toBe(true);
  expect(testPlayer.receiveAttack(2, 0)).toBe(true);
  expect(testPlayer.receiveAttack(3, 0)).toBe(true);
  expect(testPlayer.receiveAttack(4, 0)).toBe(true);

  // Sinking battleship
  expect(testPlayer.receiveAttack(0, 1)).toBe(true);
  expect(testPlayer.receiveAttack(1, 1)).toBe(true);
  expect(testPlayer.receiveAttack(2, 1)).toBe(true);
  expect(testPlayer.receiveAttack(3, 1)).toBe(true);

  // Sinking cruiser
  expect(testPlayer.receiveAttack(0, 2)).toBe(true);
  expect(testPlayer.receiveAttack(1, 2)).toBe(true);
  expect(testPlayer.receiveAttack(2, 2)).toBe(true);

  // Sinking submarine
  expect(testPlayer.receiveAttack(0, 3)).toBe(true);
  expect(testPlayer.receiveAttack(1, 3)).toBe(true);
  expect(testPlayer.receiveAttack(2, 3)).toBe(true);

  // Sinking destroyer
  expect(testPlayer.receiveAttack(0, 4)).toBe(true);
  expect(testPlayer.receiveAttack(1, 4)).toBe(true);

  expect(testPlayer.areAllSunk()).toBe(true); // All ships are sunk so true
});

