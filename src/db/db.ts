
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

export const upsertExchange = ({ dbs, exchange}: { dbs: String[], exchange: Exchange }) => {
  for (const db of dbs) {
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
  }
};

export const upsertAsset = ({ dbs, asset}: { dbs: String[], asset: Asset }) => {
  for (const db of dbs) {
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
  }
};

export const upsertPair = ({ dbs, pair}: { dbs: String[], pair: Pair }) => {
  for (const db of dbs) {
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
  }
};

export const upsertInstrument = ({ dbs, instrument}: { dbs: String[], instrument: Instrument }) => {
  for (const db of dbs) {
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
  }
};

export const upsertOrderBoook = async ({ orderBook, instrumentId, exchangeId, pairId, baseId, quoteId }: { orderBook: OrderBook, instrumentId: string, exchangeId: string, pairId: string, baseId: string, quoteId: string }) => {
    store.orderBooks[instrumentId] = orderBook;
    if (!store.orderBooksByBase[baseId]) store.orderBooksByBase[baseId] = {};
    if (!store.orderBooksByBase[baseId][quoteId])
      store.orderBooksByBase[baseId][quoteId] = {};
    store.orderBooksByBase[baseId][quoteId][exchangeId] =
      store.orderBooks[instrumentId];
    if (!store.orderBooksHistory[instrumentId])
      store.orderBooksHistory[instrumentId] = [];
    store.orderBooksHistory[instrumentId].push(_.cloneDeep(orderBook));
    if (!store.orderBooksHistoryByBase[baseId]) store.orderBooksHistoryByBase[baseId] = {};
    if (!store.orderBooksHistoryByBase[baseId][quoteId])
      store.orderBooksHistoryByBase[baseId][quoteId] = {};
    if (!store.orderBooksHistoryByBase[baseId][quoteId][exchangeId])
      store.orderBooksHistoryByBase[baseId][quoteId][exchangeId] = [];
    store.orderBooksHistoryByBase[baseId][quoteId][exchangeId] = store.orderBooksHistory[instrumentId];
    toShift(store.orderBooksHistory[instrumentId], [orderBook], 100);
}