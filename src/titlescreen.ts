// // titlescreen.ts
// import "./style.css";
// import { Plant } from "./plants";

// // Define the CellData type
// interface CellData {
//     sunLevel: number;
//     waterLevel: number;
//     plant?: Plant;
// }

// import { Memory } from "./memory"; // Import the Memory class [F1.a]
// import { UndoRedo } from "./undoRedo"; // Import the UndoRedo class [F1.b]
// import { SaveGame } from "./saveGame"; // Import the SaveGame class [F1.c]
// import { AutoSave } from "./autoSave"; // Import the AutoSave class [F1.d]

// // Declare cellData at the top
// let cellData: CellData[][];

// // Set background image
// document.body.style.backgroundImage = 'url("public/title screen.png")';
// document.body.style.backgroundSize = 'cover';
// document.body.style.backgroundPosition = 'center';
// document.body.style.backgroundRepeat = 'no-repeat';

// // Function to load the game based on the selected slot
// function loadGame(slotNumber: number): void {
//     const loadUrl = `/game.html?slot=${slotNumber}`;
//     window.location.href = loadUrl;
// }

// // Function to load the auto-save
// function loadAutoSave(): void {
//     const autoSaveUrl = "/game.html?slot=auto";
//     window.location.href = autoSaveUrl;
// }

// // Event listeners for load buttons on title screen
// document.getElementById("load1")?.addEventListener("click", () => loadGame(1));
// document.getElementById("load2")?.addEventListener("click", () => loadGame(2));
// document.getElementById("load3")?.addEventListener("click", () => loadGame(3));
// document.getElementById("loadAuto")?.addEventListener("click", loadAutoSave);

// // Container for buttons on title screen
// const buttonContainer = document.createElement("div");
// buttonContainer.style.position = "absolute";
// buttonContainer.style.bottom = "0";
// buttonContainer.style.left = "0";
// buttonContainer.style.display = "flex";
// buttonContainer.style.flexDirection = "row"; // Change to row direction
// document.body.appendChild(buttonContainer);

// // Buttons for manual save and load on title screen
// for (let i = 1; i <= 3; i++) {
//     const saveButton = createButton(`Save ${i}`, `save-${i}`);
//     saveButton.addEventListener("click", () => {
//         manualSave(i);
//     });
//     buttonContainer.appendChild(saveButton);

//     const loadButton = createButton(`Load ${i}`, `load-${i}`);
//     loadButton.addEventListener("click", () => {
//         manualLoad(i);
//     });
//     buttonContainer.appendChild(loadButton);
// }

// // Button for the auto-save load on title screen
// const autoSaveButton = createButton("Load Auto", "load-auto");
// autoSaveButton.addEventListener("click", loadAutoSave);
// buttonContainer.appendChild(autoSaveButton);

// function createButton(text: string, id: string): HTMLButtonElement {
//     const button = document.createElement("button");
//     button.textContent = text;
//     button.style.width = "100px";
//     button.style.height = "40px";
//     button.style.marginRight = "10px"; // Adding a margin between buttons
//     button.id = id;
//     return button;
// }

// // Manual save functionality on title screen
// function manualSave(slotNumber: number) {
//     try {
//         // Save the game to the specified slot using the SaveGame class
//         SaveGame.saveGame(cellData.map(row => row.map(cell => ({ ...cell }))), slotNumber - 1);
//         console.log(`Game saved to slot ${slotNumber} manually!`);
//     } catch (error) {
//         console.error(`Failed to save game to slot ${slotNumber}:`, error);
//     }
// }

// // Manual load functionality on title screen
// function manualLoad(slotNumber: number) {
//     try {
//         // Load the game state from the specified slot using the SaveGame class
//         const loadedState = SaveGame.loadGame(slotNumber - 1);

//         if (loadedState !== null) {
//             // Update the current cellData with the loaded state
//             cellData = loadedState;

//             // Redirect to the main game page
//             loadGame(slotNumber);
//         } else {
//             console.error(`No saved game found in slot ${slotNumber}.`);
//         }
//     } catch (error) {
//         console.error(`Failed to load game from slot ${slotNumber}:`, error);
//     }
// }
