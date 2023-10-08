
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

export const upsertOrderBoook = async ({ orderbook, instrumentId, exchangeId, pairId, base, quote }: { orderbook: OrderBook, instrumentId: string, exchangeId: string, pairId: string, base: string, quote: string }) => {
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