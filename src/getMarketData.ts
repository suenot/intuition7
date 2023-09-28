import ccxt from "ccxt";
import {
  Instrument,
  Asset,
  Dictionary,
  Pair,
  Exchange,
} from "./types";
import { Market as CcxtMarket } from "ccxt";
import { getExchanges } from "./getExchanges";
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
        log({exchangeId});
        const exchangeInstance = new (ccxt as any)[exchangeId]();
        // log({exchangeInstance});
        exchangesInstances[exchangeId] = exchangeInstance;
        // log({exchangesInstancesHasLoadMarkets: exchangeInstance.has.loadMarkets});
        if (exchangeId === 'binance') {
          log({exchangesInstancesHasLoadMarkets: exchangeInstance.has.fetchMarkets});
          const markets: CcxtMarket = await exchangeInstance.fetchMarkets(); // loadMarkets()fetchMarkets
    
          for (const market of Object.values(markets)) {
            const { baseAsset, quoteAsset } = market;
            const pairId = `${market.base}/${market.quote}`;
            const instrumentId = `${baseAsset}/${quoteAsset}/${exchangeId}`;
            log({instrumentId});
      
            if (!assets[market.base]) {
              assets[market.base] = {
                id: market.baseId,
                symbol: market.base,
                name: market.base,
              };
            }

            if (!assets[market.quote]) {
              assets[market.quote] = {
                id: market.quoteId,
                symbol: market.quote,
                name: market.quote,
              };
            }

            if (!pairs[pairId]) {
              pairs[pairId] = {
                baseAsset,
                baseAssetId: market.baseId,
                quoteAsset,
                quoteAssetId: market.quoteId,
              };
            }

            if (!instruments[instrumentId]) {
              instruments[instrumentId] = {
                id: instrumentId,
                exchange,
                exchangeId,
                exchangeInstance: exchangesInstances[exchangeId],
                baseAsset: assets[market.base],
                baseAssetId: market.baseId,
                quoteAsset: assets[market.quote],
                quoteAssetId: market.quoteId,
                pair: pairs[pairId],
                pairId: pairId,
              };
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
