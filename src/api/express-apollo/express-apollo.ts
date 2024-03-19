import express from 'express';
import cors from 'cors';
import { store } from "../../db/store/store";
import { intervalFn } from "../../intervalFn";
import { upsertAsset, upsertExchange, upsertInstrument, upsertPair, saveOrderBookHistoryByTimer } from "../../db/db";
import { parseOrderBooks, parseTrades, parseCandles } from "../../index";
import debug from "debug";
import _ from "lodash";
import { OrderBook } from '../../types';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

const log = debug("index");

// Определение схемы
const typeDefs = `
  type Book {
    title: String
    author: String
  }
  type Pair {
    id: String
    baseId: String
    quoteId: String
    active: Boolean
  }

  type Query {
    books: [Book]
    pairs: [Pair]
  }
`;

// Резолверы (функции для обработки запросов)
const resolvers = {
  Query: {
    books: () => [
      { title: 'Book 1', author: 'Author 1' },
      { title: 'Book 2', author: 'Author 2' },
    ],
    pairs: () => {
      return Object.values(store.pairs);
    }
  },
};


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
    const { instrumentId, exchangeId, active } = req.query;
    if (instrumentId && (active === 'true' || active === 'false')) {
      upsertInstrument({ dbs: ['store'], instrument: {...store.instruments[instrumentId], active: JSON.parse(active)}});
    } else if (instrumentId) {
      res.json(store.instruments[instrumentId])
    } else if (exchangeId) {
      // TODO: возвращать инструменты по одной бирже
    } else {
      res.json(store.instruments)
    }
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

export const startExpressApollo = async () => {
  // Create an Apollo Server
  const server = new ApolloServer({ typeDefs, resolvers });

  // Note you must call `start()` on the `ApolloServer`
  // instance before passing the instance to `expressMiddleware`
  await server.start();

  // Specify the path where we'd like to mount our server
  app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(server));

  // Start the server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
  });
}
