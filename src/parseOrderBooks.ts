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
    console.log(exchangeId)

    // TODO: вынести эту логику выше, так как она повторяется в сборе трейдов и свечек
    // получаем список пар, которые есть на бирже
    const exchangePairs = store.exchanges[exchangeId].pairs;
    // console.log({exchangePairs});

    // ОТЛАДКА:
    // выводим список пар на бирже okex (почему-то пустой список)
    // const exchangePairsOkex = store.exchanges['okex'].pairs;
    // console.log(exchangePairsOkex);

    // получаем список активных пар
    // const exchangePairsActive = _.filter(exchangePairs, pair => pair.active === true); // TODO: не работает, так как в store нет active
    const exchangePairsActive = _.filter(exchangePairs, pair => _.has(exchangePairs, pair.id));
    console.log({exchangePairsActive});
    // поулчаем их id
    const exchangePairsActiveIds = _.map(exchangePairsActive, pair => pair.id);
    console.log({exchangePairsActiveIds});
    // запускаем парсинг
    parseOrderBooksOne({exchangeId, pairIds: exchangePairsActiveIds});

  }

}

export const parseOrderBooksOne = async ({exchangeId, pairIds}: {exchangeId: string, pairIds: string[]}) => {
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