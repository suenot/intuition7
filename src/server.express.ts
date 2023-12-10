import express from 'express';
import cors from 'cors';
import { store } from "./db/store/store";
import { intervalFn } from "./intervalFn";
import { upsertAsset, upsertExchange, upsertInstrument, upsertPair, saveOrderBookHistoryByTimer } from "./db/db";
import { parseOrderBooks } from "./parseOrderBooks";
import { parseTrades } from "./parseTrades";
import { parseCandles } from "./parseCandles";
import debug from "debug";
import _ from "lodash";
import { OrderBook } from './types';

const log = debug("index");

(async () => {
  // Сбор ассетов, пар, инструментов, бирж
  await intervalFn();

  // Сделать активными часть бирж и пар
  const exchangeIds = ['binance', 'okx', 'kucoin'];
  const pairIds = ['ETH/BTC', 'LTC/BTC', 'BTC/USDT', 'ETH/USDT', 'DOGE/USDT'];
  for (const exchangeId of exchangeIds) {
    await upsertExchange({ dbs: ['store'], exchange: {...store.exchanges[exchangeId], active: true}});
  }
  for (const pairId of pairIds) {
    await upsertPair({ dbs: ['store'], pair: {...store.pairs[pairId], active: true}});
  }

    // TODO: вынести эту логику выше, так как она повторяется в сборе трейдов и свечек
    // получаем список пар, которые есть на бирже
    // const exchangePairs = store.exchanges[exchangeId].pairs;
    // console.log({exchangePairs});

    // ОТЛАДКА:
    // выводим список пар на бирже okex (почему-то пустой список)
    // const exchangePairsOkex = store.exchanges['okex'].pairs;
    // console.log(exchangePairsOkex);

    // получаем список активных пар
    // const exchangePairsActive = _.filter(exchangePairs, pair => pair.active === true); // TODO: не работает, так как в store нет active

  // Сбор ордербуков, тиков, свечей, трейдов вебсокетами
  parseTrades({exchangeIds, pairIds});
  parseOrderBooks({exchangeIds, pairIds});
  // parseCandles({exchangeIds, pairIds});

  // Раз в 1 секунду собирать исторические данные
  // saveOrderBookHistoryByTimer(1000)

  console.log('*******************************');
  // Сбор ассетов, пар, инструментов, бирж в цикле
  // setInterval(async () => {
  //   await intervalFn();
  // }, 30000);

})();

const reverseAsks = (orderBook: OrderBook) => {
  orderBook.asks = orderBook.asks.reverse();
  return orderBook;
}

const app = express()
  .use(cors())
  .get("/ping", (req: any, res: any) => {
    console.log("pong");
    res.send("pong");
  })
  // /store - вся база данных (для отладки)
  .get('/store', (req: any, res: any) => {
    res.json(store);
  })
  .get('/exchanges', (req: any, res: any) => {
    res.json(store.exchanges);
  })
  .get('/exchanges/:id', (req: any, res: any) => {
    const { id } = req.params;
    const { active } = req.query;
    if (active === 'true' || active === 'false') {
      upsertExchange({ dbs: ['store'], exchange: {...store.exchanges[id], active: JSON.parse(active)}});
    }
    res.json(store.exchanges[id]);
  })
  .get("/orderbook", (req: any, res: any) => {
    const { exchange, base, quote } = req.query;
    log("orderbook", exchange, base, quote);
    if (exchange && base && quote) {
      var orderBook = store.orderBooksByBase?.[base]?.[quote]?.[exchange] || {};
      orderBook = reverseAsks(orderBook);
      res.json(orderBook);
    } else if (base && quote) {
      // TODO: пока без reverseAsks, так как тут словари в словаре
      res.json(store.orderBooksByBase?.[base]?.[quote] || {});
    } else if (base) {
      res.json(store.orderBooksByBase?.[base] || {});
    } else {
      res.json(store.orderBooksByBase || {});
    }
  })
  // .get("/orderbook-timestamp/", (req: any, res: any) => {
  //   const { from, to, base, quote, exchange }: { from: number, to: number, base: string, quote: string, exchange: string } = req.query;
  //   log("orderbook-timestamp", {from, to, base, quote, exchange});


  // })
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
      upsertAsset({ dbs: ['store'], asset: {...store.assets[id], active: JSON.parse(active)}});
    } else {
      if (id) {
        res.json( store.assets[id] );
      }
    }
    res.json( store.assets );
  })
  // .post("/assets/", (req: any, res: any) => {
  //   const { id, active } = req.query;

  // })
  .get("/instruments", (req: any, res: any) => {
    const { id, active } = req.query;
    if (id && (active === 'true' || active === 'false')) {
      upsertInstrument({ dbs: ['store'], instrument: {...store.instruments[id], active: JSON.parse(active)}});
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
    console.log('/pairs', {id, active});
    if (active) {
      // Возвращаем только активные пары
      const filteredPairs = _.filter(store.pairs, (pair) => {
        return pair.active === true;
      });
      res.json( _.keyBy(filteredPairs, 'id') );
    } else {
      if (id) {
        res.json( store.pairs[id] );
      }
    }
    res.json( store.pairs );
  })
  .post("/pairs", (req: any, res: any) => {
    const { id, active } = req.query;
    if (id && (active === 'true' || active === 'false')) {
      upsertPair({ dbs: ['store'], pair: {...store.pairs[id], active: JSON.parse(active)}});
    }
  })
  .get("/trades", (req: any, res: any) => {
    // TODO: выдавать ошибку, если пары не существует
    const { exchange, base, quote } = req.query;
    res.json( store.trades[`${base}/${quote}/${exchange}`] );
  })
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