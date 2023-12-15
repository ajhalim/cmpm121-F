/* Main code for the program */
import "./style.css";
import { Plant } from "./plants";
import { Memory } from "./memory"; // Import the Memory class [F1.a]
import { UndoRedo } from "./undoRedo"; // Import the UndoRedo class [F1.b]
import { SaveGame } from "./saveGame"; // Import the SaveGame class [F1.c & F1.d]
import { reader, generateEventLevels } from "./externalStuff";
import data from "../languages.json" assert { type: "json" };
import { PlantDSL } from "./internalDSL";

/* GRAPHICS -------------------- */
// Setting up the multiple canvases
const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
const gridCtx = gridCanvas.getContext("2d") as CanvasRenderingContext2D;

let langu: string = "EN";

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

const roseUrls = [
    "/rose1.png",
    "/rose2.png",
    "/rose3.png",
]

const whiteUrls = [
    "/white1.PNG",
    "/white2.PNG",
    "/white3.PNG",
]

const yellowUrls = [
    "/yellow1.png",
    "/yellow2.png",
    "/yellow3.png",
]

const plantUrls = [
    roseUrls,
    whiteUrls, 
    yellowUrls
]

reader();
let test = reader();

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
let xyPos: number[] = [0, 0]; // Initialize xyPos with default values
export let time: number = 0;
let harvestTotal = 0;

const plantTypes = ["rose", "white", "yellow"];

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
export let cells: Cell[][] = new Array(numTiles);
for (let i = 0; i < numTiles; i++) {
    let row = new Array(numTiles);
    for (let j = 0; j < numTiles; j++) {
        row[j] = {weather: cellData[i][j], plant: new Plant("none", 0, 0, [i, j])};
    }
    cells[i] = row;
}

/* helper function that makes sure to reset the tile that the player moves from to the img
    it was before the player moved onto it, and then to assign the player img to the new tile.*/
function coordHelper(xPos: number, yPos: number) {
    console.log("Player moved to:", `[${xPos},${yPos}]`);

    if (pastTile != "nothing") {
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

/* Helper function to test if given coordinate is adjacent to the player */
function isAdjacent(xPos: number, yPos: number) {
    return ((xPos >= (xyPos[0]-1) && xPos <=(xyPos[0]+1)) && (yPos >= (xyPos[1]-1) && yPos <=(xyPos[1]+1)));
}

function sow(xPos: number, yPos: number) {
    const plantType = plantTypes[Math.floor(Math.random() * plantTypes.length)];
    cells[xPos][yPos].plant!.type = plantType;
    cells[xPos][yPos].plant!.growth = 1;
    cells[xPos][yPos].plant!.water = 0;
    tilemap[xPos][yPos].src = plantUrls[plantTypes.indexOf(cells[xPos][yPos].plant!.type)][cells[xPos][yPos].plant!.growth-1];
    console.log("planted a " + cells[xPos][yPos].plant!.type);
    UndoRedo.saveStateToUndoStack(cells, cellData, tilemap, xyPos, time, harvestTotal);
}

function reap(xPos: number, yPos: number) {
    console.log("harvested a " + cells[xPos][yPos].plant!.type + " at level: " + cells[xPos][yPos].plant!.growth);
    tilemap[xPos][yPos].src = imageUrls[0];
    cells[xPos][yPos].plant.resetPlant();
    harvestTotal++;
    if (harvestTotal==10) {
        console.log("You won!");
    }
    UndoRedo.saveStateToUndoStack(cells, cellData, tilemap, xyPos, time, harvestTotal);
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

// Generate random levels (you can adjust the range based on your requirements)
function generateRandomLevels() {
    for (let i = 0; i < numTiles; i++) {
      for (let j = 0; j < numTiles; j++) {
        const currCell = cells[i][j];
        
        currCell.weather.sunLevel = Math.floor(Math.random() * 100);
        currCell.weather.waterLevel += Math.floor(Math.random() * 100);
        currCell.plant.advanceTime(currCell.weather.sunLevel, currCell.weather.waterLevel);
        if (currCell.plant.type != "none") {
            tilemap[i][j].src = plantUrls[plantTypes.indexOf(currCell.plant!.type)][currCell.plant!.growth-1];
        }
      }
    }
  }

// Update the grid data
function updateGridData() {
    generateRandomLevels();
    generateEventLevels(test.event1Start, test.event1Sun, test.event1Water);
    generateEventLevels(test.event2Start, test.event2Sun, test.event2Water);
    generateEventLevels(test.event3Start, test.event3Sun, test.event3Water);
    printGridData();
    redrawTilemap();
    
    SaveGame.saveSlot(0, cells, cellData, tilemap, xyPos, time, harvestTotal, pastTile);
    Memory.saveState(cellData); // Save the current state to the memory
    UndoRedo.saveMemoryState(); // Update undo/redo history
}

// Function that loads auto-save
function loadAutoSave() {
    try {
        // Load the auto-save state using the AutoSave class
        ({cells, cellData, tilemap, xyPos, time, harvestTotal, pastTile} = SaveGame.restoreSave(0, cells, cellData, tilemap, xyPos, time, harvestTotal, pastTile));
        Memory.saveState(cellData); // Save the current state to the memory
        UndoRedo.saveMemoryState(); // Update undo/redo history
        redrawTilemap();
        printGridData();
        console.log("Auto-save loaded successfully.");
    } catch (error) {
        console.error("Failed to load auto-save:", error);
    }
}

// Helper function for the Auto save
function checkAutoSaveOnLaunch() {
    if (localStorage.getItem("save0")) {
        const continueGame = confirm("Would you like to continue where you left off?");
        if (continueGame) {
            loadAutoSave();
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

/* Editing to directly reference the buttons already created on the grid! */
// Buttons for Save and Load
for (let i = 1; i <= 3; i++) {
    const saveButton = document.getElementById("save-"+i)!;
    saveButton.addEventListener("click", () => {
        SaveGame.saveSlot(i, cells, cellData, tilemap, xyPos, time, harvestTotal, pastTile);
    });

    const loadButton = document.getElementById("load-"+i)!;
    loadButton.addEventListener("click", () => {
        ({cells, cellData, tilemap, xyPos, time, harvestTotal, pastTile} = SaveGame.restoreSave(i, cells, cellData, tilemap, xyPos, time, harvestTotal, pastTile));
        redrawTilemap();
    });
}

// Button for the auto-save load
const autoSaveButton = document.getElementById("loadAuto")!;
autoSaveButton.addEventListener("click", loadAutoSave);

const clearSavesButton = document.getElementById("clear-saves")!;
clearSavesButton.addEventListener("click", () => {
    localStorage.clear();
    UndoRedo.clearHistory();
    console.log("Saves cleared!");
});

const undoButton = document.getElementById("undo")!;
undoButton.addEventListener("click", () => {
    ({cells, cellData, tilemap, xyPos, time, harvestTotal} = UndoRedo.undo(cells, cellData, tilemap, xyPos, time, harvestTotal)!);
    UndoRedo.undoMemory();
    redrawTilemap();
    printGridData();
});

const redoButton = document.getElementById("redo")!;
redoButton.addEventListener("click", () => {
    ({cells, cellData, tilemap, xyPos, time, harvestTotal} = UndoRedo.redo(cells, cellData, tilemap, xyPos, time, harvestTotal)!);
    UndoRedo.redoMemory();
    redrawTilemap();
    printGridData();
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
    UndoRedo.saveStateToUndoStack(cells, cellData, tilemap, xyPos, time, harvestTotal); // Record movement

    const coordX = Math.trunc(e.offsetX / tileSize);
    const coordY = Math.trunc(e.offsetY / tileSize);

    coordHelper(coordX, coordY);
    time++;
    updateGridData(); // Update grid data after the player moves
});

const language = document.getElementById("language") as HTMLButtonElement;
language.addEventListener("click", () => {
  translate(langu);
  if(langu == "AR"){
    langu = "EN";
  }
  else if(langu == "EN"){
    langu = "ZH";
  }
  else if(langu == "ZH"){
    langu = "AR";
  }
});

export function translate(langu: string) {
  if (langu == "AR") {
    document.getElementById("language")!.innerHTML = data.AR.language;
    document.getElementById("undo")!.innerHTML = data.AR.undoButton;
    document.getElementById("redo")!.innerHTML = data.AR.redoButton;
    //document.getElementById("saveButton")!.innerHTML = data.AR.saveButton;
    document.getElementById("save-1")!.innerHTML = data.AR.saveFile1;
    document.getElementById("save-2")!.innerHTML = data.AR.saveFile2;
    document.getElementById("save-3")!.innerHTML = data.AR.saveFile3;
    document.getElementById("load-1")!.innerHTML = data.AR.restoreFile1;
    document.getElementById("load-2")!.innerHTML = data.AR.restoreFile2;
    document.getElementById("load-3")!.innerHTML = data.AR.restoreFile3;
    document.getElementById("clear-saves")!.innerHTML = data.AR.clearSaves;
    document.getElementById("loadAuto")!.innerHTML = data.AR.loadAuto;
    //document.getElementById("readCodeButton")!.innerHTML =data.AR.readCodeButton;
    console.log("AR");
    //langu = "EN";
    return;
  }else if(langu == "EN" ) {
    document.getElementById("language")!.innerHTML = data.EN.language;
    document.getElementById("undo")!.innerHTML = data.EN.undoButton;
    document.getElementById("redo")!.innerHTML = data.EN.redoButton;
    //document.getElementById("saveButton")!.innerHTML = data.EN.saveButton;
    document.getElementById("save-1")!.innerHTML = data.EN.saveFile1;
    document.getElementById("save-2")!.innerHTML = data.EN.saveFile2;
    document.getElementById("save-3")!.innerHTML = data.EN.saveFile3;
    document.getElementById("load-1")!.innerHTML = data.EN.restoreFile1;
    document.getElementById("load-2")!.innerHTML = data.EN.restoreFile2;
    document.getElementById("load-3")!.innerHTML = data.EN.restoreFile3;
    document.getElementById("clear-saves")!.innerHTML = data.EN.clearSaves;
    document.getElementById("loadAuto")!.innerHTML = data.EN.loadAuto;
    //document.getElementById("readCodeButton")!.innerHTML =data.EN.readCodeButton;
    console.log("EN");
    //langu = "AR";
    return;
  }else if(langu == "ZH" ) {
    document.getElementById("language")!.innerHTML = data.ZH.language;
    document.getElementById("undo")!.innerHTML = data.ZH.undoButton;
    document.getElementById("redo")!.innerHTML = data.ZH.redoButton;
    //document.getElementById("saveButton")!.innerHTML = data.ZH.saveButton;
    document.getElementById("save-1")!.innerHTML = data.ZH.saveFile1;
    document.getElementById("save-2")!.innerHTML = data.ZH.saveFile2;
    document.getElementById("save-3")!.innerHTML = data.ZH.saveFile3;
    document.getElementById("load-1")!.innerHTML = data.ZH.restoreFile1;
    document.getElementById("load-2")!.innerHTML = data.ZH.restoreFile2;
    document.getElementById("load-3")!.innerHTML = data.ZH.restoreFile3;
    document.getElementById("clear-saves")!.innerHTML = data.ZH.clearSaves;
    document.getElementById("loadAuto")!.innerHTML = data.ZH.loadAuto;
    //document.getElementById("readCodeButton")!.innerHTML =data.ZH.readCodeButton;
    console.log("ZH");
    //langu = "AR";
    return;
  }
}
// START --------------------
// Call checkAutoSaveOnLaunch after cellData is initialized
checkAutoSaveOnLaunch();

// Initialize memory for the grid
Memory.initializeGrid(numTiles);

// Save the initial state to the memory after the grid is initialized
Memory.saveState(cellData);

// Finish game trying this again
//aaaaaa

// Example usage in main.ts for internal dsl
const myPlant = new PlantDSL('Rose')
  .checkSameSpeciesNeighbors()
  .checkSoilConditions(5, 3)
  .getResultingPlant();

console.log(myPlant);