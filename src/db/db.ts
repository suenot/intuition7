
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
import { Exchange, Asset, Instrument, Pair, OrderBook, Trade, Candle } from "./../types";
import { store } from "./store/store";
import _ from "lodash";
import { getExchangeOrderbook } from "../getExchangeOrderbook";
import { toShift } from "../toShift/toShift";
import debug from "debug";
const log = debug("db");

export const upsertExchange = async ({ dbs, exchange}: { dbs: String[], exchange: Exchange }) => {
  for (const db of dbs) {
    try {
      switch (db) {
        case "nedb":
          await upsertExchangeNedb(exchange);
          break;
        case "store":
          await upsertExchangeStore(exchange);
          break;
        default:
          break;
      }
    } catch (e) { log(e) };
  };
};

export const upsertAsset = async ({ dbs, asset}: { dbs: String[], asset: Asset }) => {
  for (const db of dbs) {
    try {
      switch (db) {
        case "nedb":
          await upsertAssetNedb(asset);
          break;
        case "store":
          await upsertAssetStore(asset);
          break;
        default:
          break;
      }
    } catch (e) { log(e) };
  }
};

export const upsertPair = async ({ dbs, pair}: { dbs: String[], pair: Pair }) => {
  for (const db of dbs) {
    try {
      switch (db) {
        case "nedb":
          await upsertPairNedb(pair);
          break;
        case "store":
          await upsertPairStore(pair);
          break;
        default:
          break;
      }
    } catch (e) { log(e) };
  }
};

export const upsertInstrument = async ({ dbs, instrument}: { dbs: String[], instrument: Instrument }) => {
  for (const db of dbs) {
    try {
      switch (db) {
        case "nedb":
          await upsertInstrumentNedb(instrument);
          break;
        case "store":
          await upsertInstrumentStore(instrument);
          break;
        default:
          break;
      }
    } catch (e) { log(e) };
  }
};

export const upsertOrderBook = async (orderBook: OrderBook) => {
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

export const saveOrderBookHistoryByTimer = async (timer: number) => {
  setInterval(async () => {
    await saveOrderBookHistoryList();
  }, timer);
}

export const saveOrderBookHistoryList = async () => {
  // Проходим по всем активным биржам и активным парам и сохраняем историю
  const exchanges = _.filter(store.exchanges, (exchange) => exchange.active === true);
  const pairs = _.filter(store.pairs, (pair) => pair.active === true);
  for (const exchange of exchanges) {
    for (const pair of pairs) {
      try {
        await saveOrderBookHistory(store.orderBooksByBase[pair.baseId][pair.quoteId][exchange.id])
      } catch (e) { log(e) };
    }
  }
}

export const saveOrderBookHistory = async (orderBook: OrderBook) => {
  try {
    const orderBookCloned = _.cloneDeep(orderBook)
    
    // Нормализуем время до точности 1 секунда, так как биржи отдают с разной скоростью
    orderBookCloned.timestamp = Number(orderBookCloned.timestamp.toString().slice(0, -3) + '000');
    log(orderBookCloned.timestamp)

    const { instrumentId, exchangeId, baseId, quoteId } = orderBookCloned;
    if (!store.orderBooksHistory[instrumentId]) store.orderBooksHistory[instrumentId] = [];
    store.orderBooksHistory[instrumentId].push(orderBookCloned);
    if (!store.orderBooksHistoryByBase[baseId]) store.orderBooksHistoryByBase[baseId] = {};
    if (!store.orderBooksHistoryByBase[baseId][quoteId])
      store.orderBooksHistoryByBase[baseId][quoteId] = {};
    if (!store.orderBooksHistoryByBase[baseId][quoteId][exchangeId])
      store.orderBooksHistoryByBase[baseId][quoteId][exchangeId] = [];
    store.orderBooksHistoryByBase[baseId][quoteId][exchangeId] = store.orderBooksHistory[instrumentId];
    toShift(store.orderBooksHistory[instrumentId], [orderBookCloned], 100);
  } catch (e) { log(e) };
};

export const upsertTrades = async ({trades, callback}: {trades: Trade[], callback?: Function}) => {
  log('upsertTrades', {trades});
  for (const trade of trades) {
    if (!store.trades[trade.instrumentId]) store.trades[trade.instrumentId] = [];
    store.trades[trade.instrumentId].push(trade);
  }
  callback && callback();
  return trades;
}

export const upsertCandles = async ({candles}: {candles: Candle[]}) => {
  log('upsertCandles', {candles});

  for (const candle of candles) {
    log({candle});
    if (candle.id === undefined || candle.timeframeName === undefined || candle.timestamp === undefined) continue;
    if (!store.candles) store.candles = {};
    if (!store.candles[candle.id]) store.candles[candle.id] = {};
    store.candles[candle.id][candle.timestamp] = candle;
  }
  return candles;
}

// TODO: не готово
// export const upsertCandle = async ({candle}: {candle: Candle}) => {
//   log('upsertCandle', {candle});
//   return candle;
// }
