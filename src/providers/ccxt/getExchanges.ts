import ccxt from "ccxt";
import {
  Exchange,
  Dictionary,
} from "../../types";
import { getExchangeInfo } from "./getExchangeInfo";


export const getExchanges = async (): Promise<Dictionary<Exchange>> => {
  const exchanges: Dictionary<Exchange> = {};

  for (const exchangeId of ccxt.exchanges) {
    try {
      const exchange = await getExchangeInfo(exchangeId);
      if (exchange?.id) exchanges[exchange.id] = exchange;
    } catch (error) {
      console.error(`Error getting information for exchange ${exchangeId}:`, error);
    }
  }

  return exchanges;
}