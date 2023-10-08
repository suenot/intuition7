import ccxt from "ccxt";
import _ from "lodash";
import {
  Instrument,
  Asset,
  Dictionary,
  Pair,
  Exchange,
} from "./types";
import { Market as CcxtMarket } from "ccxt";
import { getExchanges } from "./getExchanges";
import { ccxtExchanges } from "./exchangesData";
import debug from "debug";
const log = debug("getMarketData");

export async function getMarketData(): Promise<{
  assets: Dictionary<Asset>,
  pairs: Dictionary<Pair>,
  instruments: Dictionary<Instrument>,
  exchanges: Dictionary<Exchange>,
  exchangesInstances: Dictionary<any>
}> {
  log('getMarketData');
  try {
    const exchanges = await getExchanges();
    const exchangesInstances: Dictionary<any> = {};
    const assets: Dictionary<Asset> = {};
    const pairs: Dictionary<Pair> = {};
    const instruments: Dictionary<Instrument> = {};

    for (const exchange of Object.values(exchanges)) {
      try {
        const exchangeId = exchange.id;
        // log({exchangeId});
        const exchangeInstance = new (ccxt as any)[exchangeId]();
        // log({exchangeInstance});
        exchangesInstances[exchangeId] = exchangeInstance;
        // log({exchangesInstancesHasLoadMarkets: exchangeInstance.has.loadMarkets});
        if ( _.includes(ccxtExchanges, exchangeId) ) { // TODO: вынести в другую функцию либо for continue. Временное решение
          log({exchangesInstancesHasLoadMarkets: exchangeInstance.has.fetchMarkets});
          const markets: CcxtMarket[] = await exchangeInstance.loadMarkets(); // loadMarkets()fetchMarkets
          log({markets});
    
          for (const market of Object.values(markets)) {
            
            const { baseId, quoteId } = market;
            if ( _.includes(['ETH', 'LTC'], baseId) ) { 
              const pairId = `${baseId}/${quoteId}`;
              const instrumentId = `${baseId}/${quoteId}/${exchangeId}`;
              log({instrumentId});
        
              if (!assets[baseId]) {
                assets[baseId] = {
                  id: baseId,
                  name: baseId,
                  active: false,
                };
              }

              if (!assets[quoteId]) {
                assets[quoteId] = {
                  id: quoteId,
                  name: quoteId,
                  active: false,
                };
              }

              if (!pairs[pairId]) {
                pairs[pairId] = {
                  id: pairId,
                  baseId: baseId,
                  quoteId: quoteId,
                  active: false,
                };
              }

              if (!instruments[instrumentId]) {
                instruments[instrumentId] = {
                  id: instrumentId,
                  // exchange,
                  exchangeId,
                  // exchangeInstance: exchangesInstances[exchangeId],
                  // baseAsset: assets[baseId],
                  baseId: baseId,
                  // quoteAsset: assets[quoteId],
                  quoteId: quoteId,
                  // pair: pairs[pairId],
                  pairId: pairId,
                  active: false,
                };
              }
            }
          }
        }
      } catch (error) {
        console.error(`Ошибка при получении списка пар на бирже ${exchange.id}:`, error);
      }
    }
    return { assets, pairs, instruments, exchanges, exchangesInstances };

  } catch (error) {
    console.error(`Ошибка при получении списка бирж}:`, error);
    return { assets: {}, pairs: {}, instruments: {}, exchanges: {}, exchangesInstances: {}};
  }
}
