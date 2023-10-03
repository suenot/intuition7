import debug from "debug";
import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import { store } from "./store";
import { intervalFn } from "./intervalFn";
import ccxt from "ccxt";

const log = debug("index");

// (async () => {
//   await intervalFn();
//   setInterval(async () => {
//     await intervalFn();
//   }, 10000);
// })();

const binance = new ccxt.pro.binance({});
const symbols = ['BTC/USDT', 'ETH/USDT', 'DOGE/USDT'];
const symbolsTimeframes = [['BTC/USDT', '1m'], ['ETH/USDT', '1m'], ['DOGE/USDT', '1m']];
while (true) {
    // const trades = await binance.watchTradesForSymbols(symbols);
    // console.log(trades);
    // const orderbook = await binance.watchOrderBookForSymbols(symbols);
    // console.log(orderbook);
    const ohlcvs = await binance.watchOHLCVForSymbols(symbolsTimeframes);
    console.log(ohlcvs);
}

const app = new Elysia()
  .use(cors())
  .get("/ping", () => "pong")
  .get('/exchanges', () => {
    return store.exchanges;
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
  .get("/instruments", (context) => store.instruments)
  .get("/pairs", (context) => store.pairs)
  .get("/trades", (context) => store.trades)
  .get("/candles", (context) => store.candles)
  .get("/users", (context) => store.users)
  .get("/strategies", (context) => store.strategies)
  .get("/signals", (context) => store.signals)
  .get("/bots", (context) => store.bots)
  .listen(7771);
