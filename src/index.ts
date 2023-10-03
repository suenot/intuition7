import debug from "debug";
import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import { store } from "./db/store/store";
import { intervalFn } from "./intervalFn";
import ccxt from "ccxt";
import { upsertAsset, upsertExchange, upsertInstrument, upsertPair } from "./db/db";

const log = debug("index");

(async () => {
  await intervalFn();
  setInterval(async () => {
    await intervalFn();
  }, 10000);
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
  .get("/assets", (context) => store.assets)
  .get("/assets/:id", ({ query: { active }, params: { id } }) => {
    if (active === 'true' || active === 'false') {
      upsertAsset({ dbs: ['store', 'nedb'], asset: {...store.assets[id], active: JSON.parse(active)}});
    }
    return store.assets[id];
  })
  .get("/instruments", (context) => store.instruments)
  .get("/instruments/:id", ({ query: { active }, params: { id } }) => {
    if (active === 'true' || active === 'false') {
      upsertInstrument({ dbs: ['store', 'nedb'], instrument: {...store.instruments[id], active: JSON.parse(active)}});
    }
    return store.instruments[id];
  })
  .get("/pairs", (context) => store.pairs)
  .get("/pairs/:id", ({ query: { active }, params: { id } }) => {
    if (active === 'true' || active === 'false') {
      upsertPair({ dbs: ['store', 'nedb'], pair: {...store.pairs[id], active: JSON.parse(active)}});
    }
    return store.pairs[id];
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
