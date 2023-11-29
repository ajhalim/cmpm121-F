import { time } from "./main.ts";
import { numTiles } from "./main.ts";
import { cellData } from "./main.ts";
import { xyPos } from "./main.ts";

//import * as fs from 'fs';


let text: string;

//text = "";

//export let fs = require('fs');

///fs.writeFileSync('./foo.txt', text);

export function saveGrid() {
    text = ""
    //console.log("Time passed: " + time);
    //console.log("Player is at: " + xyPos);
    //console.log("Grid Cells - Sun, Water, Plant Type, and Growth Level:");
    //fs.writeFileSync('./data.txt', String(time) + '\n');
    //fs.writeFileSync('./data.txt', String(xyPos) + '\n');
   // fs.writeFileSync('./data.txt', String(time) + '\n');
   text += "Time passed: " + time + " \n";
   text += "Player is at: " + xyPos + " \n";
   text += "Grid Cells - Sun, Water, Plant Type, and Growth Level: ";
   
    for (let i = 0; i < numTiles; i++) {
        let rowString = "";
        for (let j = 0; j < numTiles; j++) {
        rowString += `[${i},${j}] - Sun: ${cellData[i][j].sunLevel}, Water: ${cellData[i][j].waterLevel}`
        if (cellData[i][j].plant != undefined) {
            rowString += `, Plant Type: ${cellData[i][j].plant?.type}, Growth Level: ${cellData[i][j].plant?.growth} |`;
        }
        text += "\n";
    }
    text +=rowString;
        //console.log(rowString);
        /* fs.writeFile('data.txt', text, 'utf8', (err) => {
            if (err) {
              console.error('Error writing to file:', err);
            } else {
              console.log(`Successfully wrote to ${'data.txt'}`);
            }
        
    }); */
}   
return text;
}