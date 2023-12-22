import { tradeCcxtToCore } from './tradesCcxtToCore';
import { Trade as CcxtTrade, TradeSubscription as CcxtTradeSubscription } from '../ccxtTypes';
import { Trade } from '../types';

describe('tradeCcxtToCore', () => {
  it('transforms a CcxtTrade object into a Trade object', () => {
    const tradeCcxt: CcxtTrade = {
      id: '1',
      price: 100,
      amount: 2,
      timestamp: 1633027200000,
      datetime: '2021-10-01T00:00:00.000Z',
      info: {},
      side: 'buy',
      symbol: 'BTC/USD',
      cost: 200,
    };

    const exchangeId = 'binance';

    const expectedTrade: Trade = {
      id: '1',
      price: 100,
      amount: 2,
      total: 200,
      timestamp: 1633027200000,
      info: {},
      side: 'buy',
      pairId: 'BTC/USD',
      instrumentId: 'BTC/USD/binance',
      exchangeId: 'binance',
      cost: 200,
    };

    const result = tradeCcxtToCore({ tradeCcxt, exchangeId });

    expect(result).toEqual(expectedTrade);
  });
});