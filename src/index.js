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

  const setUpContainer = document.querySelector(".set-up"); // Container for set up
  const playGameContainer = document.querySelector(".game"); // Container for play game
  const winDialog = document.getElementById("done-game"); // Dialog to tell winner

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

  // Listens to when a box in the setup grid is clicked and fills in it's coordinates in the inputs
  // Made here instead of in updateSetUpGrid because I don't want a hundred event listeners for each box
  setUpGrid.addEventListener("click", () => {
    const clickedBox = event.target.closest(".boxy");
    if (!clickedBox) return;
    xInput.value = clickedBox.dataset.x;
    yInput.value = clickedBox.dataset.y;
  });

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

      shipStatus = humanPlayer.placeShip(shipsIndex, x, y, randHorizontal); // Attempt to place ship

      if (shipStatus !== -1 && shipStatus !== -2) { // Checks if ship was placed successfully and goes to the next ship if so
        shipsPlaced.push(shipsIndex);
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

    // Hides the setup and shows the playgame div
    // Then runs the function to play game passing the player's data into it
    setUpContainer.classList.add("hidden");
    playGameContainer.classList.remove("hidden");
    playGame(humanPlayer);
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

  // Win dialog only appears when the playGame function is done, so this checks if it's been clicked
  // If it has that means the person wants to play another game so it closes the dialog, shows the setup, hides the game, and resets everything
  winDialog.addEventListener("click", () => {
    winDialog.close();
    playGameContainer.classList.add("hidden");
    setUpContainer.classList.remove("hidden");
    resetSetUp();
  });

  // Creates the setup
  function setUp() {
    updateSetUpGrid();
    updateShipOptions();
    updateAlignOptions();
  }

  setUp();
}


// Plays a game of battleship
// Separated from screen controller because it's too big
function playGame(player) {
  let computerPlayer = Player(true); // Makes a computer player
  const playGame = document.querySelector(".game"); // Container for the game
  const winDialog = document.getElementById("done-game"); // Dialog that displays who won
  const winText = document.getElementById("winner");

  playGame.replaceChildren(); // Clears the div for the game. To remove any event listeners and things that need to be replaced.
  const personGrid = document.createElement("div");
  const computerGrid = document.createElement("div");

  personGrid.id = "player-grid";
  computerGrid.id = "computer-grid";

  // Add containers for both player's grids
  playGame.appendChild(personGrid);
  playGame.appendChild(computerGrid);

  // Randomizes the computer's ships, similar to the randomize setup function
  function randomizeComputerShips () {
    let shipsIndex = 0; // Refers to index in gameboard
    let randHorizontal = false;
    let x = 0;
    let y = 0;
    let shipStatus = "";
    const shipsPlaced = [];

    // Repeats until all ships have been placed
    while (shipsPlaced.length < 5) {
      randHorizontal = Math.random() < 0.5 ? true : false; // Randomly decide if it should be horizontal or not
      // Generate random coordinates
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);

      shipStatus = computerPlayer.placeShip(shipsIndex, x, y, randHorizontal); // Attempt to place ship

      if (shipStatus !== -1 && shipStatus !== -2) { // Checks if ship was placed successfully and goes to the next ship if so
        shipsPlaced.push(shipsIndex);
        shipsIndex++;
      }
    }
  }

  // Updates the player's grid
  function updatePlayerGrid() {
    personGrid.replaceChildren();
    const personBoard = player.getBoard();

    function createBox(row, x, y) {
      const box = document.createElement("div");
      box.classList.add("boxy");
      box.setAttribute('data-x', `${x}`);
      box.setAttribute('data-y', `${y}`);

      // If statements are organized this way so that it can show a ship with a hit marker
      if (personBoard[y][x] === -3) {
        box.classList.add("miss");
      } else if (personBoard[y][x] !== -1) {
        box.classList.add("box-ship");
      }
      if (personBoard[y][x] === -2) {
        box.classList.add("hit");
      }
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
      personGrid.appendChild(row);
    }
  }

  // Updates computer's grid
  function updateComputerGrid() {
    computerGrid.replaceChildren();
    const computerBoard = computerPlayer.getBoard();

    function createBox(row, x, y) {
      const box = document.createElement("div");
      box.classList.add("boxy");
      box.setAttribute('data-x', `${x}`);
      box.setAttribute('data-y', `${y}`);

      // Doesn't show the computer's ships only hits or misses
      if (computerBoard[y][x] === -3) {
        box.classList.add("miss");
      } else if (computerBoard[y][x] === -2) {
        box.classList.add("hit");
      }

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
      computerGrid.appendChild(row);
    }
  }

  // Listener for the computer's grid container
  computerGrid.addEventListener("click", () => {
    const clickedBox = event.target.closest(".boxy");
    if (!clickedBox) return;
    if (clickedBox.classList.contains("hit") || clickedBox.classList.contains("miss")) return;
    attackComputer(clickedBox.dataset.x, clickedBox.dataset.y); // Uses the coordinate's the person clicked on
  });

  // Runs a turn of battleship
  function attackComputer(x, y) {
    // Runs the person's attack first
    computerPlayer.receiveAttack(x, y);
    updateComputerGrid();

    if (computerPlayer.areAllSunk()) { // Checks if the person won
      declareWinner();
    }

    // Gets a random shot
    // If the shot is already in player's shots then it gets another random shot
    // Repeats until it generates a unique shot
    const playerShots = player.getShots(); // Returns array of all the shots the players board took
    let randShot = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    while (playerShots.some(shot => (shot[0] === randShot[0] && shot[1] === randShot[1]))) {
      randShot = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    }

    // Runs the computer's shot
    player.receiveAttack(randShot[0], randShot[1]);
    updatePlayerGrid();

    if (player.areAllSunk()) { // Checks if the computer won
      declareWinner();
    }
  }

  function declareWinner() {
    // Checks who won and changes the text accordingly
    if (computerPlayer.areAllSunk()) {
      winText.textContent = "You Win!";
    } else {
      winText.textContent = "Computer Wins!";
    }

    // Shows the win dialog
    winDialog.showModal();
  }

  randomizeComputerShips();
  updatePlayerGrid();
  updateComputerGrid();
}

ScreenController();