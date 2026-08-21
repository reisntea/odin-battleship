import "./styles.css";
import { Player } from "./players.js";

// Divided into two phases in two functions, set-up and play game.
function ScreenController() {
  // Vars in setup phase
  const setUpGrid = document.getElementById("set-up-grid");
  let currShip = 0; // Going by index of ships in gameboard so index 0 is carrier
  let currHorizontal = true;
  // Setup phase vars for left side menu options
  const shipOptions = document.getElementById("ship-options-container");
  const shipDivs = document.querySelectorAll(".ship");
  const alignOptions = document.getElementById("alignment");
  const alignDivs = document.querySelectorAll(".align-option");
  // Setup phase vars for right side menu options
  const xInput = document.getElementById("x-coordinate");
  const yInput = document.getElementById("y-coordinate");
  const formOptions = document.getElementById("form-options-container");
  const errorText = document.getElementById("error-text");

  const shipsPlaced = [];   // Used to check if a ship has been placed already

  let humanPlayer = Player(false);   // Representative for the person playing

  // Updates the setup grid with boxes
  const updateSetUpGrid = () => {
    setUpGrid.replaceChildren(); // Clears the grid
    const humanBoard = humanPlayer.getBoard();

    function createBox(row, x, y) {
      const box = document.createElement("div");
      box.classList.add("boxy");
      box.setAttribute('data-x', `${x}`);
      box.setAttribute('data-y', `${y}`);
      if (humanBoard[y][x] !== -1) box.classList.add("box-ship"); // Checks if the square on the person's board has a ship, add the class to it
      row.appendChild(box);
    }

    // Creates the rows that get added to the grid
    for (let i = 0; i < 10; i++) {
      const row = document.createElement("div");
      row.classList.add("row");
      // Creates the squares that get added to each row
      for (let j = 0; j < 10; j++) {
        createBox(row, j, i);
      }
      setUpGrid.appendChild(row);
    }
  }

  // Event listener for the ships on the left side of the grid
  shipOptions.addEventListener("click", (event) => {
    const clickedShip = event.target.closest(".ship");
    if (!clickedShip || clickedShip.classList.contains("selected")) return;
    switch (clickedShip.id) {
      case "carrier":
        currShip = 0;
        break;
      case "battleship":
        currShip = 1;
        break;
      case "cruiser":
        currShip = 2;
        break;
      case "submarine":
        currShip = 3;
        break;
      case "destroyer":
        currShip = 4;
        break;
    }
    updateShipOptions();
  });

  // Updates the ship menu to highlight the current ship option
  function updateShipOptions() {
    shipDivs.forEach((ship, index) => { // Goes through the divs with the .ship class and adds the appropriate class
      if (index === currShip) {
        ship.classList.add("selected");
      } else {
        ship.classList.remove("selected");
      }
    });
  }

  // Event listener for the orientation on the left side of the grid
  alignOptions.addEventListener("click", (event) => {
    const clickedAlign = event.target.closest(".align-option");
    if (!clickedAlign || clickedAlign.classList.contains("selected")) return;
    switch (clickedAlign.id) {
      case "horizontal":
        currHorizontal = true;
        break;
      case "vertical":
        currHorizontal = false;
        break;
    }
    updateAlignOptions();
  });

  // Updates the ship menu to highlight the current ship option
  function updateAlignOptions() {
    alignDivs.forEach((alignment) => {
      if (currHorizontal) {
        if (alignment.id === "horizontal") {
          alignment.classList.add("selected");
        } else {
          alignment.classList.remove("selected");
        }
      } else {
        if (alignment.id === "vertical") {
          alignment.classList.add("selected");
        } else {
          alignment.classList.remove("selected");
        }
      }
    });
  }

  // Event listener for the options on the right bottom side of the grid
  formOptions.addEventListener("click", (event) => {
    const clickedOption = event.target.closest(".form-option");
    if (!clickedOption) return;
    switch (clickedOption.id) {
      case "place":
        placeShip();
        break;
      case "reset":
        resetSetUp();
        break;
      case "randomize":
        randomizeSetUp();
        break;
      case "done":
        doneSetUp();
        break;
    }
  });

  function placeShip() {
    if (xInput.value.length === 0 || yInput.value.length === 0) { // Checks if either input is blank
      displayError(0);
      return;
    }

    if (xInput.valueAsNumber < 0 || yInput.valueAsNumber < 0 || xInput.valueAsNumber > 9 || yInput.valueAsNumber > 9) { // Checks if either input is out of bounds
      displayError(1);
      return;
    }

    if (shipsPlaced.includes(currShip)) { // Checks if ship has already been placed
      displayError(2);
      return;
    }

    // Attempts to place ship
    // If it can't it returns a number corresponding to a certain reason for why
    const shipStatus = humanPlayer.placeShip(currShip, xInput.valueAsNumber, yInput.valueAsNumber, currHorizontal);

    if (shipStatus === -1) { // Means ship goes out of bounds
      displayError(3);
      return;
    } else if (shipStatus === -2) { // Means ship overlaps with other ships
      displayError(4);
      return;
    } else {
      // Removes error and resets input values
      errorText.textContent = "";
      xInput.value = "0";
      yInput.value = "0";

      // Adds currShip to ships placed and updates the setup grid
      shipsPlaced.push(currShip);
      updateSetUpGrid();
    }
  }

  // Sets the person playing to a new player and sets all the values back to their default
  // Then sets everything back up
  function resetSetUp() {
    humanPlayer = Player(false);
    shipsPlaced.length = 0;
    currShip = 0;
    currHorizontal = true;
    errorText.textContent = "";
    setUp();
  }

  // Randomizes the person's ships
  function randomizeSetUp() {
    resetSetUp();
    let shipsIndex = 0; // Refers to index in gameboard
    let randHorizontal = false;
    let x = 0;
    let y = 0;
    let shipStatus = "";

    // Repeats until all ships have been placed
    while (shipsPlaced.length < 5) {
      randHorizontal = Math.random() < 0.5 ? true : false; // Randomly decide if it should be horizontal or not
      // Generate random coordinates
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);

      shipStatus = humanPlayer.placeShip(shipsIndex, x, y, currHorizontal); // Attempt to place ship

      if (shipStatus !== -1 && shipStatus !== -2) { // Checks if ship was placed successfully and goes to the next ship if so
        shipsPlaced.push(currShip);
        shipsIndex++;
        updateSetUpGrid();
      }
    }
  }

  // Checks if all ships have been placed
  // Starts a game if so
  function doneSetUp() {
    if (shipsPlaced.length !== 5) {
      displayError(5);
      return;
    }
    console.log("yippee!!");
  }

  // Displays the corresponding error using the num passed from the set up functions
  function displayError(errorNum) {
    if (errorNum === 0) {
      errorText.textContent = "Please enter proper coordinates.";
      return;
    } else if (errorNum === 1) {
      errorText.textContent = "Please enter coordinates from 0 to 9.";
      return;
    } else if (errorNum === 2) {
      errorText.textContent = "Ship has already been placed, press reset to undo placements.";
      return;
    } else if (errorNum === 3) {
      errorText.textContent = "Ship goes out of bounds at given coordinates.";
      return;
    } else if (errorNum === 4) {
      errorText.textContent = "Ship overlaps with other ships.";
      return;
    } else if (errorNum === 5) {
      errorText.textContent = "Ships still need to be placed.";
      return;
    }
  }

  // Creates the setup
  function setUp() {
    updateSetUpGrid();
    updateShipOptions();
    updateAlignOptions();
  }

  setUp();
}

ScreenController();