import "./style.css";
import { Plant, PlantType } from "./plants";
import { Memento, SaveFile } from "./Memento";
import { initGrid, saveGrid } from "./saveFunction";

// Setting up the multiple canvases
const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
const gridCtx = gridCanvas.getContext("2d") as CanvasRenderingContext2D;

const selectCanvas = document.getElementById(
  "selectCanvas"
) as HTMLCanvasElement;
const selectCtx = selectCanvas.getContext("2d") as CanvasRenderingContext2D;

// Data structure storing the data of sun and water level
export interface CellData {
  sunLevel: number;
  waterLevel: number;
  plant?: Plant;
}

// Defining the textures to use
const imageUrls = [
  "/tile1.png",
  "/tile2.png",
  "/tile3.png",
  "/tile4.png",
  "/tile5.png",
  "/tile6.png",
  "/tile7.png",
  "/tile8.png",
];

const playerImage = ["./player_tile.png"];

// Defining the size of the main grid
export const numTiles = 10;
const tileSize = gridCanvas.width / numTiles;

// Defining the size of the select grid
const numSelectables = imageUrls.length;
const selectHeight = selectCanvas.height / numSelectables;

let lastXPos: number;
let lastYPos: number;
let pastTile: string = "nothing";

export let xyPos: number[] = [0, 0]; // Initialize xyPos with default values
export let time: number = 0;

// DELETE SECTION? ------------
// track the selected tile
//let currentTile = 0;

//let adjTiles = [];
// ------------------------------

// Can change the names of the types later
const plantTypes: PlantType[] = ["species1", "species2", "species3"];
let harvestTotal = 0;

// Creating the tilemap nested array
let tilemap: HTMLImageElement[][] = new Array(numTiles);

for (let i = 0; i < numTiles; i++) {
  let row = new Array(numTiles);
  for (let j = 0; j < numTiles; j++) {
    row[j] = new Image();
    row[j].src = "/tile1.png";
  }
  tilemap[i] = row;
}

// DELETE SECTION? ---------------
/* const svg: HTMLElement = create("svg");
const svgContainer: HTMLElement | null = document.getElementById("svgContainer"); */

// function create(elementNone: any) {
//     return document.createElementNS("http://www.w3.org/2000/svg", elementNone);
// }
// -----------------------------------

//draw the initial canvases
redrawTilemap();
drawSelectCanvas();

//Function that draws a texture to a specific canvas ctx
function drawTexture(
  row: number,
  col: number,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  cellSize: number
) {
  image.onload = () => {
    ctx.drawImage(image, row * cellSize, col * cellSize, width, height);
  };
  ctx.drawImage(image, row * cellSize, col * cellSize, width, height);
}

// ----- Interacting with the main tilemap -----
function redrawTilemap() {
  gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
  for (let i = 0; i < numTiles; i++) {
    for (let j = 0; j < numTiles; j++) {
      drawTexture(
        i,
        j,
        gridCtx,
        tilemap[i][j],
        gridCanvas.width / numTiles,
        gridCanvas.height / numTiles,
        tileSize
      );
    }
  }
}

export function coordHelper(xPos: number, yPos: number) {
  /* if-statement makes sure to reset the tile that the player moves from to the img
    it was before the player moved onto it.*/

  // DELETE COMMENTS? ---------------------------------------
  if (pastTile != "nothing") {
    lastXPos = xyPos[0];
    lastYPos = xyPos[1];
    tilemap[lastXPos][lastYPos].src = pastTile;
  }

  pastTile = tilemap[xPos][yPos].src;
  tilemap[xPos][yPos].src = playerImage[0];
  xyPos = [xPos, yPos];

  //adjTiles = adjCoords(xPos, yPos);

  redrawTilemap();
  time++;
  return xyPos;
}

gridCanvas.onauxclick = (e) => {
  e.preventDefault();

  const coordX = Math.trunc(e.offsetX / tileSize);
  const coordY = Math.trunc(e.offsetY / tileSize);

  /* Can only plant on squares adjacent to the player that haven't already been planted. */
  if (coordX >= xyPos[0] - 1 && coordX <= xyPos[0] + 1) {
    if (coordY >= xyPos[1] - 1 && coordY <= xyPos[1] + 1) {
      if (tilemap[coordX][coordY].src.includes(imageUrls[0])) {
        cellData[coordX][coordY].plant = new Plant(
          plantTypes[Math.floor(Math.random() * plantTypes.length)],
          1,
          0
        );
        const plantType = plantTypes.indexOf(
          cellData[coordX][coordY].plant!.type
        );
        tilemap[coordX][coordY].src = imageUrls[plantType + 1];
        console.log("planted a " + cellData[coordX][coordY].plant!.type);
      } else {
        if (
          !tilemap[coordX][coordY].src.includes("player") &&
          cellData[coordX][coordY].plant!.growth > 1
        ) {
          console.log(
            "harvested a " +
            cellData[coordX][coordY].plant!.type +
            " at level: " +
            cellData[coordX][coordY].plant!.growth
          );
          tilemap[coordX][coordY].src = imageUrls[0];
          cellData[coordX][coordY].plant = undefined;
          harvestTotal++;
          if (harvestTotal == 10) {
            console.log("You won!");
          }
        }
      }
    }
  }
};

//ABE'S NEW STUFF
const textBox = document.createElement("input");
textBox.type = "text";
textBox.placeholder = "Enter your name";
textBox.value = "left click to move, right click to sow/reep";
textBox.id = "nameInput";
document.getElementsByTagName("body")[0].appendChild(textBox);

export let cellData: CellData[][] = new Array(numTiles);
for (let i = 0; i < numTiles; i++) {
  let row = new Array(numTiles);
  for (let j = 0; j < numTiles; j++) {
    row[j] = { sunLevel: 0, waterLevel: 0 };
  }
  cellData[i] = row;
}

function generateRandomLevels() {
  for (let i = 0; i < numTiles; i++) {
    for (let j = 0; j < numTiles; j++) {
      const currCell = cellData[i][j];
      // Generate random levels (you can adjust the range based on your requirements)
      currCell.sunLevel = Math.floor(Math.random() * 100);
      currCell.waterLevel += Math.floor(Math.random() * 100);
      if (currCell.plant != undefined) {
        currCell.plant?.advanceTime(currCell.sunLevel, currCell.waterLevel);
      }
    }
  }
}

function printGridData() {
  console.log("Time passed: " + time);
  console.log("Grid Cells - Sun, Water, Plant Type, and Growth Level:");
  for (let i = 0; i < numTiles; i++) {
    let rowString = "";
    for (let j = 0; j < numTiles; j++) {
      rowString += `[${i},${j}] - Sun: ${cellData[i][j].sunLevel}, Water: ${cellData[i][j].waterLevel}`;
      if (cellData[i][j].plant != undefined) {
        rowString += `, Plant Type: ${cellData[i][j].plant!.type}, Growth Level: ${cellData[i][j].plant!.growth} |`;
      }
      rowString += "\n";
    }
    console.log(rowString);
  }
}

function updateGridData() {
  generateRandomLevels();
  printGridData();
  // autosave = saveGrid();
  // textBox.value = autosave;

  if (saveNum % 5 == 0) {
    saveGrid();
  }
  saveNum++;

  saveSlot(0);
}

// DELETE? -----------------------
/* saveButton.addEventListener("click", () => {
  undo();
}); */
//document.body.appendChild(saveButton);
/*
gridCanvas.addEventListener("click", (e) => {
  const coordX = Math.trunc(e.offsetX / tileSize);
  const coordY = Math.trunc(e.offsetY / tileSize);

  coordHelper(coordX, coordY);

  // Update grid data after the player moves
  updateGridData();
});
*/
// ---------------------------------------

const undoStack: Memento[] = [];
const redoStack: Memento[] = [];

const undoButton = document.getElementById("undoButton") as HTMLButtonElement;
const redoButton = document.getElementById("redoButton") as HTMLButtonElement;
const saveButton = document.getElementById("saveButton") as HTMLButtonElement;

const saveFiles: SaveFile[] = [];
const saveFile1 = document.getElementById("saveFile1") as HTMLButtonElement;
const saveFile2 = document.getElementById("saveFile2") as HTMLButtonElement;
const saveFile3 = document.getElementById("saveFile3") as HTMLButtonElement;

const restore1 = document.getElementById("restoreFile1") as HTMLButtonElement;
const restore2 = document.getElementById("restoreFile2") as HTMLButtonElement;
const restore3 = document.getElementById("restoreFile3") as HTMLButtonElement;

const clearSaves = document.getElementById("clearSaves") as HTMLButtonElement;
const displayGrid = document.getElementById("displayGrid") as HTMLButtonElement;

undoButton.addEventListener("click", () => {
  undo();
});

redoButton.addEventListener("click", () => {
  redo();
});

saveButton.addEventListener("click", () => {
  saveGrid();
});

saveFile1.addEventListener("click", () => {
  saveSlot(1);
});

saveFile2.addEventListener("click", () => {
  saveSlot(2);
});

saveFile3.addEventListener("click", () => {
  saveSlot(3);
});

restore1.addEventListener("click", () => {
  restoreSave(1);
});

restore2.addEventListener("click", () => {
  restoreSave(2);
});

restore3.addEventListener("click", () => {
  restoreSave(3);
});

clearSaves.addEventListener("click", () => {
  localStorage.clear();
});

displayGrid.addEventListener("click", () => {
  console.log(localStorage.getItem("grid"));
});

// Function to undo the last action
function undo() {
  const prevState = undoStack.pop();

  if (!prevState) {
    console.error("Undo stack is empty");
    return;
  }

  console.log("Undoing last action...");

  // Save the current state before undoing
  saveStateToRedoStack();

  // Restore the previous state
  restoreState(prevState);

  console.log("Undone. Current state:");
  printGridData();
}

// Function to redo the last undone action
function redo() {
  const nextState = redoStack.pop();

  if (!nextState) {
    console.error("Redo stack is empty");
    return;
  }

  console.log("Redoing last undone action...");

  // Save the current state before redoing
  saveStateToUndoStack();

  // Restore the next state
  restoreState(nextState);

  console.log("Redone. Current state:");
  printGridData();
}

// Helper function to save the current state to the undo stack
function saveStateToUndoStack() {
  undoStack.push(new Memento(
    tilemap.map((row) =>
      row.map((cell) => {
        const img = new Image();
        img.src = cell.src;
        return img;
      })
    ),
    cellData.map((row) => row.map((cell) => ({ ...cell }))),
    xyPos.slice(),
    time
  ));
}

// Helper function to save the current state to the redo stack
function saveStateToRedoStack() {
  redoStack.push(new Memento(
    tilemap.map((row) =>
      row.map((cell) => {
        const img = new Image();
        img.src = cell.src;
        return img;
      })
    ),
    cellData.map((row) => row.map((cell) => ({ ...cell }))),
    xyPos.slice(),
    time
  ));
}

// Helper function to restore a state
function restoreState(state: Memento) {
  tilemap = state.tilemap.map((row) =>
    row.map((cell) => {
      const img = new Image();
      img.src = cell.src;
      return img;
    })
  );
  cellData = state.cellData.map((row) =>
    row.map((cell) => ({ ...cell }))
  );
  xyPos = state.xyPos.slice();
  time = state.time;

  // Redraw the tilemap
  redrawTilemap();
}

// Function to save a specific grid state to localStorage
function saveSlot(slot: number) {
  saveFiles[slot] = (new SaveFile(
    tilemap.map((row) =>
      row.map((cell) => {
        return cell.src;
      })
    ),
    cellData.map((row) => row.map((cell) => ({ ...cell }))),
    xyPos.slice(),
    time,
    pastTile = pastTile,
  ));
  localStorage.setItem("save" + slot, JSON.stringify(saveFiles[slot]));
  console.log("Saved to slot" + slot + ".");
}

// Function to restore a saved grid state from localStorage
function restoreSave(slot: number) {
  const savedState = JSON.parse(localStorage.getItem("save" + slot)!);
  tilemap = savedState.tilemap.map((row: any[]) =>
    row.map((cell) => {
      const img = new Image();
      img.src = cell;
      return img;
    })
  );
  cellData = savedState.cellData.map((row: any[]) =>
    row.map((cell) => ({ ...cell }))
  );
  xyPos = savedState.xyPos.slice();
  time = savedState.time;
  pastTile = savedState.pastTile;

  // Redraw the tilemap
  redrawTilemap();
  console.log("Restored from slot" + slot + ".");
}

// ... (Your existing code)

// Modify your existing click event listener to save the state before updating the grid data
gridCanvas.addEventListener("click", (e) => {
  saveStateToUndoStack(); // Save state before updating the grid data

  const coordX = Math.trunc(e.offsetX / tileSize);
  const coordY = Math.trunc(e.offsetY / tileSize);

  coordHelper(coordX, coordY);

  // Update grid data after the player moves
  updateGridData();
});


console.log("Start")

if (localStorage.getItem("save0"))
{
  restoreSave(0);
  redrawTilemap(); 
}

// let autosave: string = "";
export let saveNum: number = 0;
// uncomment this later, abe
initGrid();
// Call updateGridData initially to set initial levels
updateGridData();

/* Select Canvas Functions (currently unused) */
// ----- Interacting with the selectable tilemap -----

// Loop through the selectable tiles and draw textures in each cell
function drawSelectCanvas() {
  for (let i = 0; i < numSelectables; i++) {
    const selectableImage = new Image();
    selectableImage.src = imageUrls[i];
    drawTexture(
      0,
      i,
      selectCtx,
      selectableImage,
      selectCanvas.width,
      selectHeight,
      64
    );
  }
}