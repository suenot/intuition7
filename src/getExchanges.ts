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