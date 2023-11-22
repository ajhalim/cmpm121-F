import "./style.css";
import { Plant } from "./plants";

//setting up the multiple canvases
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

//defining the textures to use
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

//defining the size of the main grid
const numTiles = 10;
const tileSize = gridCanvas.width / numTiles;

//defining the size of the select grid
const numSelectables = imageUrls.length;
const selectHeight = selectCanvas.height / numSelectables;

let lastXPos: number;
let lastYPos: number;
let pastTile: string = "nothing";

let xyPos: number[];
let time: number = 0;

// track the selected tile
//let currentTile = 0;

//let adjTiles = [];

// can change the names of the types later
const plantTypes = ["species1", "species2", "species3"];
let harvestTotal = 0;

//creating the tilemap nested array
let tilemap: HTMLImageElement[][] = new Array(numTiles);

for(let i = 0; i < numTiles; i++) {
    let row = new Array(numTiles);
    for (let j = 0; j < numTiles; j++) {
        row[j] = new Image();
        row[j].src = "/tile1.png";
    }
    tilemap[i] = row;
}

/* const svg: HTMLElement = create("svg");
const svgContainer: HTMLElement | null = document.getElementById("svgContainer"); */


// function create(elementNone: any) {
//     return document.createElementNS("http://www.w3.org/2000/svg", elementNone);
// }

//draw the initial canvases
redrawTilemap();
drawSelectCanvas();

//Function that draws a texture to a specific canvas ctx
function drawTexture(row: number, col: number, ctx: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number, cellSize: number) {
    image.onload = () => {
        ctx.drawImage(image, row * cellSize, col * cellSize, width, height)
    };
    ctx.drawImage(image, row * cellSize, col * cellSize, width, height)
}

// ----- Interacting with the main tilemap -----
function redrawTilemap() {
  gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
    for (let i = 0; i < numTiles; i++) {
        for (let j = 0; j < numTiles; j++) {
            drawTexture(i, j, gridCtx, tilemap[i][j], gridCanvas.width / numTiles, gridCanvas.height / numTiles, tileSize);
        }
    }
}

export function coordHelper(xPos: number, yPos: number) {
    /* if-statement makes sure to reset the tile that the player moves from to the img
    it was before the player moved onto it.*/
    // tilemap[xPos][yPos].src = imageUrls[currentTile];
    if(pastTile != "nothing"){
        lastXPos = xyPos[0];
        lastYPos = xyPos[1];
        tilemap[lastXPos][lastYPos].src = pastTile;
    }

    //console.log(tilemap[xPos][yPos].src);

    pastTile = tilemap[xPos][yPos].src;
    tilemap[xPos][yPos].src = playerImage[0];
    xyPos = [xPos, yPos];

    //adjTiles = adjCoords(xPos, yPos);
    
    redrawTilemap();
    time++;
    //console.log(xyPos);
    return xyPos;
}

// function adjCoords(xPos: number, yPos: number) {
//     let adjacentTiles = new Array;

//     if (xPos != 0 && yPos != 0) {
//         for (let i = xPos-1; i <= xPos+1; i++) {
//             //adjacentTiles[i] = [];
//             for (let j = yPos-1; j <= yPos+1; j++) {
//                 adjacentTiles.push([i,j])
//             }

//         }
//     }
//     //console.log(adjacentTiles);
//     return adjacentTiles;
    
// }

// gridCanvas.addEventListener("click", (e) => {
//     const coordX = Math.trunc(e.offsetX / tileSize);
//     const coordY = Math.trunc(e.offsetY / tileSize);

//     coordHelper(coordX, coordY);

//     //tilemap[coordX][coordY].src = imageUrls[currentTile];
//     //redrawTilemap();
// })

gridCanvas.onauxclick = (e) => {
    e.preventDefault();

    const coordX = Math.trunc(e.offsetX / tileSize);
    const coordY = Math.trunc(e.offsetY / tileSize);

    // let thing =[];
    // thing = [coordX, coordY];

    /* if(pastTile != "nothing"){
        return;
    } */

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

    /* adjTiles = adjCoords(xyPos[0], xyPos[1]);

    console.log(adjTiles);
    console.log("break");
    console.log(thing) 

    console.log(adjTiles[0]);
    if(adjTiles.includes(thing)){

        console.log("Rat")

        /* if(tilemap[coordX][coordY].src == imageUrls[0]){

            console.log("harvest");

        } */

        /* console.log(tilemap[coordX][coordY].src);

        console.log("rat"); 

    } */


    //console.log("rat")
};


let cellData: CellData[][] = new Array(numTiles);
for (let i = 0; i < numTiles; i++) {
    let row = new Array(numTiles);
    for (let j = 0; j < numTiles; j++) {
        row[j] = { sunLevel: 0, waterLevel: 0};
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
        rowString += `[${i},${j}] - Sun: ${cellData[i][j].sunLevel}, Water: ${cellData[i][j].waterLevel}`
        if (cellData[i][j].plant != undefined) {
            rowString += `, Plant Type: ${cellData[i][j].plant?.type}, Growth Level: ${cellData[i][j].plant?.growth} |`;
        }
        rowString += "\n";
    }
        console.log(rowString);
    }
}


// uncomment this later, abe
function updateGridData() {
    generateRandomLevels();
    printGridData();
}
  
gridCanvas.addEventListener("click", (e) => {
    const coordX = Math.trunc(e.offsetX / tileSize);
    const coordY = Math.trunc(e.offsetY / tileSize);

    coordHelper(coordX, coordY);

    // Update grid data after the player moves
    updateGridData();
});
  
// Call updateGridData initially to set initial levels
updateGridData();

/* Select Canvas Functions (currently unused) */
  // ----- Interacting with the selectable tilemap -----

  // Loop through the selectable tiles and draw textures in each cell
function drawSelectCanvas() {
    for (let i = 0; i < numSelectables; i++) {
        const selectableImage = new Image();
        selectableImage.src = imageUrls[i];
        drawTexture(0, i, selectCtx, selectableImage, selectCanvas.width, selectHeight, 64);
    }
}

// selectCanvas.addEventListener("click", (e) => {
//     const coordY = Math.trunc(e.offsetY / selectHeight);
//     currentTile = coordY;
//     console.log(coordY);
// })