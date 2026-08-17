class Ship {
  // Declaring private methods
  #length;
  #hits;
  #sunk;

  constructor(length) {
    this.#length = length;
    this.#hits = 0;
    this.#sunk = false;
  }

  // Adds a hit and changes sunk boolean if hits is equal to length
  hit() {
    this.#hits++;
    if (this.#hits === this.#length) this.#sunk = true;
  }

  isSunk() {
    return this.#sunk;
  }
}

export { Ship };