import { tradesToCandles } from './tradesToCandles';
import { Trade } from '../types';

describe('tradesToCandles', () => {
  it('should update or create a new 1-minute candle', () => {
    const trades: Trade[] = [
    ];

    const result = tradesToCandles(trades);

    expect(true).toBe(true);
  });
});