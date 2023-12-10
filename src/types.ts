export interface Dictionary<T> {
  [key: string]: T;
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
  exchangeInstance?: any;
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
  info?: any;
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
  info: any;
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
  trades?: any[],
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
  price: number,
  amount: number,
  type?: string, // 'market', 'limit', ... or undefined/None/null
  total: number,
  timestamp: number,
  info: any; // the original decoded JSON as is
  order?: string; // string order id or undefined/None/null
  side: 'buy' | 'sell' | string;            // direction of the trade, 'buy' or 'sell'
  takerOrMaker?: 'taker' | 'maker' | string; // string, 'taker' or 'maker'
  cost: number; // total cost (including fees), `price * amount`
  pairId: string; // symbol in CCXT format
  instrumentId: string;
  exchangeId: string;
  fee?: Fee;
  fees?: Fee[];
}

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

export interface Candle {
  timestamp: number,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number,
}

export interface Transaction {
  info: any;
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
  candles: Dictionary<Candle>,
  exchangesInstances: Dictionary<any>,
}