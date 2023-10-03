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
  price: Number,
  amount: Number,
  type: String,
  total: Number,
  timestampFounded?: Number,
  userId?: String,
  strategyId?: String,
}

export interface OrderBook {
  timestamp: Number,
  lag?: Number,
  exchangeId?: String,
  baseId?: String,
  quoteId?: String,
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
  price: Number,
  amount: Number,
  type: String,
  total: Number,
  timestampFounded?: Number,
}

export interface User {
  id: String,
  name: String,
}

export interface Strategy {
  id: String,
  name: String,
  // signal?: Signal,
  signalId: String,
  // bot?: Bot,
  botId: String,
}

export interface Signal {
  id: String,
  name: String,
}

export interface Bot {
  id: String,
  name: String,
}

export interface Candle {
  timestamp: Number,
  open: Number,
  high: Number,
  low: Number,
  close: Number,
  volume: Number,
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