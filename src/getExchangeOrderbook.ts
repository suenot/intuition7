import ccxt from "ccxt";
import { OrderBook as CcxtOrderBook } from "ccxt";
import {
  OrderBook
} from "./types";

export const getExchangeOrderbook = async (exchangeId: string, symbol: string): Promise<OrderBook> => {
  try {
    // console.log('getExchangeOrderbook', {exchangeId, symbol});
    const exchange = new (ccxt as any)[exchangeId]();
    const orderBook: CcxtOrderBook = await exchange.fetchOrderBook(symbol);

    // Convert CCXT order book data to the specified format
    const bids = orderBook.bids.map((bid) => {
      return {
        price: bid[0],
        amount: bid[1],
        type: 'bid',
        total: bid[0] * bid[1],
      };
    });

    const asks = orderBook.asks.map((ask) => {
      return {
        price: ask[0],
        amount: ask[1],
        type: 'ask',
        total: ask[0] * ask[1],
      };
    });

    // Create the OrderBook object
    const orderBookFormatted = {
      timestamp: orderBook.timestamp,
      data: [...bids, ...asks],
    };

    // console.log(orderBookFormatted);
    return orderBookFormatted;
  } catch (error) {
    console.error(`Ошибка при получении стакана на бирже ${exchangeId}:`, error);
    return {
      timestamp: new Date().getTime(),
      data: [],
    };
  }
}