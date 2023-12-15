import data from '../example.json' assert { type: 'json' };
import {numTiles, cells, time} from './main.ts'
//please work
//consider deleting
/*  export interface situation{
    winCond: number;
    playerPos: [];
}  */

export function reader(){
    //qlet thing 
    //console.log(data.Scenario.winCondition);
    let currentSituation = {
        winCond: data.Scenario.winCondition,
        playerPos: data.Scenario.playerPos,

        event1Name: data.Scenario.event1.name,
        event1Start: data.Scenario.event1.when,
        event1Water: data.Scenario.event1.waterLevel,
        event1Sun: data.Scenario.event1.sunLevel,

        event2Name: data.Scenario.event2.name,
        event2Start: data.Scenario.event2.when,
        event2Water: data.Scenario.event2.waterLevel,
        event2Sun: data.Scenario.event2.sunLevel,

        event3Name: data.Scenario.event3.name,
        event3Start: data.Scenario.event3.when,
        event3Water: data.Scenario.event3.waterLevel,
        event3Sun: data.Scenario.event3.sunLevel,
    }
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
        if(eventTime == time){
            const currCell = cells[i][j];
        // give levels all
        
        currCell.weather.sunLevel = eventSun;
        currCell.weather.waterLevel = eventWater;
        //currCell.cellTime += 1;
        if (currCell.plant != undefined) {
          currCell.plant?.advanceTime(currCell.weather.sunLevel, currCell.weather.waterLevel);
        }
        } 
      }
    }
  }