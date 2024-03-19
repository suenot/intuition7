import Fastify from 'fastify'
const fastify = Fastify({
  logger: true
})
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

fastify.route({
  method: 'GET',
  url: '/',
  schema: {
    // request needs to have a querystring with a `name` parameter
    querystring: {
      type: 'object',
      properties: {
          name: { type: 'string'}
      },
      required: ['name'],
    },
    // the response needs to be an object with an `hello` property of type 'string'
    response: {
      200: {
        type: 'object',
        properties: {
          hello: { type: 'string' }
        }
      }
    }
  },
  // this function is executed for every request before the handler is executed
  // preHandler: async (request, reply) => {
  preHandler: async () => {
    // E.g. check authentication
  },
  handler: async () => {
    return { hello: 'world' }
  }
})

try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}