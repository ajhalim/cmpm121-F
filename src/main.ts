/* Main code for the program */
import "./style.css";
import { Plant } from "./plants";
import { Memory } from "./memory"; // Import the Memory class [F1.a]
import { UndoRedo } from "./undoRedo"; // Import the UndoRedo class [F1.b]
import { Memento, SaveFile } from "./Memento"; // Import Mementos and SaveFiles [F1.b & F1.c]
// import { SaveGame } from "./saveGame"; // Import the SaveGame class [F1.c]
import { AutoSave } from "./autoSave"; // Import the AutoSave class [F1.d]

/* GRAPHICS -------------------- */
// Setting up the multiple canvases
const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
const gridCtx = gridCanvas.getContext("2d") as CanvasRenderingContext2D;

// Defining the textures used
const imageUrls = [
    "/tile1.png",
    "/tile2.png",
    "/tile3.png",
    "/tile4.png",
    "/tile5.png",
    "/tile6.png",
    "/tile7.png",
    "/tile8.png"
];

// Setting up images for background and player
const backgroundImage = new Image();
backgroundImage.src = "./background.png"; // setting the source of the bg img

const playerImage = [
    "./player.png"
]

// Draw the background image
backgroundImage.onload = () => {
    gridCtx.drawImage(backgroundImage, 0, 0, gridCanvas.width, gridCanvas.height);
    
    // Draw the tilemap on top of the background
    for (let i = 0; i < numTiles; i++) {
        for (let j = 0; j < numTiles; j++) {
            drawTexture(i, j, gridCtx, tilemap[i][j], gridCanvas.width / numTiles, gridCanvas.height / numTiles, tileSize);
        }
    }
};

// Defining the size of the main grid
export const numTiles = 10;
const tileSize = gridCanvas.width / numTiles;

// Creating the 2D nested array tilemap
let tilemap: HTMLImageElement[][] = new Array(numTiles);
for(let i = 0; i < numTiles; i++) {
    let row = new Array(numTiles);
    for (let j = 0; j < numTiles; j++) {
        row[j] = new Image();
        row[j].src = "/tile1.png";
    }
    tilemap[i] = row;
}

// Drawing the initial canvases
redrawTilemap();

// Function that draws a texture to a specific canvas ctx
function drawTexture(row: number, col: number, ctx: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number, cellSize: number) {
    image.onload = () => {
        ctx.drawImage(image, row * cellSize, col * cellSize, width, height)
    };
    ctx.drawImage(image, row * cellSize, col * cellSize, width, height)
}

// Interacting with the main tilemap
function redrawTilemap() {
    gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

    // Draw the background image
    gridCtx.drawImage(backgroundImage, 0, 0, gridCanvas.width, gridCanvas.height);

    // Draw the tilemap on top of the background
    for (let i = 0; i < numTiles; i++) {
        for (let j = 0; j < numTiles; j++) {
            drawTexture(i, j, gridCtx, tilemap[i][j], gridCanvas.width / numTiles, gridCanvas.height / numTiles, tileSize);
        }
    }
}

/* GAME LOGIC -------------------- */
// Data structure storing the data of sun and water level
export interface CellData {
    sunLevel: number;
    waterLevel: number;
}

// Data structure storing the overall data, including plant type
export interface Cell {
    weather: CellData;
    plant: Plant;
}

// Initializing variables used
let lastXPos: number;
let lastYPos: number;
let pastTile: string = "nothing";

export let xyPos: number[] = [0, 0]; // Initialize xyPos with default values
export let time: number = 0;
export let harvestTotal = 0;

// Can change the names of the types later //
const plantTypes = ["species1", "species2", "species3"];
const undoStack: Memento[] = [];
const redoStack: Memento[] = [];
const saveFiles: SaveFile[] = [];

// Initialize the cellData array
let cellData: CellData[][] = new Array(numTiles);
for (let i = 0; i < numTiles; i++) {
    let row = new Array(numTiles);
    for (let j = 0; j < numTiles; j++) {
        row[j] = { sunLevel: 0, waterLevel: 0 };
    }
    cellData[i] = row;
}

// Initialize the array of cells
let cells: Cell[][] = new Array(numTiles);
for (let i = 0; i < numTiles; i++) {
    let row = new Array(numTiles);
    for (let j = 0; j < numTiles; j++) {
        row[j] = {weather: cellData[i][j], plant: new Plant("none", 0, 0)};
    }
    cells[i] = row;
}

export function coordHelper(xPos: number, yPos: number) {
    /* helper function that makes sure to reset the tile that the player moves from to the img
    it was before the player moved onto it.*/
    console.log("Player moved to:", `[${xPos},${yPos}]`);

    if(pastTile != "nothing"){
        lastXPos = xyPos[0];
        lastYPos = xyPos[1];
        tilemap[lastXPos][lastYPos].src = pastTile;
    }

    pastTile = tilemap[xPos][yPos].src;
    tilemap[xPos][yPos].src = playerImage[0];
    xyPos = [xPos, yPos];

    redrawTilemap();
    return xyPos;
}

function isAdjacent(xPos: number, yPos: number) {
    /* Helper function to test if given coordinate is adjacent to the player */
    return ((xPos >= (xyPos[0]-1) && xPos <=(xyPos[0]+1)) && (yPos >= (xyPos[1]-1) && yPos <=(xyPos[1]+1)));
}

function sow(xPos: number, yPos: number) {
    cells[xPos][yPos].plant!.type = plantTypes[Math.floor(Math.random() * plantTypes.length)];
    cells[xPos][yPos].plant!.growth = 1;
    cells[xPos][yPos].plant!.water = 0;
    const plantType = plantTypes.indexOf(cells[xPos][yPos].plant!.type);
    tilemap[xPos][yPos].src = imageUrls[plantType+1];
    console.log("planted a " + cells[xPos][yPos].plant!.type);
    // saveStateToUndoStack();
}

function reap(xPos: number, yPos: number) {
    console.log("harvested a " + cells[xPos][yPos].plant!.type + " at level: " + cells[xPos][yPos].plant!.growth);
    tilemap[xPos][yPos].src = imageUrls[0];
    cells[xPos][yPos].plant.resetPlant();
    harvestTotal++;
    if (harvestTotal==10) {
        console.log("You won!");
    }
    // saveStateToUndoStack();
}

function printGridData() {
    console.log("Time passed: " + time);
    console.log("Grid Cells - Sun, Water, Plant Type, and Growth Level:");
    for (let i = 0; i < numTiles; i++) {
        let rowString = "";
        for (let j = 0; j < numTiles; j++) {
        rowString += `[${i},${j}] - Sun: ${cells[i][j].weather.sunLevel}, Water: ${cells[i][j].weather.waterLevel}`
        if (cells[i][j].plant != undefined) {
            rowString += `, Plant Type: ${cells[i][j].plant?.type}, Growth Level: ${cells[i][j].plant?.growth} |`;
        }
        rowString += "\n";
    }
        console.log(rowString);
    }
}

function generateRandomLevels() {
    for (let i = 0; i < numTiles; i++) {
      for (let j = 0; j < numTiles; j++) {
        const currCell = cells[i][j];
        // Generate random levels (you can adjust the range based on your requirements)
        currCell.weather.sunLevel = Math.floor(Math.random() * 100);
        currCell.weather.waterLevel += Math.floor(Math.random() * 100);
        currCell.plant.advanceTime(currCell.weather.sunLevel, currCell.weather.waterLevel);
      }
    }
  }

// Update the event listeners
function updateGridData() {
    generateRandomLevels();
    printGridData();
    redrawTilemap();
    
    saveSlot(0);
    // AutoSave.saveAuto(cellData); // Save the updated state to the auto-save
    Memory.saveState(cellData); // Save the current state to the memory
    UndoRedo.saveMemoryState(); // Update undo/redo history
}

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
        cells.map((row) => row.map((cell) => ({ ...cell }))),
        cellData.map((row) => row.map((cell) => ({ ...cell}))),
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
        cells.map((row) => row.map((cell) => ({ ...cell }))),
        cellData.map((row) => row.map((cell) => ({ ...cell}))),
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
    cells = state.cells.map((row) =>
    row.map((cell) => ({ ...cell }))
    );
    xyPos = state.xyPos.slice();
    time = state.time;
    for (let i = 0; i < numTiles; i++) {
        for (let j = 0; j < numTiles; j++) {
            cells[i][j].weather = cellData[i][j];
        }
    }

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
        cells.map((row) => row.map((cell) => ({ ...cell }))),
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
    cells = savedState.cells.map((row: any[]) =>
    row.map((cell) => ({ ...cell }))
    );
    xyPos = savedState.xyPos.slice();
    time = savedState.time;
    pastTile = savedState.pastTile;
    for (let i = 0; i < numTiles; i++) {
        for (let j = 0; j < numTiles; j++) {
            cells[i][j].weather = cellData[i][j];
            const {type, growth, water} = cells[i][j].plant;
            cells[i][j].plant = new Plant(type, growth, water); 
        }
    }

    // Redraw the tilemap
    redrawTilemap();
    console.log("Restored from slot" + slot + ".");
}

// // Manual save functionality
// function manualSave(slotNumber: number) {
//     try {
//         // Save the game to the specified slot using the SaveGame class
//         SaveGame.saveGame(cellData.map(row => row.map(cell => ({ ...cell }))), slotNumber - 1);
//         console.log(`Game saved to slot ${slotNumber} manually!`);
//     } catch (error) {
//         console.error(`Failed to save game to slot ${slotNumber}:`, error);
//     }
// }

// // Manual load functionality
// function manualLoad(slotNumber: number) {
//     try {
//         // Load the game state from the specified slot using the SaveGame class
//         const loadedState = SaveGame.loadGame(slotNumber - 1);

//         if (loadedState !== null) {
//             // Update the current cellData with the loaded state
//             cellData = loadedState;

//             // Redraw the tilemap to reflect the changes
//             redrawTilemap();

//             console.log(`Game loaded from slot ${slotNumber} manually!`);
//         } else {
//             console.error(`No saved game found in slot ${slotNumber}.`);
//         }
//     } catch (error) {
//         console.error(`Failed to load game from slot ${slotNumber}:`, error);
//     }
// }

// Function that loads auto-save
function loadAutoSave() {
    try {
        // Load the auto-save state using the AutoSave class
        // const autoSavedState = AutoSave.loadAuto();
        restoreSave(0);
        redrawTilemap();
        console.log("Auto-save loaded successfully.");

    //     if (autoSavedState !== null) {
    //         // Check if the loaded state matches the current state
    //         const isMatch = compareStates(autoSavedState, cellData);

    //         if (isMatch) {
    //             // Update the current cellData with the loaded state
    //             cellData = autoSavedState;

    //             // Redraw the tilemap to reflect the changes
    //             redrawTilemap();

    //             console.log("Auto-save loaded successfully.");
    //         } else {
    //             console.log("Auto-save does not match the current state. Ignoring...");
    //         }
    //     } else {
    //         console.log("No auto-save found.");
    //     }
    } catch (error) {
        console.error("Failed to load auto-save:", error);
    }
}

// Helper function for the Auto save
function checkAutoSaveOnLaunch() {
    // Rest of the function remains unchanged
    // const autoSavedState = AutoSave.loadAuto();
    // if (autoSavedState !== null) {
    if (localStorage.getItem("save0")) {
        const continueGame = confirm("Would you like to continue where you left off?");
        if (continueGame) {
            // cellData = autoSavedState;
            restoreSave(0);
            redrawTilemap();
            printGridData();
            console.log("Auto-save loaded.");
        } else {
            console.log("Auto-save exists, but the player chose not to continue.");
        }
    } else {
        console.log("No auto-save found.");
        // Set initial levels without previous save
        updateGridData();
    }
}

// Helper function to compare two states
// function compareStates(state1: CellData[][], state2: CellData[][]): boolean {
//     for (let i = 0; i < state1.length; i++) {
//         for (let j = 0; j < state1[i].length; j++) {
//             const cell1 = state1[i][j];
//             const cell2 = state2[i][j];

//             if (
//                 cell1.sunLevel !== cell2.sunLevel ||
//                 cell1.waterLevel !== cell2.waterLevel
//             ) {
//                 return false;
//             }
//         }
//     }

//     return true;
// }

// // Helper function to compare two plant objects
// function comparePlants(plant1: Plant | undefined, plant2: Plant | undefined): boolean {
//     if (!plant1 && !plant2) {
//         return true;
//     }

//     if (!plant1 || !plant2) {
//         return false;
//     }

//     return (
//         plant1.type === plant2.type &&
//         plant1.growth === plant2.growth
//     );
// }

/* Editing to directly reference the buttons already created on the grid! */
// Buttons for Save and Load
for (let i = 1; i <= 3; i++) {
    const saveButton = document.getElementById("save-"+i)!;
    saveButton.addEventListener("click", () => {
        saveSlot(i);
        // checkSaveAndLoad();
    });

    const loadButton = document.getElementById("load-"+i)!;
    loadButton.addEventListener("click", () => {
        restoreSave(i);
        // checkSaveAndLoad();
    });
}

// Button for the auto-save load
const autoSaveButton = document.getElementById("load-auto")!;
if (autoSaveButton) {
    autoSaveButton.addEventListener("click", loadAutoSave);

    autoSaveButton.addEventListener("click", () => {
        const autoSavedState = AutoSave.loadAuto();
        if (autoSavedState !== null) {
            cellData = autoSavedState;
            redrawTilemap();
            console.log("Auto-save loaded.");
        } else {
            console.log("No auto-save found.");
        }
        // checkSaveAndLoad();
    });
}

const clearSavesButton = document.getElementById("clear-saves")!;
clearSavesButton.addEventListener("click", () => {
    localStorage.clear();
    console.log("Saves cleared!");
});

const undoButton = document.getElementById("undo")!;
undoButton.addEventListener("click", () => {
    undo();
});

const redoButton = document.getElementById("redo")!;
redoButton.addEventListener("click", () => {
    redo();
});

// remove the context menu
gridCanvas.addEventListener("contextmenu", event => {
    event.preventDefault();
});

gridCanvas.onauxclick = (e) => {
    const coordX = Math.trunc(e.offsetX / tileSize);
    const coordY = Math.trunc(e.offsetY / tileSize);

    if (isAdjacent(coordX, coordY)) {
        if (tilemap[coordX][coordY].src.includes(imageUrls[0])) {
            sow(coordX, coordY);
        }
        else {
            if (!(tilemap[coordX][coordY].src.includes("player")) && cells[coordX][coordY].plant!.growth > 1) {
                reap(coordX, coordY);
            }
        } 
    }
};

gridCanvas.addEventListener("click", (e) => {
    saveStateToUndoStack(); // Record movement

    const coordX = Math.trunc(e.offsetX / tileSize);
    const coordY = Math.trunc(e.offsetY / tileSize);

    coordHelper(coordX, coordY);
    time++;
    updateGridData(); // Update grid data after the player moves
});

// START --------------------
// Call checkAutoSaveOnLaunch after cellData is initialized
checkAutoSaveOnLaunch();

// Initialize memory for the grid
Memory.initializeGrid(numTiles);

// Save the initial state to the memory after the grid is initialized
Memory.saveState(cellData);