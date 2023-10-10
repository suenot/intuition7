import ccxt from "ccxt";
import { orderBookCcxtToCore } from "./orderBookCcxtToCore/orderBookCcxtToCore";
import { OrderBook as CcxtOrderBook, OrderBookSubscription as CcxtOrderBookSubscription } from "./ccxtTypes";
import { upsertOrderBoook } from "./db/db";

export const parseOrderBooks = async () => {
  // читаем активные биржи и запускаем для каждой из них парсинг стаканов
  const exchangesId = ['binance', 'okex']
  const pairsId = ['BTC/USDT', 'ETH/USDT', 'DOGE/USDT'];

    // для каждой биржи свой цикл
  for (const exchangeId of exchangesId) {
    if (exchangeId in ccxt.pro) {
      const exchangeInstance = new (ccxt.pro as any)[exchangeId]({});
      while (true) {
        const orderBookCcxt: CcxtOrderBookSubscription = await exchangeInstance.watchOrderBookForSymbols(pairsId);
        const orderBook = orderBookCcxtToCore({orderBookCcxt, exchangeId});
        upsertOrderBoook(orderBook);
      }
    }
  }

}