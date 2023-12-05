import { tradesCcxtToCore } from './tradesCcxtToCore';
import { expect } from 'chai';
import { Trade as CcxtTrade, TradeSubscription as CcxtTradeSubscription } from '../ccxtTypes';
import { Trade } from '../types';

const sampleCcxtTrades: CcxtTradeSubscription[] = [
  {
    info: {},
    timestamp: 1701792806433,
    datetime: '2023-12-05T16:13:26.433Z',
    symbol: 'BTC/USDT',
    id: '3307517201',
    order: undefined,
    type: undefined,
    side: 'sell',
    takerOrMaker: undefined,
    price: 42339.3,
    amount: 0.0039,
    cost: 165.12327,
    fee: undefined,
    fees: []
  },
  {
    info: {},
    timestamp: 1701792806437,
    datetime: '2023-12-05T16:13:26.437Z',
    symbol: 'BTC/USDT',
    id: '3307517202',
    order: undefined,
    type: undefined,
    side: 'buy',
    takerOrMaker: undefined,
    price: 42339.31,
    amount: 0.00024,
    cost: 10.1614344,
    fee: undefined,
    fees: []
  }
];

const expectedTrades: Trade[] = [
  {
    // timestamp: 1701792806433,
    // datetime: '2023-12-05T16:13:26.433Z',
    // exchangeId: '',
    // pairId: '',
    // instrumentId: '',
    // baseId: '',
    // quoteId: '',
    price: 42339.3,
    amount: 0.0039,
    type: 'limit',
    total: 165.12327,
    timestampFounded: 1701792806433,
    // cost: 165.12327,
    // side: 'sell',
    // type: undefined,
    // takerOrMaker: undefined,
    // fee: undefined,
    // fees: []
  },
  {
    // timestamp: 1701792806437,
    // datetime: '2023-12-05T16:13:26.437Z',
    // exchangeId: '',
    // pairId: '',
    // instrumentId: '',
    // baseId: '',
    // quoteId: '',
    // price: 42339.31,
    // amount: 0.00024,
    // cost: 10.1614344,
    // side: 'buy',
    // type: undefined,
    // takerOrMaker: undefined,
    // fee: undefined,
    // fees: []
    price: 42339.31,
    amount: 0.00024,
    type: 'limit',
    total: 10.1614344,
    timestampFounded: 1701792806437,
  }
]

describe('orderBookCcxtToCore', () => {
  it('should convert CCXT order book data to custom format', () => {
    const result = tradesCcxtToCore({tradesCcxtToCore: sampleCcxtTrades, exchangeId: 'binance'});
    expect(result).to.deep.equal(expectedTrades);
  });
});
