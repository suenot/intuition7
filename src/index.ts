import { Elysia } from 'elysia';
import { yoga } from '@elysiajs/graphql-yoga';
// import { OrderBook } from 'ccxt/js/src/base/ws/OrderBook';
// import ccxt from "ccxt";
import ccxt from "ccxt";
// import ccxt type Exchange as ccxtExchange from "ccxt";
import { Exchange as CcxtExchange, OrderBook as CcxtOrderBook, Market as CcxtMarket } from "ccxt";

// Интерфейс для представления биржи
interface Exchange {
  id: string;
  name: string;
  url: string;
  version?: string;
}

// Интерфейс для представления пары (инструмента)
interface Instrument {
  symbol: string;
  baseAsset: string; // Базовый актив (монета)
  quoteAsset: string; // Котируемый актив (монета)
}

// Интерфейс для представления актива (монеты)
interface Asset {
  id: string;
  symbol: string;
  name: string;
}

interface Order {
  price: Number,
  amount: Number,
  type: String,
  total: Number,
  timestampFounded?: Number,
}

interface OrderBook {
  timestamp: Number,
  data: Order[],
  trades?: any[],
}

interface StoreOrderbooksBase {
  [key: string]: StoreOrderbooksQuote,
}
interface StoreOrderbooksQuote {
  [key: string]: StoreOrderbooksExchange,
}

interface StoreOrderbooksExchange {
  [key: string]: OrderBook,
}

interface Store {
  assets: Asset[],
  instruments: Instrument[],
  orderbooks: StoreOrderbooksExchange,
  orderbooksByBase: StoreOrderbooksBase,
}
const store: Store = {
  assets: [],
  instruments: [],
  orderbooks: {},
  orderbooksByBase: {},
  // trades: [],
  // candles: [],
}

// Пример использования ccxt для получения информации о бирже
async function getExchangeInfo(exchangeId: string): Promise<Exchange | null> {
  try {
    // const ccxt = await import('https://cdn.jsdelivr.net/npm/ccxt@latest/src');
    const exchange = new (ccxt as any)[exchangeId]();
    return {
      id: exchange.id,
      name: exchange.name,
      url: exchange.urls.www,
      version: exchange.version,
    };
  } catch (error) {
    console.error(`Ошибка при получении информации о бирже ${exchangeId}:`, error);
    return null;
  }
}

// Пример использования ccxt для получения списка доступных пар (инструментов) на бирже
async function getExchangeInstruments(exchangeId: string): Promise<Instrument[]> {
  console.log('getExchangeInstruments');
  try {
    // const ccxt = await import('https://cdn.jsdelivr.net/npm/ccxt@latest/src');
    const exchange = new (ccxt as any)[exchangeId]();
    const markets = await exchange.loadMarkets();
    console.log('getExchangeInstruments try before return');
    return Object.values(markets).map((market: any) => ({
      symbol: market.symbol,
      baseAsset: market.base,
      quoteAsset: market.quote,
    }));
  } catch (error) {
    console.error(`Ошибка при получении списка пар на бирже ${exchangeId}:`, error);
    return [];
  }
}

// Пример использования ccxt для получения списка доступных активов (монет) на бирже
async function getExchangeAssets(exchangeId: string): Promise<Asset[]> {
  try {
    // const ccxt = await import('https://cdn.jsdelivr.net/npm/ccxt@latest/src');
    const exchange = new (ccxt as any)[exchangeId]();
    const assets: CcxtMarket[] = await exchange.loadMarkets();
    const uniqueAssets: { [key: string]: Asset } = {};

    for (const market of Object.values(assets)) {
      uniqueAssets[market.base] = {
        id: market.baseId,
        symbol: market.base,
        name: market.base,
      };
      uniqueAssets[market.quote] = {
        id: market.quoteId,
        symbol: market.quote,
        name: market.quote,
      };
    }

    return Object.values(uniqueAssets);
  } catch (error) {
    console.error(`Ошибка при получении списка активов на бирже ${exchangeId}:`, error);
    return [];
  }
}

const getExchangeOrderbook = async (exchangeId: string, symbol: string): Promise<OrderBook> => {
  try {
    console.log('getExchangeOrderbook', {exchangeId, symbol});
    const exchange = new (ccxt as any)[exchangeId]();
    const orderBook: CcxtOrderBook = await exchange.fetchOrderBook(symbol);

    // Convert CCXT order book data to the specified format
    const bids = orderBook.bids.map((bid) => {
      return {
        price: bid[0],
        amount: bid[1],
        type: 'bid',
        total: bid[0] * bid[1],
      };
    });

    const asks = orderBook.asks.map((ask) => {
      return {
        price: ask[0],
        amount: ask[1],
        type: 'ask',
        total: ask[0] * ask[1],
      };
    });

    // Create the OrderBook object
    const orderBookFormatted = {
      timestamp: orderBook.timestamp,
      data: [...bids, ...asks],
    };

    console.log(orderBookFormatted);
    return orderBookFormatted;
  } catch (error) {
    console.error(`Ошибка при получении стакана на бирже ${exchangeId}:`, error);
    return {
      timestamp: new Date().getTime(),
      data: [],
    };
  }
}

(async () => {
  const intervalFn = async () => {
    console.log('interval');
    const exchangeId = 'okex'; // Замените на ID биржи, которую хотите исследовать
    const exchangeInfo = await getExchangeInfo(exchangeId);
    console.log('Информация о бирже:', exchangeInfo);

    console.log('before getExchangeInstruments');
    const instruments = await getExchangeInstruments(exchangeId);
    console.log('after getExchangeInstruments');
    console.log({instruments});
    console.log('Доступные пары (инструменты) на бирже:', instruments);
    store.instruments = instruments;

    const assets = await getExchangeAssets(exchangeId);
    console.log('Доступные активы (монеты) на бирже:', assets);
    store.assets = assets;
  
    const orderbook = await getExchangeOrderbook(exchangeId, 'BTC/USDT');
    // store.orderbooks['BTC/USDT'] = orderbook;
    store.orderbooks['BTC_USDT'] = orderbook;
    if (!store.orderbooksByBase['BTC']) store.orderbooksByBase['BTC'] = {};
    if (!store.orderbooksByBase['BTC']['USDT']) store.orderbooksByBase['BTC']['USDT'] = {};
    store.orderbooksByBase['BTC']['USDT'][exchangeId] = store.orderbooks['BTC_USDT'];
  }
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
    .get('/orderbook', (context) => store.orderbooks)
    .get('/assets', (context) => store.assets)
    .get('/instruments', (context) => store.instruments)
    .listen(8080)