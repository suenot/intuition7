
import {
  upsertExchange as upsertExchangeNedb,
  upsertAsset as upsertAssetNedb,
  upsertInstrument as upsertInstrumentNedb,
  upsertPair as upsertPairNedb,
} from "./nedb/nedb";
import {
  upsertExchange as upsertExchangeStore,
  upsertAsset as upsertAssetStore,
  upsertInstrument as upsertInstrumentStore,
  upsertPair as upsertPairStore,
} from "./store/store";
import { Exchange, Asset, Instrument, Pair, OrderBook } from "./../types";
import { store } from "./store/store";
import _ from "lodash";
import { getExchangeOrderbook } from "../getExchangeOrderbook";
import { toShift } from "../toShift/toShift";
import debug from "debug";
const log = debug("db");

export const upsertExchange = ({ dbs, exchange}: { dbs: String[], exchange: Exchange }) => {
  for (const db of dbs) {
    try {
      switch (db) {
        case "nedb":
          upsertExchangeNedb(exchange);
          break;
        case "store":
          upsertExchangeStore(exchange);
          break;
        default:
          break;
      }
    } catch (e) { log(e) };
  };
};

export const upsertAsset = ({ dbs, asset}: { dbs: String[], asset: Asset }) => {
  for (const db of dbs) {
    try {
      switch (db) {
        case "nedb":
          upsertAssetNedb(asset);
          break;
        case "store":
          upsertAssetStore(asset);
          break;
        default:
          break;
      }
    } catch (e) { log(e) };
  }
};

export const upsertPair = ({ dbs, pair}: { dbs: String[], pair: Pair }) => {
  for (const db of dbs) {
    try {
      switch (db) {
        case "nedb":
          upsertPairNedb(pair);
          break;
        case "store":
          upsertPairStore(pair);
          break;
        default:
          break;
      }
    } catch (e) { log(e) };
  }
};

export const upsertInstrument = ({ dbs, instrument}: { dbs: String[], instrument: Instrument }) => {
  for (const db of dbs) {
    try {
      switch (db) {
        case "nedb":
          upsertInstrumentNedb(instrument);
          break;
        case "store":
          upsertInstrumentStore(instrument);
          break;
        default:
          break;
      }
    } catch (e) { log(e) };
  }
};

export const upsertOrderBoook = async (orderBook: OrderBook) => {
  try {
    const { instrumentId, exchangeId, baseId, quoteId } = orderBook;
    store.orderBooks[instrumentId] = orderBook;
    if (!store.orderBooksByBase[baseId]) store.orderBooksByBase[baseId] = {};
    if (!store.orderBooksByBase[baseId][quoteId])
      store.orderBooksByBase[baseId][quoteId] = {};
    store.orderBooksByBase[baseId][quoteId][exchangeId] =
      store.orderBooks[instrumentId];
  } catch (e) { log(e) };
};

export const saveOrderBookHistoryByTimer = (timer: number) => {
  setInterval(() => {
    saveOrderBookHistoryList();
  }, timer);
}

export const saveOrderBookHistoryList = async () => {
  // Проходим по всем активным биржам и активным парам и сохраняем историю
  const exchanges = _.filter(store.exchanges, (exchange) => exchange.active === true);
  const pairs = _.filter(store.pairs, (pair) => pair.active === true);
  for (const exchange of exchanges) {
    for (const pair of pairs) {
      try {
        saveOrderBookHistory(store.orderBooksByBase[pair.baseId][pair.quoteId][exchange.id])
      } catch (e) { log(e) };
    }
  }
}

export const saveOrderBookHistory = (orderBook: OrderBook) => {
  try {
    const orderBookCloned = _.cloneDeep(orderBook)
    
    // Нормализуем время до точности 1 секунда, так как биржи отдают с разной скоростью
    orderBookCloned.timestamp = Number(orderBook.timestamp.toString().slice(0, -3) + '000');
    console.log(orderBookCloned.timestamp)

    const { instrumentId, exchangeId, baseId, quoteId } = orderBook;
    if (!store.orderBooksHistory[instrumentId]) store.orderBooksHistory[instrumentId] = [];
    store.orderBooksHistory[instrumentId].push(orderBookCloned);
    if (!store.orderBooksHistoryByBase[baseId]) store.orderBooksHistoryByBase[baseId] = {};
    if (!store.orderBooksHistoryByBase[baseId][quoteId])
      store.orderBooksHistoryByBase[baseId][quoteId] = {};
    if (!store.orderBooksHistoryByBase[baseId][quoteId][exchangeId])
      store.orderBooksHistoryByBase[baseId][quoteId][exchangeId] = [];
    store.orderBooksHistoryByBase[baseId][quoteId][exchangeId] = store.orderBooksHistory[instrumentId];
    toShift(store.orderBooksHistory[instrumentId], [orderBook], 100);
  } catch (e) { log(e) };
};

