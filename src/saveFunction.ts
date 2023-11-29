import { time } from "./main.ts";
import { numTiles } from "./main.ts";
import { cellData } from "./main.ts";
import { xyPos } from "./main.ts";

export function saveGrid() {
    console.log("Time passed: " + time);
    console.log("Player is at: " + xyPos);
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