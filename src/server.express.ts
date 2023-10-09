import express from 'express';
import cors from 'cors';
import { store } from "./db/store/store";
import { intervalFn } from "./intervalFn";
import { upsertAsset, upsertExchange, upsertInstrument, upsertPair } from "./db/db";
import { parseOrderBooks } from "./parseOrderBooks";
import debug from "debug";
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

const app = express()
  .use(cors())
  .get("/ping", (req: any, res: any) => res.send("pong"))
  .get('/exchanges', (req: any, res: any) => {
    res.json(store.exchanges);
  })
  .get('/exchanges/:id', (req: any, res: any) => {
    const { id } = req.params;
    const { active } = req.query;
    if (active === 'true' || active === 'false') {
      upsertExchange({ dbs: ['store', 'nedb'], exchange: {...store.exchanges[id], active: JSON.parse(active)}});
    }
    res.json(store.exchanges[id]);
  })
  .get("/orderbook", (req: any, res: any) => {
    const { exchange, base, quote } = req.query;
    log("orderbook", exchange, base, quote);
    if (exchange && base && quote) {
      res.json(store.orderBooksByBase?.[base]?.[quote]?.[exchange] || []);
    } else if (base && quote) {
      res.json(store.orderBooksByBase?.[base]?.[quote] || {});
    } else if (base) {
      res.json(store.orderBooksByBase?.[base] || {});
    } else {
      res.json(store.orderBooksByBase || {});
    }
  })
  .get("/orderbook-history", (req: any, res: any) => {
    const { exchange, base, quote } = req.query;
    log("orderbook-history", exchange, base, quote);
    if (exchange && base && quote) {
      res.json( store.orderBooksHistoryByBase?.[base as string]?.[quote as string]?.[exchange as string] || [] );
    } else if (base && quote) {
      res.json( store.orderBooksHistoryByBase?.[base as string]?.[quote as string] || {} );
    } else if (base) {
      res.json( store.orderBooksHistoryByBase?.[base as string] || {} );
    } else {
      res.json( store.orderBooksHistoryByBase || [] );
    }
  })
  .get("/assets/", (req: any, res: any) => {
    const { id, active } = req.query;

    if (id && (active === 'true' || active === 'false')) {
      upsertAsset({ dbs: ['store', 'nedb'], asset: {...store.assets[id], active: JSON.parse(active)}});
    } else {
      if (id) {
        res.json( store.assets[id] );
      }
    }
    res.json( store.assets );
  })
  .get("/instruments", (req: any, res: any) => {
    const { id, active } = req.query;
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
  .get("/pairs", (req: any, res: any) => {
    const { id, active } = req.query;
    if (id && (active === 'true' || active === 'false')) {
      upsertPair({ dbs: ['store', 'nedb'], pair: {...store.pairs[id], active: JSON.parse(active)}});
    } else {
      if (id) {
        res.json( store.pairs[id] );
      }
    }
    res.json( store.pairs );
  })
  .get("/trades", () => store.trades)
  .get("/candles", () => store.candles)
  .get("/users", () => store.users)
  .get("/users/:id", (req: any, res: any) => {
    const { id } = req.params;
    return store.users[id];
  })
  .get("/strategies", () => store.strategies)
  .get("/strategies/:id", (req: any, res: any) => {
    const { id } = req.params;
    res.json( store.strategies[id] );
  })
  .get("/signals", () => store.signals)
  .get("/signals/:id", (req: any, res: any) => {
    const { id } = req.params;
    res.json( store.signals[id] );
  })
  .get("/bots", () => store.bots)
  .get("/bots/:id", (req: any, res: any) => {
    const { id } = req.params;
    res.json( store.bots[id] );
  })


app.listen(7771, () => console.log('Server running on port 7771'));