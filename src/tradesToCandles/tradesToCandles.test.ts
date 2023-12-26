import { tradesToCandle, candlesToCandle, upsertCandle } from './tradesToCandles';
import { Trade } from '../types';
import { demoTrades } from './data';
import { sleep } from '../sleep';
import _ from 'lodash';

// split by 10 items or less from demoTrades with lodash
const demoTicks: Trade[][] = _.chunk(demoTrades, 10);
// console.log({demoTicks});

describe('tradesToCandles', () => {
  it('should update or create a new 1-minute candle', async () => {
    for (const demoTick of demoTicks) {
      const tick: Trade[] = demoTick;
      const candle = tradesToCandle(tick, 'tick');
      upsertCandle(candle);
      console.log({clusterPoints: candle.clusterPoints});
      await sleep(1000);
    }
    expect(true).toBe(true);
  }, 60000);

  // it('ticks candles to 1m candle', async () => {
  //   expect(true).toBe(true);
  // });
});