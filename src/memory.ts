// [F1.a] 
// The important state of each cell of your game’s grid must be backed by a single contiguous byte array 
// in AoS or SoA format. Your team must statically allocate memory usage for the whole grid.

// Define CellData interface representing the state of each cell in the grid
interface CellData {
    sunLevel: number;
    waterLevel: number;
}

// Memory class responsible for managing grid data in a contiguous byte array
export class Memory {
    static gridData: Uint8Array;
    static gridSize: number;

    // Retrieve the grid data
    static getGridData(): Uint8Array {
        return this.gridData;
    }

    // Initialize the grid with a specified size
    static initializeGrid(size: number) {
        Memory.gridSize = size;  // Set the grid size

        // Allocate memory for the entire grid (2 bytes per cell: sunLevel, waterLevel)
        Memory.gridData = new Uint8Array(size * size * 2);
    }

    // Function to save the state of the game grid into the contiguous byte array
    static saveState(cellData: CellData[][]) {
        for (let i = 0; i < Memory.gridSize; i++) {
            for (let j = 0; j < Memory.gridSize; j++) {

                const index = (i * Memory.gridSize + j) * 2; // Each cell takes 2 bytes

                // Save sunLevel and waterLevel to the byte array
                Memory.gridData[index] = cellData[i][j].sunLevel;
                Memory.gridData[index + 1] = cellData[i][j].waterLevel;
            }
        }
    }

    // Function to load the state of the game grid from a contiguous byte array
    static loadState(gridData: Uint8Array): CellData[][] {
        const cellData: CellData[][] = [];

        for (let i = 0; i < Memory.gridSize; i++) {
            const row: CellData[] = [];

            for (let j = 0; j < Memory.gridSize; j++) {
                const index = (i * Memory.gridSize + j) * 2; // Each cell takes 2 bytes

                // Retrieve sunLevel and waterLevel from the byte array
                const sunLevel = gridData[index];
                const waterLevel = gridData[index + 1];

                // Create a CellData object and push it to the current row
                const cell: CellData = { sunLevel, waterLevel };
                row.push(cell);
            }
            cellData.push(row);
        }

        // Return the loaded cell data
        return cellData;
    }
}
