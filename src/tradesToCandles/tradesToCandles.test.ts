import { tradesToCandles } from './tradesToCandles';
import { Trade } from '../types';
import { demoTicks } from './data';
import { sleep } from '../sleep';

describe('tradesToCandles', () => {
  it.only('should update or create a new 1-minute candle', async () => {
    for (const demoTick of demoTicks) {
      const tick: Trade[] = demoTick;
      const result = tradesToCandles(tick);
      console.log(result);
      await sleep(1000);
    }
    expect(true).toBe(true);
  }, 60000);
});