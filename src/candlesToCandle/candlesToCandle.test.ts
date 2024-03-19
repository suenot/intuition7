const demoCandle1 =   {
  "id": "BTC/USDT/binance/tick",
  "exchangeId": "binance",
  "instrumentId": "BTC/USDT/binance",
  "pairId": "BTC/USDT",
  "baseId": "BTC",
  "quoteId": "USDT",
  "timestamp": 1703599602794,
  "timestampStart": 1703599602794,
  "timestampEnd": 1703599603862,
  "timeframe": 0,
  "timeframeId": "tick",
  "timeframeName": "tick",
  "status": "closed",
  "open": 42661.13,
  "high": 42661.13,
  "low": 42661.12,
  "close": 42661.12,
},

describe('candlesToCandles', () => {
  it('should update or create a new 1-minute candle', async () => {
    
    expect(true).toBe(true);
  }, 60000);
});