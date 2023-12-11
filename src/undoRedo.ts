// [F1.b] 
// The player must be able to undo every major choice (all the way back to the start of play), even from a saved game. 
// They should be able to redo (undo of undo operations) multiple times.

import { Memory } from "./memory";

export class UndoRedo {
    static history: Uint8Array[] = [];
    static currentStep: number = -1;

    static saveState() {
        const currentState = new Uint8Array(Memory.gridData);
        UndoRedo.history.push(currentState);
        UndoRedo.currentStep = UndoRedo.history.length - 1;
    }

    static undo(): Uint8Array | undefined {
        if (UndoRedo.currentStep > 0) {
            UndoRedo.currentStep--;
            const previousState = new Uint8Array(UndoRedo.history[UndoRedo.currentStep]);
            Memory.gridData.set(previousState);
            return previousState;
        }
        return undefined;
    }

    static redo(): Uint8Array | undefined {
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
}
