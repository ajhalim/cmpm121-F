// Main code for the program
import "./style.css";
import { Plant } from "./plants";

import { Memory } from "./memory"; // Import the Memory class [F1.a]
import { UndoRedo } from "./undoRedo"; // Import the UndoRedo class [F1.b]
import { SaveGame } from "./saveGame"; // Import the SaveGame class [F1.c]
import { AutoSave } from "./autoSave"; // Import the AutoSave class [F1.d]

// Setting up the multiple canvases
const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
const gridCtx = gridCanvas.getContext("2d") as CanvasRenderingContext2D;

const selectCanvas = document.getElementById("selectCanvas") as HTMLCanvasElement;
const selectCtx = selectCanvas.getContext("2d") as CanvasRenderingContext2D;

// Data structure storing the data of sun and water level
interface CellData {
    sunLevel: number;
    waterLevel: number;
    plant?: Plant;
}

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

const playerImage = [
    "./player.png"
]

// Defining the size of the main grid
const numTiles = 10;
const tileSize = gridCanvas.width / numTiles;

// Initialize memory for the grid
Memory.initializeGrid(numTiles);

// UndoRedo, SaveGame, Autosave Initialization
//const undoRedo = new UndoRedo();
// const saveGame = new SaveGame();
// const autoSave = new AutoSave();

// Helper function for the Auto save
function checkAutoSaveOnLaunch() {
    // Rest of the function remains unchanged
    const autoSavedState = AutoSave.loadAuto();
    if (autoSavedState !== null) {
        const continueGame = confirm("Would you like to continue where you left off?");
        if (continueGame) {
            cellData = autoSavedState;
            redrawTilemap();
            console.log("Auto-save loaded.");
        } else {
            console.log("Auto-save exists, but the player chose not to continue.");
        }
    } else {
        console.log("No auto-save found.");
    }
}

// Defining the size of the select grid
const numSelectables = imageUrls.length;
const selectHeight = selectCanvas.height / numSelectables;

// Initializing variables used
let lastXPos: number;
let lastYPos: number;
let pastTile: string = "nothing";

let xyPos: number[];
let time: number = 0;

// Can change the names of the types later //
const plantTypes = ["species1", "species2", "species3"];
let harvestTotal = 0;

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
drawSelectCanvas();

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
    for (let i = 0; i < numTiles; i++) {
        for (let j = 0; j < numTiles; j++) {
            drawTexture(i, j, gridCtx, tilemap[i][j], gridCanvas.width / numTiles, gridCanvas.height / numTiles, tileSize);
        }
    }
}

// Game logic
export function coordHelper(xPos: number, yPos: number) {
    /* if-statement makes sure to reset the tile that the player moves from to the img
    it was before the player moved onto it.*/
    console.log("Coordinate Helper - Player moved to:", `[${xPos},${yPos}]`); // Chceck

    if(pastTile != "nothing"){
        lastXPos = xyPos[0];
        lastYPos = xyPos[1];
        tilemap[lastXPos][lastYPos].src = pastTile;
    }

    pastTile = tilemap[xPos][yPos].src;
    tilemap[xPos][yPos].src = playerImage[0];
    xyPos = [xPos, yPos];
    
    redrawTilemap();
    time++;

    updateGridData(); // Update grid data after the player moves
    AutoSave.saveAuto(cellData); // Save the updated state to the auto-save
    Memory.saveState(cellData); // Save the current state to the memory
    UndoRedo.saveState(); // Update undo/redo history

    return xyPos;
}

gridCanvas.onauxclick = (e) => {
    e.preventDefault();

    const coordX = Math.trunc(e.offsetX / tileSize);
    const coordY = Math.trunc(e.offsetY / tileSize);

    /* Can only plant on squares adjacent to the player that haven't already been planted. */
    if (coordX >= (xyPos[0]-1) && coordX <=(xyPos[0]+1)) {
        if (coordY >= (xyPos[1]-1) && coordY <=(xyPos[1]+1)) {
            if (tilemap[coordX][coordY].src.includes(imageUrls[0])) {
                cellData[coordX][coordY].plant = new Plant(plantTypes[Math.floor(Math.random() * plantTypes.length)], 1, 0);
                const plantType = plantTypes.indexOf(cellData[coordX][coordY].plant!.type);
                tilemap[coordX][coordY].src = imageUrls[plantType+1];
                console.log("planted a " + cellData[coordX][coordY].plant!.type);
            }
            else {
                if (!(tilemap[coordX][coordY].src.includes("player")) && cellData[coordX][coordY].plant!.growth > 1) {
                    console.log("harvested a " + cellData[coordX][coordY].plant!.type + " at level: " + cellData[coordX][coordY].plant!.growth);
                    tilemap[coordX][coordY].src = imageUrls[0];
                    cellData[coordX][coordY].plant = undefined;
                    harvestTotal++;
                    if (harvestTotal==10) {
                        console.log("You won!");
                    }
                }
                
            }
        }
    }

};

// Initialize the cellData array
let cellData: CellData[][] = new Array(numTiles);
for (let i = 0; i < numTiles; i++) {
    let row = new Array(numTiles);
    for (let j = 0; j < numTiles; j++) {
        row[j] = { sunLevel: 0, waterLevel: 0 };
    }
    cellData[i] = row;
}

// Call checkAutoSaveOnLaunch after cellData is initialized
checkAutoSaveOnLaunch();

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
        rowString += `[${i},${j}] - Sun: ${cellData[i][j].sunLevel}, Water: ${cellData[i][j].waterLevel}`
        if (cellData[i][j].plant != undefined) {
            rowString += `, Plant Type: ${cellData[i][j].plant?.type}, Growth Level: ${cellData[i][j].plant?.growth} |`;
        }
        rowString += "\n";
    }
        console.log(rowString);
    }
}

// Updayte the event listenrs
function updateGridData() {
    generateRandomLevels();
    printGridData();
    
    Memory.saveState(cellData); // Save the current state to the memory
    UndoRedo.saveState(); // Update undo/redo history
}
  
gridCanvas.addEventListener("click", (e) => {
    const coordX = Math.trunc(e.offsetX / tileSize);
    const coordY = Math.trunc(e.offsetY / tileSize);

    coordHelper(coordX, coordY);

    updateGridData(); // Update grid data after the player moves
    AutoSave.saveAuto(cellData); // Save the updated state to the auto-save
    Memory.saveState(cellData); // Save the current state to the memory
    UndoRedo.saveState(); // Update undo/redo history
});

// Manual save functionality
function manualSave(slotNumber: number) {
    try {
        // Save the game to the specified slot using the SaveGame class
        SaveGame.saveGame(cellData.map(row => row.map(cell => ({ ...cell }))), slotNumber - 1);
        console.log(`Game saved to slot ${slotNumber} manually!`);
    } catch (error) {
        console.error(`Failed to save game to slot ${slotNumber}:`, error);
    }
}

// Manual load functionality
function manualLoad(slotNumber: number) {
    try {
        // Load the game state from the specified slot using the SaveGame class
        const loadedState = SaveGame.loadGame(slotNumber - 1);

        if (loadedState !== null) {
            // Update the current cellData with the loaded state
            cellData = loadedState;

            // Redraw the tilemap to reflect the changes
            redrawTilemap();

            console.log(`Game loaded from slot ${slotNumber} manually!`);
        } else {
            console.error(`No saved game found in slot ${slotNumber}.`);
        }
    } catch (error) {
        console.error(`Failed to load game from slot ${slotNumber}:`, error);
    }
}

// Container for buttons
const buttonContainer = document.createElement("div");
buttonContainer.style.position = "absolute";
buttonContainer.style.bottom = "0";
buttonContainer.style.left = "0";
buttonContainer.style.display = "flex";
buttonContainer.style.flexDirection = "row"; // Change to row direction
document.body.appendChild(buttonContainer);

// Buttons for manual save and load
for (let i = 1; i <= 3; i++) {
    const saveButton = createButton(`Save ${i}`, `save-${i}`);
    saveButton.addEventListener("click", () => {
        manualSave(i);
        // checkSaveAndLoad();
    });
    buttonContainer.appendChild(saveButton);

    const loadButton = createButton(`Load ${i}`, `load-${i}`);
    loadButton.addEventListener("click", () => {
        manualLoad(i);
        // checkSaveAndLoad();
    });
    buttonContainer.appendChild(loadButton);
}

// Button for the auto-save load
const autoSaveButton = createButton("Load Auto", "load-auto");
autoSaveButton.addEventListener("click", loadAutoSave);
buttonContainer.appendChild(autoSaveButton);

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
buttonContainer.appendChild(autoSaveButton);

function createButton(text: string, id: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.textContent = text;
    button.style.width = "100px";
    button.style.height = "40px";
    button.style.marginRight = "10px"; // Adding a margin between buttons
    button.id = id;
    return button;
}

// Function that loads auto-save
function loadAutoSave() {
    try {
        // Load the auto-save state using the AutoSave class
        const autoSavedState = AutoSave.loadAuto();

        if (autoSavedState !== null) {
            // Check if the loaded state matches the current state
            const isMatch = compareStates(autoSavedState, cellData);

            if (isMatch) {
                // Update the current cellData with the loaded state
                cellData = autoSavedState;

                // Redraw the tilemap to reflect the changes
                redrawTilemap();

                console.log("Auto-save loaded successfully.");
            } else {
                console.log("Auto-save does not match the current state. Ignoring...");
            }
        } else {
            console.log("No auto-save found.");
        }
    } catch (error) {
        console.error("Failed to load auto-save:", error);
    }
}

// Helper function to compare two states
function compareStates(state1: CellData[][], state2: CellData[][]): boolean {
    for (let i = 0; i < state1.length; i++) {
        for (let j = 0; j < state1[i].length; j++) {
            const cell1 = state1[i][j];
            const cell2 = state2[i][j];

            if (
                cell1.sunLevel !== cell2.sunLevel ||
                cell1.waterLevel !== cell2.waterLevel ||
                !comparePlants(cell1.plant, cell2.plant)
            ) {
                return false;
            }
        }
    }

    return true;
}

// Helper function to compare two plant objects
function comparePlants(plant1: Plant | undefined, plant2: Plant | undefined): boolean {
    if (!plant1 && !plant2) {
        return true;
    }

    if (!plant1 || !plant2) {
        return false;
    }

    return (
        plant1.type === plant2.type &&
        plant1.growth === plant2.growth
    );
}


// Call updateGridData initially to set initial levels
updateGridData();

// Save the initial state to the memory after the grid is initialized
Memory.saveState(cellData);

/* Select Canvas Functions (currently unused) Interacting with the selectable tilemap
Loop through the selectable tiles and draw textures in each cell */
function drawSelectCanvas() {
    for (let i = 0; i < numSelectables; i++) {
        const selectableImage = new Image();
        selectableImage.src = imageUrls[i];
        drawTexture(0, i, selectCtx, selectableImage, selectCanvas.width, selectHeight, 64);
    }
}

// Save the current state to the memory
Memory.saveState(cellData);