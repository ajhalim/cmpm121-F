//import data from '../example.json' assert { type: 'json' };
//import {plantTypes, cellData} from './main.ts'

// Internal DSL -----------------

// Defines the state of the soil
interface SoilState {
  SunLevel: number;
  WaterLevel: number;
}

// Represents a plant
interface Plant {
  type: string;
  level: number;  //plant stages
  isAlive: boolean;
}

// Describes the details of a cell, which may or may not contain a plant
interface CellDetails {
  soilState: SoilState;
  plant?: Plant;
}

// Represents the context for plant growth, providing information about the plant,
// the current cell, and its neighbor cells
interface GrowthContext {
  plant: Plant;
  cell: CellDetails;
  neighborCells: CellDetails[];
}

class PlantDSL {
  private plant: Plant;

  constructor(type: string) {
    this.plant = {
      type,
      level: 1,
      isAlive: true,
    };
  }

  checkSameSpeciesNeighbors() {
    return (context: GrowthContext) => {
      const checkSameSpeciesNeighbors = context.neighborCells.filter(
        (neighbor) => neighbor.plant?.type === this.plant.type
      );
      
      // Logic implementation for same species neighbors
      // This Updates plant levvel based on the number of same species neighbors
      this.plant.level += checkSameSpeciesNeighbors.length;
    }
  }

  checkSoilConditions(minSunLevel: number, minWaterLevel: number) {
    return (context: GrowthContext) => {
      const { SunLevel, WaterLevel } = context.cell.soilState;

      if (SunLevel >= minSunLevel && WaterLevel >= minWaterLevel) {
        // Logic implementation for meeting soil conditions
        // This update plant level or other growth-related properties
        this.plant.level++;
      } else {
        this.plant.isAlive = false;
      }
    };
  }

  // Get the resulting plant after appying growth conditions
  getResultingPlant() : Plant {
    return this.plant;
  }
}

// Example usage of the DSL
const myPlant = new PlantDSL('Rose')
  .checkSameSpeciesNeighbors()
  .checkSoilConditions(5, 3)
  .getResultingPlant();

console.log(myPlant);