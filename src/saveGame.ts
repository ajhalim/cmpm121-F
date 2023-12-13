// [F1.c] 

// The player must be able to manually save their progress in the game in a way that allows them to load that save and 
// continue play another day. The player must be able to manage multiple save files (allowing save scumming).
import { Plant } from "./plants";
import { Cell, CellData, numTiles } from "./main";
import { SaveFile } from "./Memento";
  
// SaveGame class
export class SaveGame {
    static saveFiles: SaveFile[] = [];

    static saveSlot(slot: number, cells: Cell[][], cellData: CellData[][], tilemap: HTMLImageElement[][], xyPos: number[], time: number, harvestTotal: number, pastTile: string) {
        SaveGame.saveFiles[slot] = (new SaveFile(
            tilemap.map((row) =>
            row.map((cell) => {
                return cell.src;
            })
            ),
            cells.map((row) => row.map((cell) => ({ ...cell }))),
            cellData.map((row) => row.map((cell) => ({ ...cell }))),
            xyPos.slice(),
            time,
            harvestTotal,
            pastTile,
        ));
        localStorage.setItem("save" + slot, JSON.stringify(SaveGame.saveFiles[slot]));
        console.log("Saved to slot" + slot + ".");
    }

    static restoreSave(slot: number, cells: Cell[][], cellData: CellData[][], tilemap: HTMLImageElement[][], xyPos: number[], time: number, harvestTotal: number, pastTile: string) {
        const savedState = JSON.parse(localStorage.getItem("save" + slot)!);
        tilemap = savedState.tilemap.map((row: string[]) =>
            row.map((cell) => {
            const img = new Image();
            img.src = cell;
            return img;
            })
        );
        cellData = savedState.cellData.map((row: CellData[]) =>
            row.map((cell) => ({ ...cell }))
        );
        cells = savedState.cells.map((row: Cell[]) =>
        row.map((cell) => ({ ...cell }))
        );
        xyPos = savedState.xyPos.slice();
        time = savedState.time;
        pastTile = savedState.pastTile;
        harvestTotal = savedState.harvestTotal;
        for (let i = 0; i < numTiles; i++) {
            for (let j = 0; j < numTiles; j++) {
                cells[i][j].weather = cellData[i][j];
                const {type, growth, water} = cells[i][j].plant;
                cells[i][j].plant = new Plant(type, growth, water, [i, j]); 
            }
        }
        console.log("Restored from slot" + slot + ".");
        return {cells, cellData, tilemap, xyPos, time, harvestTotal, pastTile};
    }
    
    // Helper function to compare two states
    static compareStates(state1: CellData[][], state2: CellData[][]): boolean {
        for (let i = 0; i < state1.length; i++) {
            for (let j = 0; j < state1[i].length; j++) {
                const cell1 = state1[i][j];
                const cell2 = state2[i][j];

                if (
                    cell1.sunLevel !== cell2.sunLevel ||
                    cell1.waterLevel !== cell2.waterLevel
                ) {
                    return false;
                }
            }
        }

        return true;
    }

    // Helper function to compare two plant objects
    static comparePlants(plant1: Plant | undefined, plant2: Plant | undefined): boolean {
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
}