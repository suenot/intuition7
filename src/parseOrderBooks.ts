import _ from "lodash";
import ccxt from "ccxt";
import { orderBookCcxtToCore } from "./orderBookCcxtToCore/orderBookCcxtToCore";
import { OrderBook as CcxtOrderBook, OrderBookSubscription as CcxtOrderBookSubscription } from "./ccxtTypes";
import { upsertOrderBoook } from "./db/db";
import { sleep } from "./sleep";
import debug from "debug";
import { store } from "./db/store/store";
const log = debug("parseOrderBooks");


// TODO: разбить функцию на части: сбор пересечений, цикл, запуск для одной биржи
export const parseOrderBooks = async ({exchangeIds, pairIds}: {exchangeIds: string[], pairIds: string[]}) => {
  console.log({exchangeIds, pairIds})
  // для каждой биржи свой цикл
  for (const exchangeId of exchangeIds) {
    parseOrderBooksOneExchange({exchangeId, pairIds});

  }
  sleep(5000); // TODO: временно, так как без пар уходило в бесконечный цикл
}

export const parseOrderBooksOneExchange = async ({exchangeId, pairIds}: {exchangeId: string, pairIds: string[]}) => {
  const exchangeInstance = new (ccxt.pro as any)[exchangeId]({});
  if (exchangeId in ccxt.pro) {
    while (true) {
      if (_.isEmpty(pairIds)) {
        console.log('sleep 5s')
        await sleep(5000);
      } else {
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
}