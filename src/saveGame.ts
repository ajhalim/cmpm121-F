// [F1.c] 

// The player must be able to manually save their progress in the game in a way that allows them to load that save and 
// continue play another day. The player must be able to manage multiple save files (allowing save scumming).

import { Plant } from "./plants";

// Define CellData type
interface CellData {
	sunLevel: number;
	waterLevel: number;
	plant?: Plant;
}
  
// SaveGame class
export class SaveGame {
    static saveGame(cellData: CellData[][], slot: number): void {
        console.log(`SaveGame - Saving to Slot ${slot}`);
        try {
            // Serialize and save cellData to local storage
            const serializedState = JSON.stringify(cellData);
            localStorage.setItem(`saveSlot${slot}`, serializedState);
            console.log(`SaveGame - Save to Slot ${slot} successful`);
        } catch (error) {
            console.error(`SaveGame - Failed to save to Slot ${slot}:`, error);
        }
    }

    static loadGame(slot: number): CellData[][] | null {
        console.log(`SaveGame - Loading from Slot ${slot}`);
        try {
            // Retrieve and deserialize the cellData from local storage
            const serializedState = localStorage.getItem(`saveSlot${slot}`);
            if (serializedState === null) {
                console.log(`SaveGame - No saved game found in Slot ${slot}.`);
                return null;
            }

            const loadedState = JSON.parse(serializedState);
            console.log(`SaveGame - Load from Slot ${slot} successful`);
            return loadedState;
        } catch (error) {
            console.error(`SaveGame - Failed to load from Slot ${slot}:`, error);
            return null;
        }
    }
}