import "./style.css";


//setting up the multiple canvases
const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
const gridCtx = gridCanvas.getContext("2d") as CanvasRenderingContext2D;

const selectCanvas = document.getElementById("selectCanvas") as HTMLCanvasElement;
const selectCtx = selectCanvas.getContext("2d") as CanvasRenderingContext2D;

// Data structure storing the data of sun and water level
interface CellData {
    sunLevel: number;
    waterLevel: number;
    plantType?: string; // Plant type (e.g., "species1", "species2", "species3")
    growthLevel?: string; // Growth level (e.g., "level1", "level2", "level3")
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

//let currentTile = 0;

//defining the size of the main grid
const numTiles = 10;
const tileSize = gridCanvas.width / numTiles;


//defining the size of the select grid
const numSelectables = imageUrls.length;
const selectHeight = selectCanvas.height / numSelectables;

let lastXPos: number;
let lastYPos: number;
let pastTile: string = "nothing";

let xyPos:number [];
let time:number = 0;

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


function create(elementNone: any) {
    return document.createElementNS("http://www.w3.org/2000/svg", elementNone);
}


//track the selected tile
let currentTile = 0;

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
let adjTiles = [];
function redrawTilemap()
{
  gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
    for (let i = 0; i < numTiles; i++) {
        for (let j = 0; j < numTiles; j++) {
            drawTexture(i, j, gridCtx, tilemap[i][j], gridCanvas.width / numTiles, gridCanvas.height / numTiles, tileSize);
        }
    }
}

export function coordHelper(xPos: number, yPos: number)
{
    //  tilemap[xPos][yPos].src = imageUrls[currentTile];
    if(pastTile != "nothing"){
        lastXPos = xyPos[0];
        lastYPos = xyPos[1];
        tilemap[lastXPos][lastYPos].src = pastTile;
    }

    //console.log(tilemap[xPos][yPos].src);

    pastTile = tilemap[xPos][yPos].src;

    tilemap[xPos][yPos].src = playerImage[0];
    
    xyPos= [xPos, yPos];

    //adjTiles = adjCoords(xPos, yPos);
    
    redrawTilemap();
    time++;
    //console.log(xyPos);
    return xyPos;
}



function adjCoords(xPos: number, yPos: number){
    let adjacentTiles = new Array;

    if(xPos != 0 && yPos != 0){
        for (let i = xPos-1; i <= xPos+1; i++) {
            //adjacentTiles[i] = [];
            for (let j = yPos-1; j <= yPos+1; j++) {
                adjacentTiles.push([i,j])
            }

        }
    }
    //console.log(adjacentTiles);
    return adjacentTiles;
    
}


gridCanvas.addEventListener("click", (e) => {
    const coordX = Math.trunc(e.offsetX / tileSize);
    const coordY = Math.trunc(e.offsetY / tileSize);

    coordHelper(coordX, coordY);

    //tilemap[coordX][coordY].src = imageUrls[currentTile];
    //redrawTilemap();
})

gridCanvas.onauxclick = (e) => {
    e.preventDefault();

    const coordX = Math.trunc(e.offsetX / tileSize);
    const coordY = Math.trunc(e.offsetY / tileSize);

    let thing =[];

    thing = [coordX, coordY];

    /* if(pastTile != "nothing"){
        return;
    } */

    if(coordX >= (xyPos[0]-1) && coordX <=(xyPos[0]+1)){
        if(coordY >= (xyPos[1]-1) && coordY <=(xyPos[1]+1)){
            if(tilemap[coordX][coordY].src == "http://localhost:5174/tile1.png"){
                console.log("plant");
            }
            else{
                console.log("harvest");
            }
            //console.log(tilemap[coordX][coordY].src);
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



// ----- Interacting with the selectable tilemap -----

// Loop through the selectable tiles and draw textures in each cell
function drawSelectCanvas()
{
    for (let i = 0; i < numSelectables; i++) {
        const selectableImage = new Image();
        selectableImage.src = imageUrls[i];
        drawTexture(0, i, selectCtx, selectableImage, selectCanvas.width, selectHeight, 64);
    }
}

selectCanvas.addEventListener("click", (e) => {
    //const coordX = Math.trunc(e.offsetX / tileSize);
    const coordY = Math.trunc(e.offsetY / selectHeight);
    currentTile = coordY;
    console.log(coordY);
})

let cellData: CellData[][] = new Array(numTiles);
for (let i = 0; i < numTiles; i++) {
    let row = new Array(numTiles);
    for (let j = 0; j < numTiles; j++) {
        row[j] = { sunLevel: 0, waterLevel: 0};
    }
    cellData[i] = row;
}

function generateRandomLevels() {
    const plantTypes = ["species1", "species2", "species3"];
    const growthLevels = ["level1", "level2", "level3"];

    for (let i = 0; i < numTiles; i++) {
      for (let j = 0; j < numTiles; j++) {
        // Generate random levels (you can adjust the range based on your requirements)
        cellData[i][j].sunLevel = Math.floor(Math.random() * 100);
        cellData[i][j].waterLevel += Math.floor(Math.random() * 10);
        cellData[i][j].plantType = plantTypes[Math.floor(Math.random() * plantTypes.length)];
        cellData[i][j].growthLevel = growthLevels[Math.floor(Math.random() * growthLevels.length)];
      }
    }
  }

  function printGridData() {
    console.log("Grid Cells - Sun, Water, Plant Type, and Growth Level:");
    for (let i = 0; i < numTiles; i++) {
      let rowString = "";
      for (let j = 0; j < numTiles; j++) {
        rowString += `[${i},${j}] - Sun: ${cellData[i][j].sunLevel}, Water: ${cellData[i][j].waterLevel}, Plant Type: ${cellData[i][j].plantType}, Growth Level: ${cellData[i][j].growthLevel} | `;
      }
      console.log(rowString);
    }
  }


  //uncomment this later, abe
  function updateGridData() {
    generateRandomLevels();
    //printGridData();
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