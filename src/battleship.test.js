import { Ship } from "./ship.js";

test('adds 1 + 2 to equal 3', () => {
  expect(1+3).toBe(4);
});

test('sink a ship', () => {
  let shipTest = new Ship(3);
  shipTest.hit();
  shipTest.hit();
  shipTest.hit();
  expect(shipTest.isSunk()).toBe(true);
});