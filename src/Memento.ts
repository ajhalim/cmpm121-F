import { Cell, CellData } from './main';

// Represents a snapshot of the game state for potential restoration (Memento pattern)
export class Memento {
    // Initialize the Memento object with relevant state
    constructor(
        public tilemap: HTMLImageElement[][], // Represents the tilemap as an array of HTMLImageElement arrays
        public cells: Cell[][], // Represents the game grid cell info
        public cellData: CellData[][],
        public xyPos: number[], // Represents the player's current position [x, y]
        public time: number, // Represents the current game time
        public harvestTotal: number, // Represents the total number of plants harvested
    ) {}
}

// Represents a saved file with additional information for game state restoration
export class SaveFile {
     // Initialize the SaveFile object with relevant state
     constructor(
        public tilemap: string[][], // Represents the tilemap as an array of string arrays
        public cells: Cell[][], // Represents the game grid cell info
        public cellData: CellData[][],
        public xyPos: number[], // Represents the player's current position [x, y]
        public time: number, // Represents the current game time
        public harvestTotal: number, // Represents the total number of plants harvested
        public pastTile: string, // Represents the past tile information for the player
    ) {}
}