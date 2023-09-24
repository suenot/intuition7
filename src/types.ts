// Интерфейс для представления биржи
export interface Exchange {
  id: string;
  name: string;
  url: string;
  version?: string;
}

// Интерфейс для представления пары (инструмента)
export interface Instrument {
  symbol: string;
  baseAsset: string; // Базовый актив (монета)
  quoteAsset: string; // Котируемый актив (монета)
}

// Интерфейс для представления актива (монеты)
export interface Asset {
  id: string;
  symbol: string;
  name: string;
}

export interface Order {
  price: Number,
  amount: Number,
  type: String,
  total: Number,
  timestampFounded?: Number,
}

export interface OrderBook {
  timestamp: Number,
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
export interface StoreOrderBooksHistoryExchange {
  [key: string]: OrderBook[],
}

export interface Store {
  assets: Asset[],
  instruments: Instrument[],
  orderBooks: StoreOrderBooksExchange,
  orderBooksByBase: StoreOrderBooksBase,
  orderBooksHistory: StoreOrderBooksHistoryExchange,
  // orderBooksHistoryByBase:
}