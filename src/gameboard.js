import { Ship } from "./ship.js";

// Creates a 10x10 2d array with all the values as -1 by default
// Spaces with ships are given a number from 0 to 4 referring to ships in the ships array
function Gameboard() {
  const rows = 10;
  const columns = 10;
  const board = [];
  const ships = [new Ship(5), new Ship(4), new Ship(3), new Ship(3), new Ship(2)];   // Goes Carrier, battleship, cruiser, submarine, and then destroyer
  const shots = []; // Contains coordinates of all the shots fired
  const misses = []; // Subset of shots containing all shots that were fired and missed. Values refer to indices in shots

  for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
          board[i].push(-1);
      }
  }

  // Places ship based on index
  // x and y values refer to where the back of ship is placed
  // horizontal is a boolean which determines if the ship is placed horizontally or vertically
  // returns early if a ship can't be placed
  const placeShip = (index, x, y, horizontal) => {
    const spaces = ships[index].length;
    if (horizontal) {
      // Look at spaces beforehand to see if a ship can be placed and returns a value as an error if not possible (error value is used by screenController DOM functions)
      if (x + spaces > 10) return -1;
      for (let i = 0; i < spaces; i++) {
        if (board[y][x + i] !== -1) return -2;
      }
      // If all spaces are good then place the ship
      for (let j = 0; j < spaces; j++) {
        board[y][x + j] = index;
      }
    } else {
      // Look at spaces beforehand to see if a ship can be placed false and returns a value as an error if not possible (error value is used by screenController DOM functions)
      if (y + spaces > 10) return -1;
      for (let i = 0; i < spaces; i++) {
        if (board[y + i][x] !== -1) return -2;
      }
      // If all spaces are good then place the ship
      for (let j = 0; j < spaces; j++) {
        board[y + j][x] = index;
      }
    }
  }

  // Looks at value of board at x, y coordinates
  // returns false if miss and true if it hit
  const receiveAttack = (x, y) => {
    if (shots.some((shot) => shot[0] === x && shot[1] === y)) return false; // check if shots already includes shot and return false if so

    shots.push([x, y]); // Add shot to shots

    if (board[y][x] === -1) {
      misses.push(shots.length - 1);
      return false;  // if miss return false
    };

    ships[board[y][x]].hit();
    return true; // if hit return true
  }

  // Checks if every ship is sunk
  const areAllSunk = () => {
    return ships.every((ship) => ship.isSunk());
  }

  const getBoard = () => {
    return board;
  }

  return { placeShip, receiveAttack, areAllSunk, getBoard }
}

export { Gameboard };