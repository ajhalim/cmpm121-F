//import data from '../example.json' assert { type: 'json' };
import {waterLevel, sunLevel, cellData} from './main.ts'

// Internal DSL -----------------
interface SoilState {
  SunLevel: number;
  WaterLevel: number;
}

interface CellDetails {
  soilState: SoilState;
  plant?: Plant;
}

interface Plant {
  type: string;
  level: number;
  isAlive: boolean;
}

interface PlantDefinitionLanguage {
  name(name: string): void;
  growthCheckFrequency(frequency: number): void;
  growsWhen(growsWhen: (context: GrowthContext) => boolean): void;
}

interface GrowthContext {
  plant: Plant;
  cell: CellDetails;
  neighborCells: CellDetails[];
}

class InternalPlantType {
  fullName: string = "plant";
  growthCheckFrequency: number = 1;
  nextLevel: (context: GrowthContext) => number = (ctx) => ctx.plant.level;
}

function internalPlantTypeCompiler(program: (dsl: PlantDefinitionLanguage) => void): InternalPlantType {
  const internalPlantType = new InternalPlantType();
  const dsl: PlantDefinitionLanguage = {
    name(name: string): void {
      internalPlantType.fullName = name;
    },
    growthCheckFrequency(frequency: number): void {
      internalPlantType.growthCheckFrequency = frequency;
    },
    growsWhen(growsWhen: (context: GrowthContext) => boolean): void {
      internalPlantType.nextLevel = (ctx) => {
        return ctx.plant.level + (growsWhen(ctx) ? 1 : 0);
      };
    },
  };
  program(dsl);
  return internalPlantType;
}

const allInternalPlantTypes = [
  internalPlantTypeCompiler($ => {
    $.name("species1");
    $.growthCheckFrequency(2);
    $.growsWhen(({ plant, cell, neighborCells}) => {
      const neighborPlants = neighborCells
        .map(neighborCells => neighborCells.plant)
        .filter(plant => plant !== undefined) as Plant[];
      const isHappy = neighborPlants
        .filter(neighbor => neighbor.type === plant.type)
        .filter(neighbor => neighbor.level === Math.min(1, plant.level - 1))
        .length >= 2;
      return isHappy && cell.soilState.WaterLevel > 0.5 && cell.soilState.SunLevel > 0.5;
    });
  }),
]