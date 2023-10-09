import { OrderBook as CcxtOrderBook, OrderBookSubscription as CcxtOrderBookSubscription } from '../ccxtTypes';
// export interface CcxtOrderBook {
//   asks: [number, number][];
//   bids: [number, number][];
//   datetime: string;
//   timestamp: number;
//   nonce: number;
// }
import { OrderBook } from '../types';
// export interface OrderBook {
//   timestamp: Number,
//   lag?: Number,
//   exchangeId?: String,
//   baseId?: String,
//   quoteId?: String,
//   data: Order[],
//   trades?: any[],
// }
// export interface Order {
//   price: Number,
//   amount: Number,
//   type: String,
//   total: Number,
//   timestampFounded?: Number,
//   userId?: String,
//   strategyId?: String,
// }

/**
 * Converts order book data from the CCXT format to a custom specified format (OrderBook).
 *
 * @param {CcxtOrderBook} orderBookCcxt - The order book data in the CCXT format to be converted.
 * @returns {OrderBook} - The order book data in the custom specified format (OrderBook).
 */
export const orderBookCcxtToCore = ({orderBookCcxt, pairId, baseId, quoteId, instrumentId, exchangeId}: {orderBookCcxt: CcxtOrderBookSubscription, pairId: string, baseId: string, quoteId: string, instrumentId: string, exchangeId: string}): OrderBook => {
  // Convert CCXT order book data to the specified format
  const bids = orderBookCcxt.bids.map((bid) => {
    return {
      price: bid[0],
      amount: bid[1],
      type: 'bid',
      total: Number((bid[0] * bid[1]).toFixed(8)),
    };
  });

  const asks = orderBookCcxt.asks.map((ask) => {
    return {
      price: ask[0],
      amount: ask[1],
      type: 'ask',
      total: Number((ask[0] * ask[1]).toFixed(8)),
    };
  });

  // Create the OrderBook object
  const orderBookFormatted = {
    pairId,
    baseId,
    quoteId,
    exchangeId,
    instrumentId,
    timestamp: orderBookCcxt.timestamp,
    data: [...bids, ...asks],
  };

  // Return the order book data in the custom specified format
  return orderBookFormatted;
}