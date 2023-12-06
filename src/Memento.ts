import { CellData } from './main';

export class Memento {
    constructor(
        public tilemap: HTMLImageElement[][],
        public cellData: CellData[][],
        public xyPos: number[],
        public time: number
    ) {}
}

export class SaveFile {
    constructor(
        public tilemap: string[][],
        public cellData: CellData[][],
        public xyPos: number[],
        public time: number,
        public pastTile: string,
    ) {}
}