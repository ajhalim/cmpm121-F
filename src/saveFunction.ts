import { time } from "./main.ts";
import { numTiles } from "./main.ts";
import { cellData } from "./main.ts";
import { xyPos } from "./main.ts";
import { saveNum } from "./main.ts";
// import { Plant } from "./plants";

let text: string;

let grid: { time: number, xyPos: number[], sun: number, water: number, plantType: string, plantGrowth: number }[] = [
  { "time": 0, "xyPos": [0, 0], "sun": 0, "water": 0, "plantType": "none", "plantGrowth": 0 }
];

export function initGrid() {
  for (let i = 0; i < numTiles; i++) {
    let rowString = "";
    let tileID = 0;
    for (let j = 0; j < numTiles; j++) {
      rowString += `[${i},${j}] - Sun: ${cellData[i][j].sunLevel}, Water: ${cellData[i][j].waterLevel}`
      grid[saveNum].sun = cellData[i][j].sunLevel;
      grid[saveNum].water = cellData[i][j].waterLevel;
      if (cellData[i][j].plant != undefined) {
        rowString += `, Plant Type: ${cellData[i][j].plant?.type}, Growth Level: ${cellData[i][j].plant?.growth} |`;
        grid[saveNum].plantType = cellData[i][j].plant!.type;
        grid[saveNum].plantGrowth = cellData[i][j].plant!.growth;
      }
      else {
      }
      text += "\n";
      grid.push({ "time": 0, "xyPos": [0, 0], "sun": 0, "water": 0, "plantType": "none", "plantGrowth": 0 });
      tileID++;
    }
  }
}

export function saveGrid() {
  text = ""
  let currentTile = 0;
  //console.log(grid[30])
  text += "Time passed: " + time + " \n";
  grid[saveNum].time = time;
  text += "Player is at: " + xyPos + " \n";
  grid[saveNum].xyPos = xyPos;
  text += "Grid Cells - Sun, Water, Plant Type, and Growth Level: ";

  for (let i = 0; i < numTiles; i++) {
    let rowString = "";
    grid[currentTile].time = time;
    grid[currentTile].xyPos = xyPos;
    for (let j = 0; j < numTiles; j++) {
      rowString += `[${i},${j}] - Sun: ${cellData[i][j].sunLevel}, Water: ${cellData[i][j].waterLevel}`
      grid[currentTile].sun = cellData[i][j].sunLevel;
      grid[currentTile].water = cellData[i][j].waterLevel;
      if (cellData[i][j].plant != undefined) {
        rowString += `, Plant Type: ${cellData[i][j].plant?.type}, Growth Level: ${cellData[i][j].plant?.growth} |`;
        grid[currentTile].plantType = cellData[i][j].plant!.type;
        grid[currentTile].plantGrowth = cellData[i][j].plant!.growth;
      }
      else {
        grid[currentTile].plantType = "none";
        grid[currentTile].plantGrowth = 0;
      }
      text += "\n";
      currentTile++;
    }
    text += rowString;
  }

  localStorage.setItem("grid", JSON.stringify(Array.from(grid)));

  // const save1 = localStorage.getItem("grid");
  // console.log(save1);
  return text;
}