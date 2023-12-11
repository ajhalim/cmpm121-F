export class Plant {
    type: string;
    growth: number;
    water: number;
    waterRequirement: number;

    constructor(type: string, growth: number, water: number) {
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


