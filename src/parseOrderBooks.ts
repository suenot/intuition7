import ccxt from "ccxt";
import { orderBookCcxtToCore } from "./orderBookCcxtToCore/orderBookCcxtToCore";
import { OrderBook as CcxtOrderBook, OrderBookSubscription as CcxtOrderBookSubscription } from "./ccxtTypes";
import { upsertOrderBoook } from "./db/db";
import debug from "debug";
import { store } from "./db/store/store";
const log = debug("parseOrderBooks");

// TODO: разбить функцию на части: сбор пересечений, цикл, запуск для одной биржи
export const parseOrderBooks = ({exchangeIds, pairIds}: {exchangeIds: string[], pairIds: string[]}) => {
  console.log({exchangeIds, pairIds})
  // для каждой биржи свой цикл
  for (const exchangeId of exchangeIds) {
    console.log(exchangeId)
      
    // TODO:
    // получаем список пар, которые есть на бирже
    // ищем пересечение пар
    // отдаем пары
    parseOrderBooksOne({exchangeId, pairIds})
  }

}

export const parseOrderBooksOne = async ({exchangeId, pairIds}: {exchangeId: string, pairIds: string[]}) => {
  const exchangeInstance = new (ccxt.pro as any)[exchangeId]({});
  if (exchangeId in ccxt.pro) {
    while (true) {
      try {
        // можно просто каждый раз брать список актуальных парх
        // const pairIds = _.filter(store.pairs, pair => (pair. === exchangeId && pair.active === true))
        const orderBookCcxt: CcxtOrderBookSubscription = await exchangeInstance.watchOrderBookForSymbols(pairIds);
        const orderBook = orderBookCcxtToCore({orderBookCcxt, exchangeId});
        upsertOrderBoook(orderBook);
      } catch (e) { log(e) };
    }
  }
}