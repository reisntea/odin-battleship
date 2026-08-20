import "./styles.css";

// Divided into two phases in two functions, set-up and play game.
function ScreenController() {
  // Vars for setup
  const setUpGrid = document.getElementById("set-up-grid");
  let currShip = 0; // Going by index of ships in gameboard so index 0 is carrier
  let currHorizontal = true;

  function setUp() {
    const shipPlacements = []; // Contains the placement of all the ships. Also goes by index in gameboard.

    const createGrid = () => {
      function createBox(row, x, y) {
        const box = document.createElement("div");
        box.classList.add("boxy");
        box.setAttribute('data-x', `${x}`);
        box.setAttribute('data-y', `${y}`);
        row.appendChild(box);
      }

      for (let i = 0; i < 10; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < 10; j++) {
          createBox(row, j, i);
        }
        setUpGrid.appendChild(row);
      }
    }

    // Add event listeners for leftside buttons
    // Prob have to add data-ids to stuff

    // Also make sure the stuff can get cleared

    createGrid();
  }

  setUp();
}

ScreenController();