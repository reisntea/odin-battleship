import { Gameboard } from "./gameboard.js";

// Player factory contains gameboard and the type of player
// Used by index.js to control both gameboards for human and computer players
// isComputer is a boolean value
function Player(isComputer) {
  const gameboard = Gameboard();
  const computerPlayer = isComputer;   // To make a distinction between the computer player and human player

  const isComp = () => {
    return computerPlayer;
  }

  const placeShip = (index, x, y, horizontal) => {
    return gameboard.placeShip(index, x, y, horizontal);
  }

  const receiveAttack = (x, y) => {
    return gameboard.receiveAttack(x, y);
  }

  const areAllSunk = () => {
    return gameboard.areAllSunk();
  }

  const getBoard = () => {
    return gameboard.getBoard();
  }

  const getShots = () => {
    return gameboard.getShots();
  }

  return { isComp, placeShip, receiveAttack, areAllSunk, getBoard, getShots };
}

export { Player };