// // TODO: переписать на получения списка бирж (exchanges) с помощью ccxt в таком формате
// // export interface Exchange {
// //   id: string;
// //   name: string;
// //   url: string;
// //   version?: string;
// //   active?: boolean;
// // }
// // где active - это флаг, который показывает, что биржа активна для парсера (по-умолчанию, сохраняем со значением false)
// // названи е должно быть не getExchangeInfo, а getExchanges


import ccxt from "ccxt";
import {
  Exchange,
} from "./types";
import { getExchangeInfo } from "./getExchangeInfo";

export const getExchanges = async (): Promise<Exchange[]> => {
  const exchanges: Exchange[] = [];

  for (const exchangeId of ccxt.exchanges) {
    try {
      const exchange = await getExchangeInfo(exchangeId);
      exchange && exchanges.push(exchange);
    } catch (error) {
      console.error(`Error getting information for exchange ${exchangeId}:`, error);
    }
  }

  return exchanges;
}