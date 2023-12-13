export type PlantType = "none" | "rose" | "white" | "yellow";

export class Plant {
    type: string;
    position: number[];
    growth: number;
    water: number;
    waterRequirement: number;

    constructor(type: string, growth: number, water: number, position: number[]) {
        this.type = type;
        this.water = water;
        this.growth = growth;
        this.position = position;
        this.waterRequirement = 100;
    }

    public advanceTime(sun: number, water: number) {
        if (this.type != "none") {
            this.water += water;
            if (sun > 50 && water > this.waterRequirement && this.growth < 3) {
                this.growth++;
                this.waterRequirement += 100;
            }
        }
    }

    public resetPlant() {
        this.type = "none";
        this.growth = 0;
        this.water = 0;
        this.waterRequirement = 100;
    }
}


