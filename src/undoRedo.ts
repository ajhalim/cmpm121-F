// [F1.b] 
// The player must be able to undo every major choice (all the way back to the start of play), even from a saved game. 
// They should be able to redo (undo of undo operations) multiple times.

import { Memory } from "./memory";
import { Memento } from "./Memento";
import { Cell, CellData, numTiles } from "./main";

export class UndoRedo {
    static currentStep: number = -1;
    static history: Uint8Array[] = [];
    static undoStack: Memento[] = [];
    static redoStack: Memento[] = [];

    static saveMemoryState() {
        const currentState = new Uint8Array(Memory.gridData);
        UndoRedo.history.push(currentState);
        UndoRedo.currentStep = UndoRedo.history.length - 1;
    }

    static undoMemory(): Uint8Array | undefined {
        if (UndoRedo.currentStep > 0) {
            UndoRedo.currentStep--;
            const previousState = new Uint8Array(UndoRedo.history[UndoRedo.currentStep]);
            Memory.gridData.set(previousState);
            return previousState;
        }
        return undefined;
    }

    static redoMemory(): Uint8Array | undefined {
        if (UndoRedo.currentStep < UndoRedo.history.length - 1) {
            UndoRedo.currentStep++;
            const nextState = new Uint8Array(UndoRedo.history[UndoRedo.currentStep]);
            Memory.gridData.set(nextState);
            return nextState;
        }
        return undefined;
    }

    static clearHistory() {
        UndoRedo.history = [];
        UndoRedo.currentStep = -1;
    }

    // Function to undo the last action
    static undo(cells: Cell[][], cellData: CellData[][], tilemap: HTMLImageElement[][], xyPos: number[], time: number, harvestTotal: number) {
        const prevState = UndoRedo.undoStack.pop();
    
        if (!prevState) {
        console.error("Undo stack is empty");
        return;
        }
    
        console.log("Undoing last action...");
    
        // Save the current state before undoing
        UndoRedo.saveStateToRedoStack(cells, cellData, tilemap, xyPos, time, harvestTotal);
    
        console.log("Undone. Current state:");

        // Restore the previous state
        return UndoRedo.restoreState(prevState, cells, cellData, tilemap, xyPos, time, harvestTotal);
    }

    // Function to redo the last undone action
    static redo(cells: Cell[][], cellData: CellData[][], tilemap: HTMLImageElement[][], xyPos: number[], time: number, harvestTotal: number,) {
        const nextState = UndoRedo.redoStack.pop();

        if (!nextState) {
            console.error("Redo stack is empty");
            return;
        }

        console.log("Redoing last undone action...");

        // Save the current state before redoing
        UndoRedo.saveStateToUndoStack(cells, cellData, tilemap, xyPos, time, harvestTotal);

        console.log("Redone. Current state:");

        // Restore the next state
        return UndoRedo.restoreState(nextState, cells, cellData, tilemap, xyPos, time, harvestTotal);
    }
    
    // Helper function to save the current state to the undo stack
    static saveStateToUndoStack(cells: Cell[][], cellData: CellData[][], tilemap: HTMLImageElement[][], xyPos: number[], time: number, harvestTotal: number,) {
        UndoRedo.undoStack.push(new Memento(
            tilemap.map((row) =>
                row.map((cell) => {
                const img = new Image();
                img.src = cell.src;
                return img;
                })
            ),
            cells.map((row) => row.map((cell) => ({ ...cell }))),
            cellData.map((row) => row.map((cell) => ({ ...cell}))),
            xyPos.slice(),
            time,
            harvestTotal
        ));
    }
    
    // Helper function to save the current state to the redo stack
    static saveStateToRedoStack(cells: Cell[][], cellData: CellData[][], tilemap: HTMLImageElement[][], xyPos: number[], time: number, harvestTotal: number,) {
        UndoRedo.redoStack.push(new Memento(
            tilemap.map((row) =>
                row.map((cell) => {
                const img = new Image();
                img.src = cell.src;
                return img;
                })
            ),
            cells.map((row) => row.map((cell) => ({ ...cell }))),
            cellData.map((row) => row.map((cell) => ({ ...cell}))),
            xyPos.slice(),
            time,
            harvestTotal,
        ));
    }
    
    // Helper function to restore a state
    static restoreState(state: Memento, cells: Cell[][], cellData: CellData[][], tilemap: HTMLImageElement[][], xyPos: number[], time: number, harvestTotal: number,) {
        tilemap = state.tilemap.map((row) =>
        row.map((cell) => {
            const img = new Image();
            img.src = cell.src;
            return img;
        })
        );
        cellData = state.cellData.map((row) =>
        row.map((cell) => ({ ...cell }))
        );
        cells = state.cells.map((row) =>
        row.map((cell) => ({ ...cell }))
        );
        xyPos = state.xyPos.slice();
        time = state.time;
        harvestTotal = state.harvestTotal;
        for (let i = 0; i < numTiles; i++) {
            for (let j = 0; j < numTiles; j++) {
                cells[i][j].weather = cellData[i][j];
            }
        }
        return {cells, cellData, tilemap, xyPos, time, harvestTotal};
    }

}
