import { Candle } from '../../types';

const demoCandles: Candle[] = [
  {
    "id": "BTC/USDT/binance/tick",
    "exchangeId": "binance",
    "instrumentId": "BTC/USDT/binance",
    "pairId": "BTC/USDT",
    "baseId": "BTC",
    "quoteId": "USDT",
    "timestamp": 1703599602794,
    "timeframeMs": 0,
    "timeframeName": "tick",
    "status": "closed",
    "open": 42661.13,
    "high": 42661.13,
    "low": 42661.12,
    "close": 42661.12,
    "volume": 1000,
  },
  {
    "id": "BTC/USDT/binance/tick",
    "exchangeId": "binance",
    "instrumentId": "BTC/USDT/binance",
    "pairId": "BTC/USDT",
    "baseId": "BTC",
    "quoteId": "USDT",
    "timestamp": 1703599602794,
    "timeframeMs": 0,
    "timeframeName": "tick",
    "status": "closed",
    "open": 42661.13,
    "high": 42661.13,
    "low": 42661.12,
    "close": 42661.12,
    "volume": 1000,
  },
]
// import { candlesToCandle } from './candlesToCandle';

// describe('candlesToCandles', () => {
//   it('should update or create a new candle', async () => {
//     const result = candlesToCandle(demoCandles, 'tick', '1m');
//     console.log({ result });
//     expect(true).toBe(true);
//   }, 60000);
// });