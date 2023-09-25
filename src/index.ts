import debug from "debug";
import { Elysia } from "elysia";
// import { yoga } from '@elysiajs/graphql-yoga';
import { store } from "./store";
import { intervalFn } from "./intervalFn";

const log = debug("index");

(async () => {
  await intervalFn();
  setInterval(async () => {
    await intervalFn();
  }, 10000);
})();

const app = new Elysia()
  // .use(
  //     yoga({
  //         typeDefs: /* GraphQL */`
  //             type Orderbook {
  //               price: Float!
  //               amount: Float!
  //               type: String!
  //               total: Float!
  //             },
  //             type Query {
  //                 hi: String,
  //                 orderbook: [Orderbook]
  //             },
  //         `,
  //         resolvers: {
  //             Query: {
  //                 hi: () => 'Hello from Elysia',
  //                 orderbook: () => orderbooks,
  //             }
  //         }
  //     })
  // )
  .get("/ping", () => "pong")
  // .get('/orderbook', (context) => store.orderbooks?.[`${context?.query?.exchange as string}--${context?.query?.base as string}--${context?.query?.quote as string}`])
  // .get('/orderbooks', (context) => store.orderBooksByBase)
  .get('/instruments', () => {
    return store.instruments
  })
  .get('/exchanges', () => {
    // return store.exchanges
    return ['OKEX']
  })
  .get("/orderbook", ({ query: { exchange, base, quote } }) => {
    log("orderbook", exchange, base, quote);
    if (exchange && base && quote) {
      return (
        store.orderBooksByBase?.[base as string]?.[quote as string]?.[
          exchange as string
        ] || []
      );
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
      return store.orderBooksHistoryByBase?.[`${base}/${quote}/${exchange}`] || [];
    } else if (base && quote) {
      const histories = {};
      for (const exchange in store.orderBooksHistoryByBase) {
        histories[exchange] =
          store.orderBooksHistoryByBase?.[`${base}/${quote}/${exchange}`] || [];
      }
      return histories;
    }
  })
  .get("/assets", (context) => store.assets)
  .get("/instruments", (context) => store.instruments)
  .listen(7771);
