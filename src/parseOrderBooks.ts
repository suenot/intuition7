import _ from "lodash";
import ccxt from "ccxt";
// import { pro as ccxt } from "ccxt"
import { orderBookCcxtToCore } from "./orderBookCcxtToCore/orderBookCcxtToCore";
import { OrderBook as CcxtOrderBook, OrderBookSubscription as CcxtOrderBookSubscription } from "./ccxtTypes";
import { upsertOrderBook } from "./db/db";
import { sleep } from "./sleep";
import debug from "debug";
import { store } from "./db/store/store";
const log = debug("parseOrderBooks");



export const parseOrderBooks = async ({exchangeIds, pairIds}: {exchangeIds: string[], pairIds: string[]}) => {
  log('parseOrderBooks', {exchangeIds, pairIds});
  log('For each exchange we have a separate ws connection with all pairs')
  for (const exchangeId of exchangeIds) {
    log({exchangeId});
    parseOrderBooksOneExchange({exchangeId, pairIds});
    // sleep(5000);
  }
}

export const parseOrderBooksOneExchange = async ({exchangeId, pairIds}: {exchangeId: string, pairIds: string[]}) => {
  log('parseOrderBooksOneExchange', {exchangeId, pairIds});
  const pairIdsEmpty = _.isEmpty(pairIds);
  log({pairIdsEmpty});
  const exchangeInstance = new (ccxt as any)[exchangeId]({});
  if (exchangeId in ccxt) {
    while (true) {
      if (pairIdsEmpty) {
        console.log('sleep 5s');
        await sleep(5000);
      } else {
        try {
          // const pairIds = _.filter(store.pairs, pair => (pair. === exchangeId && pair.active === true))
          const orderBookCcxt: CcxtOrderBookSubscription = await exchangeInstance.watchOrderBookForSymbols(pairIds);
          const orderBook = orderBookCcxtToCore({orderBookCcxt, exchangeId});
          log({orderBook});
          upsertOrderBook(orderBook);
        } catch (e) { log(e) };
      }
    }
  }
}