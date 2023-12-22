import { OrderBook as CcxtOrderBook, OrderBookSubscription as CcxtOrderBookSubscription } from '../ccxtTypes';
// export interface CcxtOrderBook {
//   asks: [number, number][]; // [price, amount]
//   bids: [number, number][]; // [price, amount]
//   datetime: string;
//   timestamp: number;
//   nonce: number;
// }
import { OrderBook } from '../types';
// export interface Order {
//   price: number,
//   amount: number,
//   type: string,
//   total: number,
//   sum: number,
//   percent: number, // процент "стенки" от общей стороны сткана
//   percentSum: number, // процент для отрисовки так называемого "крокодила" (объема по нарастанию, где последний элемент имеет 100%)
//   users?: User[], // мы в стакане видем склееные ордера многих пользователей, поэтому массив
//   timestampFounded?: number, // время нахождения стенки в стакане
//   strategyId?: string,
// }

// export interface OrderBook {
//   timestamp: number,
//   lag?: number,
//   instrumentId: string,
//   exchangeId: string,
//   pairId: string,
//   baseId: string,
//   quoteId: string,
//   bids: Order[],
//   asks: Order[],
//   trades?: any[],
//   spread: number,
//   spreadPercent: number,
//   sum: number,
//   bidsSum: number,
//   asksSum: number,
//   bestBidPrice: number,
//   bestAskPrice: number,
// }
/**
 * Converts order book data from the CCXT format to a custom specified format (OrderBook).
 *
 * @param {CcxtOrderBook} orderBookCcxt - The order book data in the CCXT format to be converted.
 * @returns {OrderBook} - The order book data in the custom specified format (OrderBook).
 */
export const orderBookCcxtToCore = ({orderBookCcxt, exchangeId}: {orderBookCcxt: CcxtOrderBookSubscription, exchangeId: string}): OrderBook => {
  const pairId = orderBookCcxt?.symbol;
  const baseId = pairId.split('/')[0];
  const quoteId = pairId.split('/')[1];
  const instrumentId = `${baseId}/${quoteId}/${exchangeId}`;
  // const bidsSum: number = orderBookCcxt.bids.reduce((sum, bid) => sum + bid[1], 0);
  // const asksSum: number = orderBookCcxt.asks.reduce((sum, ask) => sum + ask[1], 0);
  var bidsSum = 0;
  var asksSum = 0;


  // Convert CCXT order book data to the specified format
  var bids = orderBookCcxt.bids.map((bid) => {
    bidsSum += bid[1];
    return {
      price: bid[0],
      amount: bid[1],
      type: 'bid',
      total: Number((bid[0] * bid[1]).toFixed(8)),
      sum: bidsSum, // replace with actual logic
      percent: 0, // replace with actual logic
      percentSum: 0, // replace with actual logic
      users: [], // replace with actual logic
      timestampFounded: undefined, // replace with actual logic
      strategyId: undefined, // replace with actual logic
    };
  });

  bids = bids.map((bid) => {
    bid.percent = (bid.amount / bidsSum) * 100;
    bid.percentSum = bid.sum / bidsSum * 100;
    return bid;
  });

  var asks = orderBookCcxt.asks.map((ask) => {
    asksSum += ask[1];
    return {
      price: ask[0],
      amount: ask[1],
      type: 'ask',
      total: Number((ask[0] * ask[1]).toFixed(8)),
      sum: asksSum, // replace with actual logic
      percent: 0, // replace with actual logic
      percentSum: 0, // replace with actual logic
      users: [], // TODO: replace with actual logic
      timestampFounded: undefined, // TODO: replace with actual logic
      strategyId: undefined, // TODO: replace with actual logic
    };
  });

  asks = asks.map((ask) => {
    ask.percent = (ask.amount / asksSum) * 100;
    ask.percentSum = ask.sum / asksSum * 100;
    return ask;
  });

  const sum = bidsSum + asksSum;
  const bestBidPrice = bids[0]?.price;
  const bestAskPrice = asks[0]?.price;
  const spread = bestAskPrice - bestBidPrice;
  const spreadPercent = (spread / bestBidPrice) * 100;
  // Create the OrderBook object
  const orderBookFormatted = {
    pairId,
    baseId,
    quoteId,
    exchangeId,
    instrumentId,
    timestamp: orderBookCcxt.timestamp,
    lag: 0, // TODO: replace with actual logic
    // data: [...bids, ...asks], // REMOVED!
    asks,
    bids,
    trades: [], // TODO: replace with actual logic
    spread,
    spreadPercent,
    sum,
    bidsSum,
    asksSum,
    bestBidPrice,
    bestAskPrice,
  };

  // Return the order book data in the custom specified format
  return orderBookFormatted;
}