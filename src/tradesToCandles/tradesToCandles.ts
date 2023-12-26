import { Trade, Candle, Dictionary } from '../types';
import { store } from "../db/store/store";

// export interface Trade {
//   id: string,
//   price: number,
//   amount: number,
//   type?: string, // 'market', 'limit', ... or undefined/None/null
//   total: number,
//   timestamp: number,
//   info: any; // the original decoded JSON as is
//   order?: string; // string order id or undefined/None/null
//   side: 'buy' | 'sell' | string;            // direction of the trade, 'buy' or 'sell'
//   takerOrMaker?: 'taker' | 'maker' | string; // string, 'taker' or 'maker'
//   cost: number; // total cost (including fees), `price * amount`
//   pairId: string; // symbol in CCXT format
//   instrumentId: string;
//   exchangeId: string;
//   fee?: Fee;
//   fees?: Fee[];
// }

// Timeframes names
// '0.2s' - fast ticks
// '1s' - ticks
// '1m'
// '3m'
// '5m'
// '15m',
// '30m',
// '1h'
// '2h'
// '4h'
// '6h'
// '8h'
// '12h',
// '1d'
// '3d'
// '1w'
// '1M'
// export interface Timeframe {
//   id: string,
//   name: string,
//   milliseconds: number,
// }

// export interface Candle {
//   id: string, // "BTC/USDT/binance/1m"
//   exchangeId: string,
//   instrumentId: string,
//   pairId: string,
//   baseId: string,
//   quoteId: string,
//   //
//   timestamp?: number,
//   timestampStart: number,
//   timestampEnd: number,
//   timeframe: number, // number is universal
//   timeframeId?: string,
//   timeframeName?: string,
//   status?: 'open' | 'closed' | string,
//   open: number,
//   high: number,
//   low: number,
//   close: number,
//   volume: number,
//   // Heikin-Ashi
//   xClose?: number, // (Open+High+Low+Close)/4 - The average price of the current bar.
//   xOpen?: number, // [xOpen(Previous Bar) + xClose(Previous Bar)]/2 -Midpoint of the previous bar.
//   xHigh?: number, // Max(High, xOpen, xClose) - Highest value in the set.
//   xLow?: number, // Min(Low, xOpen, xClose) - Lowest value in the set.
//   // counts
//   count?: number,
//   buyCount?: number,
//   sellCount?: number,
//   // volumes
//   buyVolume?: number,
//   sellVolume?: number,
//   // TODO: meta exchange (единая)
//   // cluster
//   // Нужно для синхронизации со стаканом
//   bestAsk?: number;
//   bestBid?: number;
//   spreadPrice?: number;
//   clusterPoints?: ClusterPoint[];
// }

// Мы складируем данные в store
// export interface Dictionary<T> {
//   [key: string]: T;
// }
// export interface Store {
//   candles: Dictionary<Candle[]>,
// }

const getTimeframeMilliseconds = (timeframe: string): number => {
  const timeframes: Dictionary<number> = {
    'tick': 0,
    '0.2s': 200,
    '1s': 1000,
    '1m': 60000,
    '3m': 180000,
    '5m': 300000,
    '15m': 900000,
    '30m': 1800000,
    '1h': 3600000,
    '2h': 7200000,
    '4h': 14400000,
    '6h': 21600000,
    '8h': 28800000,
    '12h': 43200000,
    '1d': 86400000,
    '3d': 259200000,
    '1w': 604800000,
    '1M': 2592000000,
  };
  return timeframes[timeframe] || 0;
};

// Сама задача:
// Нужно написать функцию или набор функций на typescript, которая постоянно принимает trade и формирует свечки на их основе (словарь со свечками под каждую торговую пару лежит в глобальной переменной)
export const tradesToCandles = (tick: Trade[]): void => {
  const timeframe = getTimeframeMilliseconds('tick');
  const timeframeId = 'tick';
  const timeframeName = 'tick';

  const firstTrade = tick[0];
  const lastTrade = tick[tick.length - 1];
  const instrumentTimeframeId = `${firstTrade.pairId}/${firstTrade.exchangeId}/${timeframeName}`;
  const id = instrumentTimeframeId;
  const exchangeId = firstTrade.exchangeId;
  const instrumentId = firstTrade.instrumentId;
  const pairId = firstTrade.pairId;
  const baseId = firstTrade.baseId;
  const quoteId = firstTrade.quoteId;
  const timestamp = firstTrade.timestamp;
  const timestampStart = firstTrade.timestamp;
  const timestampEnd = lastTrade.timestamp;

  const open = tick[0].price;
  const high = tick.reduce((acc, trade) => Math.max(acc, trade.price), 0);
  const low = tick.reduce((acc, trade) => Math.min(acc, trade.price), Infinity);
  const close = tick[tick.length - 1].price;

  const count = tick.length;
  const buyCount = tick.filter(trade => trade.side === 'buy').length;
  const sellCount = tick.filter(trade => trade.side === 'sell').length;
  const buyVolume = tick.filter(trade => trade.side === 'buy').reduce((acc, trade) => acc + trade.amount, 0);
  const sellVolume = tick.filter(trade => trade.side === 'sell').reduce((acc, trade) => acc + trade.amount, 0);
  const volume = tick.reduce((acc, trade) => acc + trade.amount, 0);

  const bestAsk = tick.reduce((acc, trade) => Math.min(acc, trade.price), Infinity);
  const bestBid = tick.reduce((acc, trade) => Math.max(acc, trade.price), 0);
  const spreadPrice = bestBid - bestAsk;
  // cluster points это массив цен от низкой к высокой, где просуммирован весь объем свечки по каждой конкретной цене
  const clusterPoints = tick.reduce((acc: any, trade: any) => {
    if (!acc[trade.price]) acc[trade.price] = 0;
    acc[trade.price] += trade.amount;
    return acc;
  }, {});

  // calculate Heikin-Ashi
  var xClose;
  var xOpen;
  var xHigh;
  var xLow;
  if (store.candles[id].length > 1) {
    const previousCandle: Candle = store.candles[id][store.candles[id].length - 1];
    if (previousCandle.xClose === undefined || previousCandle.xOpen === undefined) {
      previousCandle.xClose = previousCandle.close;
      previousCandle.xOpen = previousCandle.open;
    }
    xClose = (open + high + low + close) / 4;
    xOpen = (previousCandle?.xOpen + previousCandle?.xClose) / 2;
    xHigh = Math.max(high, xOpen, xClose);
    xLow = Math.min(low, xOpen, xClose);
  }


  var candle: Candle = {
    id,
    exchangeId,
    instrumentId,
    pairId,
    baseId,
    quoteId,
    //
    timestamp,
    timestampStart,
    timestampEnd,
    timeframe,
    timeframeId,
    timeframeName,
    // status?: 'open' | 'closed' | string,
    open,
    high,
    low,
    close,
    // Heikin-Ashi
    xClose,
    xOpen,
    xHigh,
    xLow,

    // counts
    count,
    buyCount,
    sellCount,
    // volumes
    buyVolume,
    sellVolume,
    volume,
    // cluster
    // Нужно для синхронизации со стаканом
    bestAsk,
    bestBid,
    spreadPrice,
    clusterPoints,
  };

  if (!store.candles) store.candles = {};
  if (!store.candles[id]) store.candles[id] = [];
  store.candles[id].push(candle);
}
