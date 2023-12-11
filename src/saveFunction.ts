import { time } from "./main.ts";
import { numTiles } from "./main.ts";
import { cellData } from "./main.ts";
import { xyPos } from "./main.ts";
import { saveNum } from "./main.ts";
// import { Plant } from "./plants";

let text: string;


// Initialize an array to store grid data
let grid: { time: number, xyPos: number[], sun: number, water: number, plantType: string, plantGrowth: number }[] = [
	{ "time": 0, "xyPos": [0, 0], "sun": 0, "water": 0, "plantType": "none", "plantGrowth": 0 }
];


// Function to initialize the grid data
export function initGrid() {
	for (let i = 0; i < numTiles; i++) {
		let rowString = "";
		let tileID = 0;
		for (let j = 0; j < numTiles; j++) {
			// Build a string representation of the grid
			rowString += `[${i},${j}] - Sun: ${cellData[i][j].sunLevel}, Water: ${cellData[i][j].waterLevel}`
			
			// Update the grid array with the current cell data
			grid[saveNum].sun = cellData[i][j].sunLevel;
			grid[saveNum].water = cellData[i][j].waterLevel;

			// Check if there is a plant on the cell and update the grid accordingly
			if (cellData[i][j].plant != undefined) {
				rowString += `, Plant Type: ${cellData[i][j].plant?.type}, Growth Level: ${cellData[i][j].plant?.growth} |`;
				grid[saveNum].plantType = cellData[i][j].plant!.type;
				grid[saveNum].plantGrowth = cellData[i][j].plant!.growth;
			}
			else {
				// If no plant, leave the plantType as "none" and growth level as 0
			}

			// Append the string to the text variable
			text += "\n";

			// Add a new grid entry for the current tile
			grid.push({ "time": 0, "xyPos": [0, 0], "sun": 0, "water": 0, "plantType": "none", "plantGrowth": 0 });
			tileID++;
		}
	}
}

// Function to save the grid data
export function saveGrid() {
	text = "" // Clear the text variable
	let currentTile = 0;
	//console.log(grid[30])

	// Build the header of the save text
	text += "Time passed: " + time + " \n";
	grid[saveNum].time = time;
	text += "Player is at: " + xyPos + " \n";
	grid[saveNum].xyPos = xyPos;
	text += "Grid Cells - Sun, Water, Plant Type, and Growth Level: ";

	// Iterate through the grid and update the grid array
	for (let i = 0; i < numTiles; i++) {
		let rowString = "";
		grid[currentTile].time = time;
		grid[currentTile].xyPos = xyPos;

		// Iterate through the tiles in the row
		for (let j = 0; j < numTiles; j++) {
			// Build a string representation of the grid
			rowString += `[${i},${j}] - Sun: ${cellData[i][j].sunLevel}, Water: ${cellData[i][j].waterLevel}`

			// Update the grid array with the current cell data
			grid[currentTile].sun = cellData[i][j].sunLevel;
			grid[currentTile].water = cellData[i][j].waterLevel;

			// Check if there is a plant on the cell and update the grid accordingly
			if (cellData[i][j].plant != undefined) {
				rowString += `, Plant Type: ${cellData[i][j].plant?.type}, Growth Level: ${cellData[i][j].plant?.growth} |`;
				grid[currentTile].plantType = cellData[i][j].plant!.type;
				grid[currentTile].plantGrowth = cellData[i][j].plant!.growth;
			}
			else {
				// If no plant, leave the plantType as "none" and growth level as 0
				grid[currentTile].plantType = "none";
				grid[currentTile].plantGrowth = 0;
			}

			// Append the string to the text variable
			text += "\n";
			currentTile++;
		}
		// Append the rowString to the text variable
		text += rowString;
	}

	// Save the grid array as a JSON string in local storage
	localStorage.setItem("grid", JSON.stringify(Array.from(grid)));

	// Return the generated text
	return text;
}