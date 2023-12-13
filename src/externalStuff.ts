import data from '../example.json' assert { type: 'json' };
import {numTiles, cellData} from './main.ts'

//consider deleting
/*  export interface situation{
    winCond: number;
    playerPos: [];
}  */

export function reader(file:string){
    //qlet thing 
    //console.log(data.Scenario.winCondition);
    const obj = JSON.parse(file);
    /* let currentSituation = {
        winCond: file.Scenario.winCondition,
        playerPos: file.Scenario.playerPos,

        event1Name: file.Scenario.event1.name,
        event1Start: file.Scenario.event1.when,
        event1Water: file.Scenario.event1.waterLevel,
        event1Sun: file.Scenario.event1.sunLevel,

        event2Name: file.Scenario.event2.name,
        event2Start: file.Scenario.event2.when,
        event2Water: file.Scenario.event2.waterLevel,
        event2Sun: file.Scenario.event2.sunLevel,

        event3Name: file.Scenario.event3.name,
        event3Start: file.Scenario.event3.when,
        event3Water: file.Scenario.event3.waterLevel,
        event3Sun: file.Scenario.event3.sunLevel,
    } */
    //currentSituation = 1;
    //currentSituation.winCond = 10;
    //currentSituation.playerPos = data.Scenario.playerPos;
    return currentSituation;
} 


export function generateEventLevels(eventTime: number, eventSun: number, eventWater: number) {

    /* if(eventTime == cellData[0][0].cellTime){
        console.log(ce)
    }
 */
    
    for (let i = 0; i < numTiles; i++) {
      for (let j = 0; j < numTiles; j++) {
        if(eventTime == cellData[i][j].cellTime){
            const currCell = cellData[i][j];
        // give levels all
        currCell.sunLevel = eventSun;
        currCell.waterLevel = eventWater;
        //currCell.cellTime += 1;
        if (currCell.plant != undefined) {
          currCell.plant?.advanceTime(currCell.sunLevel, currCell.waterLevel);
        }
        } 
      }
    }
  }