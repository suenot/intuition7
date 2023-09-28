import _ from "lodash";
import ccxt from "ccxt";
import { getExchangeOrderbook } from "./getExchangeOrderbook";
import { store } from "./store";
import { toShift } from "./toShift/toShift";
import { insertExchange, insertInstrument } from "./nedb";
import { getExchanges } from "./getExchanges";
import debug from "debug";
import { getMarketData } from "./getMarketData";
const log = debug("intervalFn");

export const intervalFn = async () => {
  log("interval");

  const { assets, pairs, instruments, exchanges, exchangesInstances } = await getMarketData(); // TODO:
  log({ assets, pairs, instruments, exchanges, exchangesInstances });
  store.assets = assets;
  store.pairs = pairs;
  store.instruments = instruments;
  store.exchanges = exchanges;
  store.exchangesInstances = exchangesInstances;

  // TODO: временный конфиг для теста
  store.exchanges['binance'].active = true;
  store.exchanges['okex'].active = true;
  // store.instruments['BTC/USDT/binance'].active = true;
  // store.instruments['BTC/USDT/okex'].active = true;
  
  for (const instrument of Object.values(instruments)) {
    // if (!instrument.active) continue;
    // if (instrument.exchangeId !== 'binance') continue;
    const base = instrument.baseId;
    const quote = instrument.quoteId;
    const pairId = `${base}/${quote}`;
    const instrumentId = instrument.id;
    const exchangeId = instrument.exchangeId;


    const orderbook = await getExchangeOrderbook(exchangeId, pairId); // TODO: пробрасывать экземпляр биржи и exchangeInstance?
    store.orderBooks[instrumentId] = orderbook;
    if (!store.orderBooksByBase[base]) store.orderBooksByBase[base] = {};
    if (!store.orderBooksByBase[base][quote])
      store.orderBooksByBase[base][quote] = {};
    store.orderBooksByBase[base][quote][exchangeId] =
      store.orderBooks[instrumentId];
    if (!store.orderBooksHistory[instrumentId])
      store.orderBooksHistory[instrumentId] = [];
    store.orderBooksHistory[instrumentId].push(_.cloneDeep(orderbook));
    if (!store.orderBooksHistoryByBase[base]) store.orderBooksHistoryByBase[base] = {};
    if (!store.orderBooksHistoryByBase[base][quote])
      store.orderBooksHistoryByBase[base][quote] = {};
    if (!store.orderBooksHistoryByBase[base][quote][exchangeId])
      store.orderBooksHistoryByBase[base][quote][exchangeId] = [];
    store.orderBooksHistoryByBase[base][quote][exchangeId] = store.orderBooksHistory[instrumentId];
    toShift(store.orderBooksHistory[instrumentId], [orderbook], 100);
  }

};
