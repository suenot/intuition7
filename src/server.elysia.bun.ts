import debug from "debug";
import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import { store } from "./db/store/store";
import { intervalFn } from "./intervalFn";
import { upsertAsset, upsertExchange, upsertInstrument, upsertPair } from "./db/db";
import { parseOrderBooks } from "./parseOrderBooks";

const log = debug("index");

(async () => {
  // Сбор ассетов, пар, инструментов, бирж
  await intervalFn();

  // Сбор ордербуков, тиков, свечей, трейдов вебсокетами
  await parseOrderBooks();

  // Сбор ассетов, пар, инструментов, бирж в цикле
  // setInterval(async () => {
  //   await intervalFn();
  // }, 30000);

})();

// const binance = new ccxt.pro.binance({});
// const symbols = ['BTC/USDT', 'ETH/USDT', 'DOGE/USDT'];
// const symbolsTimeframes = [['BTC/USDT', '1m'], ['ETH/USDT', '1m'], ['DOGE/USDT', '1m']];
// while (true) {
//     // const trades = await binance.watchTradesForSymbols(symbols);
//     // console.log(trades);
//     // const orderbook = await binance.watchOrderBookForSymbols(symbols);
//     // console.log(orderbook);
//     const ohlcvs = await binance.watchOHLCVForSymbols(symbolsTimeframes);
//     console.log(ohlcvs);
// }

const app = new Elysia()
  .use(cors())
  .get("/ping", () => "pong")
  .get('/exchanges', () => {
    return store.exchanges;
  })
  .get('/exchanges/:id', ({ query: { active }, params: { id } }) => {
    if (active === 'true' || active === 'false') {
      upsertExchange({ dbs: ['store', 'nedb'], exchange: {...store.exchanges[id], active: JSON.parse(active)}});
    }
    return store.exchanges[id];
  })
  .get("/orderbook", ({ query: { exchange, base, quote } }) => {
    log("orderbook", exchange, base, quote);
    if (exchange && base && quote) {
      return store.orderBooksByBase?.[base as string]?.[quote as string]?.[exchange as string] || [];
    } else if (base && quote) {
      return store.orderBooksByBase?.[base as string]?.[quote as string] || {};
    } else if (base) {
      return store.orderBooksByBase?.[base as string] || {};
    } else {
      return store.orderBooksByBase || {};
    }
  })
  .get("/orderbook-history", ({ query: { exchange, base, quote } }) => {
    log("orderbook-history", exchange, base, quote);
    if (exchange && base && quote) {
      return store.orderBooksHistoryByBase?.[base as string]?.[quote as string]?.[exchange as string] || [];
    } else if (base && quote) {
      return store.orderBooksHistoryByBase?.[base as string]?.[quote as string] || {};
    } else if (base) {
      return store.orderBooksHistoryByBase?.[base as string] || {};
    } else {
      return store.orderBooksHistoryByBase || [];
    }
  })
  .get("/assets/:id", ({ query: { active, id } }) => {
    if (id && (active === 'true' || active === 'false')) {
      upsertAsset({ dbs: ['store', 'nedb'], asset: {...store.assets[id], active: JSON.parse(active)}});
    } else {
      if (id) {
        return store.assets[id];
      }
    }
    return store.assets;
  })
  .get("/instruments", ({ query: { active, id } }) => {
    if (id && (active === 'true' || active === 'false')) {
      upsertInstrument({ dbs: ['store', 'nedb'], instrument: {...store.instruments[id], active: JSON.parse(active)}});
    } else {
      if (id) {
        return store.instruments[id];
      }
    }
    return store.instruments;
  })
  // .get("/pairs", (context) => store.pairs)
  .get("/pairs", ({ query: { active, id } }) => {
    if (id && (active === 'true' || active === 'false')) {
      upsertPair({ dbs: ['store', 'nedb'], pair: {...store.pairs[id], active: JSON.parse(active)}});
    } else {
      if (id) {
        return store.pairs[id];
      }
    }
    return store.pairs;
  })
  .get("/trades", (context) => store.trades)
  .get("/candles", (context) => store.candles)
  .get("/users", (context) => store.users)
  .get("/users/:id", ({ params: { id } }) => {
    return store.users[id];
  })
  .get("/strategies", (context) => store.strategies)
  .get("/strategies/:id", ({ params: { id } }) => {
    return store.strategies[id];
  })
  .get("/signals", (context) => store.signals)
  .get("/signals/:id", ({ params: { id } }) => {
    return store.signals[id];
  })
  .get("/bots", (context) => store.bots)
  .get("/bots/:id", ({ params: { id } }) => {
    return store.bots[id];
  })
  .listen(7771);
