export type PlantType = "species1" | "species2" | "species3";

export class Plant {
    type: PlantType;
    growth: number;
    water: number;
    waterRequirement: number;

    constructor(type: PlantType, growth: number, water: number) {
        this.type = type;
        this.water = water;
        this.growth = growth;
        this.waterRequirement = 100;
    }

    public advanceTime(sun: number, water: number) {
        this.water += water;
        if (sun > 50 && water > this.waterRequirement) {
            this.growth++;
            this.waterRequirement += 100;
        }
    }
}


