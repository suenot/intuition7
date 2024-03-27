// Вызывать метод: верни мне сделки по этой паре (это базовый метод в core пакете)

import { set } from "lodash";
import { parseTradesRest } from "../../parseTrades";
import { store, ListingInstrument } from "./store";

// проходить по всем парам, которые уже залистинги и проверять, не началась ли торговля по ним
export const checkTradableCycle = async (ms = 60000) => {
  setInterval(async () => {
    for (const instrument of Object.values(store.listingInstruments)) {
      const {exchangeId, pairId} = instrument;
      await checkTradable({exchangeId, pairId});
    }
  }, ms)
}

export const checkTradable = async ({exchangeId, pairId}: {exchangeId: string, pairId: string}) => {
  const {data, error} = await parseTradesRest({exchangeId, pairId});
  if (data && !error) {
    // update store.listingInstruments
    store.listingInstruments[`${pairId}/${exchangeId}`].tradable = true;
  }
}