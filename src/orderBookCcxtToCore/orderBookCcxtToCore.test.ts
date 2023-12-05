import { orderBookCcxtToCore } from './orderBookCcxtToCore';
import { expect } from 'chai';
import { OrderBook as CcxtOrderBook, OrderBookSubscription as CcxtOrderBookSubscription } from '../ccxtTypes';
import { OrderBook } from '../types';

// Sample CCXT Orderbook data
const sampleCcxtOrderbook: CcxtOrderBookSubscription = {
  asks: [
    [0.06008, 28.8976],
    [0.06009, 30.6959],
  ],
  bids: [
    [0.06007, 44.1469],
    [0.06006, 26.8385],
  ],
  timestamp: 123456789,
  datetime: '2020-01-01T00:00:00.000Z',
  nonce: 123,
  symbol: 'ETH/BTC',
};

// Expected Orderbook data
const expectedOrderbook: OrderBook = {
  timestamp: 123456789,
  data: [
    { price: 0.06007, amount: 44.1469, type: 'bid', total: 2.65190428 },
    { price: 0.06006, amount: 26.8385, type: 'bid', total: 1.61192031 },
    { price: 0.06008, amount: 28.8976, type: 'ask', total: 1.73616781 },
    { price: 0.06009, amount: 30.6959, type: 'ask', total: 1.84451663 },
  ],
  exchangeId: '',
  pairId: '',
  instrumentId: '',
  baseId: '',
  quoteId: '',
};

describe('orderBookCcxtToCore', () => {
  it('should convert CCXT order book data to custom format', () => {
    const result = orderBookCcxtToCore({orderBookCcxt: sampleCcxtOrderbook, exchangeId: 'binance'});
    expect(result).to.deep.equal(expectedOrderbook);
  });
});
