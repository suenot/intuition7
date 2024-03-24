import { Exchange as ExchangeCCXT } from 'ccxt';
import { tradesToCandlesFunctions } from './tradesToCandle/tradesToCandle';

export interface Dictionary<T> {
  [key: string | number]: T;
}

export interface MinMax {
  min: number | undefined;
  max: number | undefined;
}

export interface Module {
  id: string;
  name: string;
  active?: boolean;
}

export interface Fee {
  type?: 'taker' | 'maker' | string;
  currency: string;
  rate?: number;
  cost: number;
}

// Интерфейс для представления биржи
export interface Exchange {
  id: string;
  name: string;
  url?: string;
  avatar?: string;
  urls?: string[];
  version?: string;
  active?: boolean;
  timestampFounded?: number;
  timestampUpdated?: number;
  pairs: Dictionary<Pair>;
}

// Интерфейс для представления инструмента (торговой пары на конкретной бирже)
// Market в ccxt
export interface Instrument {
  id: string;
  // base?: Asset // string; // Базовый актив (монета)
  baseId: string;
  // quote?: Asset // string; // Котируемый актив (монета)
  quoteId: string;
  // pair?: Pair;
  pairId: string;
  // exchange?: Exchange;
  exchangeId: string;
  timestampFounded?: number;
  timestampUpdated?: number;
  exchangeInstance?: ExchangeCCXT | undefined;
  active?: boolean;
  activeOnExchange?: boolean | undefined;
  type?: string;
  spot?: boolean;
  margin?: boolean;
  swap?: boolean;
  future?: boolean;
  option?: boolean;
  contract?: boolean;
  settle?: string | undefined;
  settleId?: string | undefined;
  contractSize?: number | undefined;
  linear?: boolean | undefined;
  inverse?: boolean | undefined;
  expiry?: number | undefined;
  expiryDatetime?: string | undefined;
  strike?: number | undefined;
  optionType?: string | undefined;
  taker?: number | undefined;
  maker?: number | undefined;
  percentage?: boolean | undefined;
  tierBased?: boolean | undefined;
  feeSide?: string | undefined;
  precision?: {
    amount: number | undefined,
    price: number | undefined
  };
  limits?: {
    amount?: MinMax,
    cost?: MinMax,
    leverage?: MinMax,
    price?: MinMax,
  };
  info?: object | undefined;
}

// Торговая пара это просто набор двух ассетов, который может встречать на разных биржах
export interface Pair {
  id: string;
  // baseAsset?: Asset // string; // Базовый актив (монета)
  baseId: string;
  // quoteAsset?: Asset // string; // Котируемый актив (монета)
  quoteId: string;
  active?: boolean;
  // exchanges: Dictionary<Exchange>; // TODO: убрал, так как при текущей архитектуре store это вызывает бесконечный цикл
}

// Интерфейс для представления актива (монеты)
export interface Asset { // TODO: переименовать в Unit?
  id: string;
  // symbol: string;
  name: string;
  active?: boolean;
}

export interface Label {
  id: string;
  name: string;
}

export interface Order {
  price: number,
  amount: number,
  total: number,
  sum: number,
  percent?: number, // процент "стенки" от общей стороны сткана
  percentSum?: number, // процент для отрисовки так называемого "крокодила" (объема по нарастанию, где последний элемент имеет 100%)
  userOrdersId?: string[], // мы в стакане видем склееные ордера многих пользователей, поэтому массив
  timestampFounded?: number, // время нахождения стенки в стакане
  // strategyId?: string,
  labelsId?: string[], // чтобы отмечать стенки и интересные позиции
}

export interface UserOrder {
  id: string,
  userId: string,
  price: number,
  amount: number,
  total: number,
  filled?: number;
  remaining?: number;
  average?: number;
  type: string,
  strategyId?: string,
  status: 'open' | 'closed' | 'canceled' | string;
  timestamp: number;
  lastTradeTimestamp: number;
  lastUpdateTimestamp?: number;
  pair: string;
  instrument: string;
  exchange: string;
  timeInForce?: string;
  side: 'buy' | 'sell' | string;
  stopPrice?: number;
  takeProfitPrice?: number;
  stopLossPrice?: number;
  cost: number;
  trades: Trade[];
  fee: Fee;
  info: object | undefined;
}

export interface OrderBook {
  timestamp: number,
  lag?: number,
  instrumentId: string,
  exchangeId: string,
  pairId: string,
  baseId: string,
  quoteId: string,
  bids: Order[],
  asks: Order[],
  trades?: Trade[],
  spread: number,
  spreadPercent: number,
  sum: number,
  bidsSum: number,
  asksSum: number,
  bestBidPrice: number,
  bestAskPrice: number,
}

export interface StoreOrderBooksBase {
  [key: string]: StoreOrderBooksQuote,
}
export interface StoreOrderBooksQuote {
  [key: string]: StoreOrderBooksExchange,
}
export interface StoreOrderBooksExchange {
  [key: string]: OrderBook,
}

export interface StoreOrderBooksHistoryBase {
  [key: string]: StoreOrderBooksHistoryQuote,
}
export interface StoreOrderBooksHistoryQuote {
  [key: string]: StoreOrderBooksHistoryExchange,
}
export interface StoreOrderBooksHistoryExchange {
  [key: string]: OrderBook[],
}

export interface Trade {
  id: string,
  instrumentId: string;
  exchangeId: string;
  pairId: string;
  baseId: string;
  quoteId: string;
  //
  price: number,
  amount: number,
  type?: string, // 'market', 'limit', ... or undefined/None/null
  total: number,
  timestamp: number,
  info?: object | undefined; // the original decoded JSON as is
  order?: string; // string order id or undefined/None/null
  side: 'buy' | 'sell' | string;            // direction of the trade, 'buy' or 'sell'
  takerOrMaker?: 'taker' | 'maker' | string; // string, 'taker' or 'maker'
  cost: number; // total cost (including fees), `price * amount`
  fee?: Fee;
  fees?: Fee[];
}

// чем tick отличается от candle?
// тик — это любое единичное изменение или движение котировки в ту или другую сторону. Может меняться на один пункт и более.
// но по мне это просто свечка с очень маленьким таймфреймом (0.2-1 секунда, может даже 5 секунд, но если сдвига цены не было, то не сохраняем данные)
// export interface Tick {
//   timestampStart: number,
//   timestampEnd: number,
//   high: number,
//   low: number,
//   volume: number,
//   count: number,
//   // buyVolume: number,
//   // buyCount: number,
//   // sellVolume: number,
//   // sellCount: number,
//   // TODO: meta tick: объемые по биржам, отображать на какой бирже произошло больше всего сделок
// }

export interface User {
  id: string,
  name: string,
  avatar: string,
}

export interface Strategy {
  id: string,
  name: string,
  // signal?: Signal,
  signalId: string,
  // bot?: Bot,
  botId: string,
}

export interface Signal {
  id: string,
  name: string,
}

export interface Bot {
  id: string,
  name: string,
}

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
export interface Timeframe {
  id: string,
  name: string,
  milliseconds: number,
}

export interface Candle {
  id?: string, // "BTC/USDT/binance/1m"
  exchangeId?: string,
  instrumentId?: string,
  pairId?: string,
  baseId?: string,
  quoteId?: string,
  //
  timestamp?: number,
  // timestampStart?: number,
  // timestampEnd?: number,

  // timeframe?: number, // number is universal
  // timeframeId?: string,
  timeframeMs?: number,
  timeframeName?: string,
  status?: 'open' | 'closed' | string,
  open?: number,
  high?: number,
  low?: number,
  close?: number,
  volume?: number,
  // Heikin-Ashi
  xClose?: number, // (Open+High+Low+Close)/4 - The average price of the current bar.
  xOpen?: number, // [xOpen(Previous Bar) + xClose(Previous Bar)]/2 -Midpoint of the previous bar.
  xHigh?: number, // Max(High, xOpen, xClose) - Highest value in the set.
  xLow?: number, // Min(Low, xOpen, xClose) - Lowest value in the set.
  // counts
  count?: number,
  buyCount?: number,
  sellCount?: number,
  // volumes
  buyVolume?: number,
  sellVolume?: number,
  // TODO: meta exchange (единая)
  // cluster
  // Нужно для синхронизации со стаканом
  bestAsk?: number;
  bestBid?: number;
  spreadPrice?: number;
  clusterPoints?: ClusterPoint[];
  orders?: Order[];

  // new fields
  change?: number,
  changePercent?: number,
  changePercentAbs?: number,
  countDisbalance?: number,
  countDisbalancePercent?: number,
  countDisbalancePercentAbs?: number,
  volumeDisbalance?: number,
  volumeDisbalancePercent?: number,
  volumeDisbalancePercentAbs?: number,
  weightedAverageBuyPrice?: number,
  weightedAverageSellPrice?: number,
  weightedAveragePrice?: number,
  medianBuyPrice?: number,
  medianSellPrice?: number,
  medianPrice?: number,
  priceStandardDeviation?: number,
  
  previousCandle?: Candle,

  //
  firstTrade?: Trade,
  lastTrade?: Trade,
}

export interface Transaction {
  info: object | undefined;
  id: string;
  txid?: string;
  timestamp: number;
  datetime: string;
  address: string;
  type: 'deposit' | 'withdrawal' | string;
  amount: number;
  assetId: string;
  status: 'pending' | 'ok' | string;
  updated: number;
  fee: Fee;
}

interface Message {
  id: string;
  text: string;
  type: 'info' | 'warning' | 'error' | string;
  timestamp: number;
}

interface ClusterPoint {
  price: number;
  volume: number;
  percent: number;
  empty?: boolean;
  timestampFounded?: number; // время нахождения интересного события
  timestampLifeTime?: number;
  labelsId?: string[]; // чтобы отмечать стенки и интересные позиции
  messagesId?: string[]; // чтобы отмечать стенки и интересные позиции
}

// interface Cluster extends Candle {
//   bestAsk?: number; // Нужно для синхронизации со стаканом
//   bestBid?: number;
//   spreadPrice?: number;
//   clusterPoints?: ClusterPoint[];
// }


type FunctionName = keyof typeof tradesToCandlesFunctions;

export type CandleIndicator = {
  value: keyof Candle,
  fn: FunctionName, // fn is now a key of tradesToCandlesFunctions
  params: any[],
  callback?: Function
}

// export type CandleIndicator = {
//   value: keyof Candle,
//   fn: any, // или нужно перечислить все названия функций // keyof typeof tradesToCandlesFunctions
//   params: any[],
//   callback?: Function
// }

export interface Store {
  modules: Dictionary<Module>,
  exchanges: Dictionary<Exchange>,
  assets: Dictionary<Asset>,
  instruments: Dictionary<Instrument>,
  pairs: Dictionary<Pair>,
  orderBooks: StoreOrderBooksExchange,
  orderBooksByBase: StoreOrderBooksBase,
  orderBooksHistory: StoreOrderBooksHistoryExchange,
  orderBooksHistoryByBase: StoreOrderBooksHistoryBase,
  users: Dictionary<User>,
  strategies: Dictionary<Strategy>,
  signals: Dictionary<Signal>,
  bots: Dictionary<Bot>,
  trades: Dictionary<Trade[]>,
  candles: Dictionary<Dictionary<Candle>>, // Example: store.candles[`btc/usdt/binance/1s`][1711291218000] = Candle
  exchangesInstances: Dictionary<ExchangeCCXT>,
}