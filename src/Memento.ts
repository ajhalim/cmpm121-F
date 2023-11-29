import { CellData } from './main';

export class Memento {
    constructor(
        public tilemap: HTMLImageElement[][],
        public cellData: CellData[][],
        public xyPos: number[],
        public time: number
    ) {}
}