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
export const tradesToCandles = (trades: Trade[]): void => {
 // Здесь
}