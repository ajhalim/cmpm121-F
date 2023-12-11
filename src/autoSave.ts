// autoSave.ts

interface CellData {
    sunLevel: number;
    waterLevel: number;
}

export class AutoSave {
    static saveAuto(cellData: CellData[][]): void {
        console.log("AutoSave - Saving Auto");
        try {
            // Serialize and save cellData to local storage
            const serializedState = JSON.stringify(cellData);
            localStorage.setItem("autoSave", serializedState);
            console.log("AutoSave - Save successful");
        } catch (error) {
            console.error("AutoSave - Failed to save:", error);
        }
    }

    static loadAuto(): CellData[][] | null {
        console.log("AutoSave - Loading Auto");
        try {
            // Retrieve and deserialize cellData from local storage
            const serializedState = localStorage.getItem("autoSave");
            if (serializedState === null) {
                console.log("AutoSave - No auto-save found.");
                return null;
            }

            const loadedState = JSON.parse(serializedState);
            console.log("AutoSave - Load successful");
            return loadedState;
        } catch (error) {
            console.error("AutoSave - Failed to load:", error);
            return null;
        }
    }
}
