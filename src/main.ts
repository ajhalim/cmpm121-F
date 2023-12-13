import "./style.css";
import { Plant, PlantType } from "./plants";
import { Memento, SaveFile } from "./Memento";
import { initGrid, saveGrid } from "./saveFunction";
import { reader, generateEventLevels } from "./externalStuff";
import data from "../languages.json" assert { type: "json" };

//reader();

// Setting up the main canvas
const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
const gridCtx = gridCanvas.getContext("2d") as CanvasRenderingContext2D;

// Data structure storing the data of sun and water level
export interface CellData {
  sunLevel: number;
  waterLevel: number;
  plant?: Plant;
  cellTime: number;
}

//Problem area
/* const inputElement = document.getElementById("input") as HTMLElement;
inputElement.addEventListener("change", handleFiles, false);
function handleFiles() {
  const fileList = this.files;
} */

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

let lastXPos: number;
let lastYPos: number;
let pastTile: string = "nothing";
let langu: string = "EN";

export let xyPos: number[] = [0, 0]; // Initialize xyPos with default values
export let time: number = 0;

// Can change the names of the types later
const plantTypes: PlantType[] = ["species1", "species2", "species3"];
let harvestTotal = 0;
let harvestWin = 5;

//let test = reader();

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

// draw the initial canvas
redrawTilemap();

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

  if (pastTile != "nothing") {
    lastXPos = xyPos[0];
    lastYPos = xyPos[1];
    tilemap[lastXPos][lastYPos].src = pastTile;
  }

  pastTile = tilemap[xPos][yPos].src;
  tilemap[xPos][yPos].src = playerImage[0];
  xyPos = [xPos, yPos];

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
          if (harvestTotal == harvestWin) {
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
textBox.value = "left click to move, right click to sow/reap";
textBox.id = "nameInput";
document.getElementsByTagName("body")[0].appendChild(textBox);

export let cellData: CellData[][] = new Array(numTiles);
for (let i = 0; i < numTiles; i++) {
  let row = new Array(numTiles);
  for (let j = 0; j < numTiles; j++) {
    row[j] = { sunLevel: 0, waterLevel: 0, cellTime: 0};
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
      currCell.cellTime += 1;

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
      rowString += `[${i},${j}] - Sun: ${cellData[i][j].sunLevel}, Water: ${cellData[i][j].waterLevel}, Time: ${cellData[i][j].cellTime}`;
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
  //generateEventLevels(test.event1Start, test.event1Sun, test.event1Water);
  //generateEventLevels(test.event2Start, test.event2Sun, test.event2Water);
  //generateEventLevels(test.event3Start, test.event3Sun, test.event3Water);
  printGridData();

  if (saveNum % 5 == 0) {
    saveGrid();
  }
  saveNum++;

  saveSlot(0);
}

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

const language = document.getElementById("language") as HTMLButtonElement;

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

language.addEventListener("click", () => {
  translate();
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

//Bellow is abe's nonsense
//============================
// Add event listener for the read code button
const readCodeButton = document.getElementById("readCodeButton") as HTMLButtonElement;
readCodeButton.addEventListener("click", () => {
  readCode();
});

// Function to handle reading code from the file input
function readCode() {
  const inputElement = document.getElementById("input") as HTMLInputElement;
  const fileList = inputElement.files;

  if (fileList && fileList.length > 0) {
    const file = fileList[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const code = event.target?.result as string;
      const test = JSON.stringify(code);
      console.log("Read code:", test);
      // You can do anything with the code, Im just printing it in the console rn
    };

    if (file.type === "application/json") {
      reader.readAsText(file);
      
      //reader.
    } else {
      // Display an error message to the user
      console.error("Invalid file type. Please upload a valid HTML, JSON, or text file.");
    }
  }
}

function translate() {
  if (langu == "AR") {
    document.getElementById("language")!.innerHTML = data.AR.language;
    document.getElementById("undoButton")!.innerHTML = data.AR.undoButton;
    document.getElementById("redoButton")!.innerHTML = data.AR.redoButton;
    document.getElementById("saveButton")!.innerHTML = data.AR.saveButton;
    document.getElementById("saveFile1")!.innerHTML = data.AR.saveFile1;
    document.getElementById("saveFile2")!.innerHTML = data.AR.saveFile2;
    document.getElementById("saveFile3")!.innerHTML = data.AR.saveFile3;
    document.getElementById("restoreFile1")!.innerHTML = data.AR.restoreFile1;
    document.getElementById("restoreFile2")!.innerHTML = data.AR.restoreFile2;
    document.getElementById("restoreFile3")!.innerHTML = data.AR.restoreFile3;
    document.getElementById("clearSaves")!.innerHTML = data.AR.clearSaves;
    document.getElementById("displayGrid")!.innerHTML = data.AR.displayGrid;
    document.getElementById("readCodeButton")!.innerHTML =data.AR.readCodeButton;
    console.log("EN")
    langu = "EN";
    return;
  }else if(langu == "EN" ) {
    document.getElementById("language")!.innerHTML = data.EN.language;
    document.getElementById("undoButton")!.innerHTML = data.EN.undoButton;
    document.getElementById("redoButton")!.innerHTML = data.EN.redoButton;
    document.getElementById("saveButton")!.innerHTML = data.EN.saveButton;
    document.getElementById("saveFile1")!.innerHTML = data.EN.saveFile1;
    document.getElementById("saveFile2")!.innerHTML = data.EN.saveFile2;
    document.getElementById("saveFile3")!.innerHTML = data.EN.saveFile3;
    document.getElementById("restoreFile1")!.innerHTML = data.EN.restoreFile1;
    document.getElementById("restoreFile2")!.innerHTML = data.EN.restoreFile2;
    document.getElementById("restoreFile3")!.innerHTML = data.EN.restoreFile3;
    document.getElementById("clearSaves")!.innerHTML = data.EN.clearSaves;
    document.getElementById("displayGrid")!.innerHTML = data.EN.displayGrid;
    document.getElementById("readCodeButton")!.innerHTML =data.EN.readCodeButton;
    console.log("AR")
    langu = "AR";
    return;
  }
}
//Above is abe's nonsense
//============================


console.log("Start")

if (localStorage.getItem("save0"))
{
  restoreSave(0);
  redrawTilemap(); 
}

if(reader != null && time == 0){

  //harvestWin = test.winCond;
  //coordHelper(test.playerPos[0], test.playerPos[1]);

  console.log(harvestWin);
}

export let saveNum: number = 0;
// uncomment this later, abe
initGrid();
// Call updateGridData initially to set initial levels
updateGridData();