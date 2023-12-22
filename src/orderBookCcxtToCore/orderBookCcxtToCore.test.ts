import { OrderBook as CcxtOrderBook, OrderBookSubscription as CcxtOrderBookSubscription } from '../ccxtTypes';
import { OrderBook } from '../types';
import { orderBookCcxtToCore } from './orderBookCcxtToCore';

describe('orderBookCcxtToCore', () => {
  it('should convert CCXT order book data to custom format', () => {
    const mockOrderBookCcxt: CcxtOrderBookSubscription = {
      symbol: 'BTC/USD',
      bids: [[50000, 1], [49900, 2]],
      asks: [[50100, 1], [50200, 2]],
      timestamp: 1622547600000,
      datetime: '2021-06-01T00:00:00.000Z',
      nonce: 1,
    };

    const result = orderBookCcxtToCore({ orderBookCcxt: mockOrderBookCcxt, exchangeId: 'binance' });

    expect(result).toEqual({
      pairId: 'BTC/USD',
      baseId: 'BTC',
      quoteId: 'USD',
      exchangeId: 'binance',
      instrumentId: 'BTC/USD/binance',
      timestamp: 1622547600000,
      lag: 0,
      asks: [
        { price: 50100, amount: 1, type: 'ask', total: 50100, sum: 1, percent: expect.closeTo(33.33, 1), percentSum: expect.closeTo(33.33, 1), users: [], timestampFounded: undefined, strategyId: undefined },
        { price: 50200, amount: 2, type: 'ask', total: 100400, sum: 3, percent: expect.closeTo(66.66, 1), percentSum: 100, users: [], timestampFounded: undefined, strategyId: undefined },
      ],
      bids: [
        { price: 50000, amount: 1, type: 'bid', total: 50000, sum: 1, percent: expect.closeTo(33.33, 1), percentSum: expect.closeTo(33.33, 1), users: [], timestampFounded: undefined, strategyId: undefined },
        { price: 49900, amount: 2, type: 'bid', total: 99800, sum: 3, percent: expect.closeTo(66.66, 1), percentSum: 100, users: [], timestampFounded: undefined, strategyId: undefined },
      ],
      trades: [],
      spread: 100,
      spreadPercent: 0.2,
      sum: 6,
      bidsSum: 3,
      asksSum: 3,
      bestBidPrice: 50000,
      bestAskPrice: 50100,
    });
  });
});
