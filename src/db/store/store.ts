import {
  Store,
  Exchange,
  Asset,
  Pair,
  Instrument,
} from "../../types";

export const store: Store = {
  modules: {},
  exchanges: {},
  assets: {},
  pairs: {},
  instruments: {},
  users: {},
  strategies: {},
  signals: {},
  bots: {},
  orderBooks: {},
  orderBooksByBase: {},
  orderBooksHistory: {},
  orderBooksHistoryByBase: {},
  trades: [],
  candles: [],
  exchangesInstances: {},
}

export const upsertExchange = (exchange: Exchange) => {
  if (!store.exchanges[exchange.id]) store.exchanges[exchange.id] = exchange;
  else store.exchanges[exchange.id] = { ...store.exchanges[exchange.id], ...exchange };
}

export const upsertAsset = (asset: Asset) => {
  if (!store.assets[asset.id]) store.assets[asset.id] = asset;
  else store.assets[asset.id] = { ...store.assets[asset.id], ...asset };
}

export const upsertPair = (pair: Pair) => {
  if (!store.pairs[pair.id]) store.pairs[pair.id] = pair;
  else store.pairs[pair.id] = { ...store.pairs[pair.id], ...pair };
}

export const upsertInstrument = (instrument: Instrument) => {
  if (!store.instruments[instrument.id]) store.instruments[instrument.id] = instrument;
  else store.instruments[instrument.id] = { ...store.instruments[instrument.id], ...instrument };
}