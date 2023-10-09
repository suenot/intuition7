export interface Dictionary<T> {
  [key: string]: T;
}
export interface Module {
  id: string;
  name: string;
  active?: boolean;
}

// Интерфейс для представления биржи
export interface Exchange {
  id: string;
  name: string;
  url: string;
  version?: string;
  active?: boolean;
  timestampFounded?: number;
  timestampUpdated?: number;
}

// Интерфейс для представления инструмента (торговой пары на конкретной бирже)
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
  exchangeInstance?: any;
  active?: boolean;
}

// Торговая пара это просто набор двух ассетов, который может встречать на разных биржах
export interface Pair {
  id: string;
  // baseAsset?: Asset // string; // Базовый актив (монета)
  baseId: string;
  // quoteAsset?: Asset // string; // Котируемый актив (монета)
  quoteId: string;
  active?: boolean;
}

// Интерфейс для представления актива (монеты)
export interface Asset {
  id: string;
  // symbol: string;
  name: string;
  active?: boolean;
}

export interface Order {
  price: number,
  amount: number,
  type: string,
  total: number,
  timestampFounded?: number,
  userId?: string,
  strategyId?: string,
}

export interface OrderBook {
  timestamp: number,
  lag?: number,
  instrumentId: string,
  exchangeId: string,
  pairId: string,
  baseId: string,
  quoteId: string,
  data: Order[],
  trades?: any[],
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

export interface Trade { // TODO: объединить с Order или нет?
  price: number,
  amount: number,
  type: string,
  total: number,
  timestampFounded?: number,
}

export interface User {
  id: string,
  name: string,
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

export interface Candle {
  timestamp: number,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number,
}
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
  trades: Trade[],
  candles: Candle[],
  exchangesInstances: Dictionary<any>,
}