import { tradesToCandles } from './tradesToCandles';
// import { candlesToCandle } from './candlesToCandle';
import { Trade, Candle, Dictionary } from '../../types';
// import { upsertCandle } from './upsertCandle';

import { demoTrades } from './data';
import { sleep } from '../../index';
import _ from 'lodash';
import fs from 'fs'; // TEMP: write to file ./dataCandlesResult.json
// import dataCandlesResult from './dataCandlesResult';
// import { demoCandleIndicators } from './demoCandleIndicators';
import { createStoreCandlesId } from '../../createStoreCandlesId/createStoreCandlesId';

// split by 10 items or less from demoTrades with lodash
// const demoTrades: Trade[][] = _.chunk(demoTrades, 10);
// console.log({demoTicks});

describe('tradesToCandles', () => {
  it.only('should generate candles', async () => {
    const candles = await tradesToCandles({trades: demoTrades, pair: 'BTCUSDT', timeframeName: '0.1s'});
    console.log({candles});
    expect(true).toBe(true);
    // разбитые свечки на n timeframes
  }, 60000);



  // it('ticks candles to 1m candle', async () => {
  //   expect(true).toBe(true);
  // });
});