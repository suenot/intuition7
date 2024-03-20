import { tradesToCandle } from './tradesToCandle';
// import { candlesToCandle } from './candlesToCandle';
import { Trade, Candle, Dictionary } from '../types';
import { upsertCandle } from './upsertCandle';

import { demoTrades } from './data';
import { sleep } from '../index';
import _ from 'lodash';
import fs from 'fs'; // TEMP: write to file ./dataCandlesResult.json
import dataCandlesResult from './dataCandlesResult';
import { demoCandleIndicators } from './demoCandleIndicators';
import { createStoreCandlesId } from '../createStoreCandlesId/createStoreCandlesId';

// split by 10 items or less from demoTrades with lodash
const demoTicks: Trade[][] = _.chunk(demoTrades, 10);
// console.log({demoTicks});

describe('tradesToCandles', () => {
  it.only('should update or create a new 1-minute candle', async () => {
    const candles: Candle[] = [];
    for (const demoTick of demoTicks) {
      const tick: Trade[] = demoTick;
      const candle = tradesToCandle(tick, 'tick', demoCandleIndicators);
      // upsertCandle(candle); // TODO: временно закомеентировал
      // console.log({clusterPoints: candle.clusterPoints});
      // console.log({candle}); // TODO: временно закомеентировал
      candles.push(candle);
    }


    // // TEMP: write to file for test data ./dataCandlesResult.json
    // fs.writeFileSync('./src/tradesToCandles/dataCandlesResult.json', JSON.stringify(candles, null, 2));
    // const file = `export default ${JSON.stringify(candles, null, 2)};`;
    // try {
    //   fs.writeFileSync('./src/tradesToCandles/dataCandlesResult.ts', file);
    //   console.log('Successfully wrote file');
    // } catch (err) {
    //   console.error('Error writing file', err);
    // }
    // expect(true).toBe(true);


    // expect(JSON.parse(JSON.stringify(candles))).toStrictEqual(dataCandlesResult); // TODO: временно закомментирвоал

    // test that canles are not empty
    expect(candles.length).toBeGreaterThan(0);
  }, 60000);



  // it('ticks candles to 1m candle', async () => {
  //   expect(true).toBe(true);
  // });
});