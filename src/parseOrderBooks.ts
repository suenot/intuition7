import ccxt from "ccxt";
import { orderBookCcxtToCore } from "./orderBookCcxtToCore/orderBookCcxtToCore";
import { OrderBook as CcxtOrderBook, OrderBookSubscription as CcxtOrderBookSubscription } from "./ccxtTypes";
import { upsertOrderBoook } from "./db/db";
import debug from "debug";
import { store } from "./db/store/store";
import _ from "lodash";
const log = debug("parseOrderBooks");

/**
 * This function parses order books for given exchange IDs and pair IDs.
 * It logs the exchange IDs and pair IDs to the console.
 * It also logs each exchange ID as it is processed.
 * It gets the list of pairs available on the exchange, finds the intersection of pairs, and passes the pairs.
 * 
 * @param {Object} params - The parameters for the function.
 * @param {string[]} params.exchangeIds - The exchange IDs to parse order books for.
 * @param {string[]} params.pairIds - The pair IDs to parse order books for.
 */
export const parseOrderBooks = async ({exchangeIds, pairIds}: {exchangeIds: string[], pairIds: string[]}) => {
  console.log({exchangeIds, pairIds}) // Log the exchange IDs and pair IDs
  // Loop through each exchange ID
  for (const exchangeId of exchangeIds) {
    console.log(exchangeId) // Log the current exchange ID being processed
      
    // Get the list of pairs available on the exchange, find the intersection of pairs, and pass the pairs
    const exchangeInstance = new (ccxt.pro as any)[exchangeId]({});
    const exchangePairs = await exchangeInstance.loadMarkets();
    const intersectPairs = _.intersection(pairIds, Object.keys(exchangePairs));
    parseOrderBooksOne({exchangeId, pairIds: intersectPairs})
  }

}

/**
 * This function parses order books for a given exchange ID and pair IDs.
 * It logs any errors that occur during the process.
 * It gets the list of current pairs from the exchange.
 * 
 * @param {Object} params - The parameters for the function.
 * @param {string} params.exchangeId - The exchange ID to parse order books for.
 * @param {string[]} params.pairIds - The pair IDs to parse order books for.
 */
export const parseOrderBooksOne = async ({exchangeId, pairIds}: {exchangeId: string, pairIds: string[]}) => {
  const exchangeInstance = new (ccxt.pro as any)[exchangeId]({});
  if (exchangeId in ccxt.pro) {
    while (true) {
      try {
        // Get the list of current pairs from the exchange
        const pairIds = _.filter(store.pairs, pair => (pair.exchangeId === exchangeId && pair.active === true))
        const orderBookCcxt: CcxtOrderBookSubscription = await exchangeInstance.watchOrderBookForSymbols(pairIds);
        const orderBook = orderBookCcxtToCore({orderBookCcxt, exchangeId});
        upsertOrderBoook(orderBook);
      } catch (e) { log(e) }; // Log any errors
    }
  }
}