import { Elysia } from 'elysia';
// import { yoga } from '@elysiajs/graphql-yoga';
import { store } from "./store";
import { intervalFn } from './intervalFn';

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
    .get('/ping', () => 'pong')
    // .get('/orderbook', (context) => store.orderbooks?.[`${context?.query?.exchange as string}--${context?.query?.base as string}--${context?.query?.quote as string}`])
    .get('/orderbooks', (context) => store.orderBooksByBase)
    .get('/orderbook', ({ query: { exchange, base, quote } }) => {
      console.log('orderbook', exchange, base, quote);
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
    // .get('/orderbook-history', ({ query: { exchange, base, quote } }) => {
    //   console.log('orderbook', exchange, base, quote);
    //   return store.orderbooksByBase?.[base as string]?.[quote as string] || {};
    // })
    .get('/assets', (context) => store.assets)
    .get('/instruments', (context) => store.instruments)
    .listen(8080)