import ccxt from "ccxt";
import { orderBookCcxtToCore } from "./orderBookCcxtToCore/orderBookCcxtToCore";
import { OrderBook as CcxtOrderBook, OrderBookSubscription as CcxtOrderBookSubscription } from "./ccxtTypes";
import { upsertOrderBoook } from "./db/db";

export const parseOrderBooks = async () => {
  const binance = new ccxt.pro.binance({});
  const symbols = ['BTC/USDT', 'ETH/USDT', 'DOGE/USDT'];

  while (true) {
      const orderBookCcxt: CcxtOrderBookSubscription = await binance.watchOrderBookForSymbols(symbols);
      const pairId = orderBookCcxt?.symbol;
      const exchangeId = 'binance';
      const baseId = pairId.split('/')[0];
      const quoteId = pairId.split('/')[1];
      const instrumentId = `${baseId}/${quoteId}/${exchangeId}`;
      const orderBook = orderBookCcxtToCore({orderBookCcxt, pairId, exchangeId, instrumentId, baseId, quoteId});
      upsertOrderBoook({ orderBook, instrumentId, exchangeId, pairId, baseId, quoteId });
  }
}