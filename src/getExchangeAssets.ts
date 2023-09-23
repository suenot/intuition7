import ccxt from "ccxt";
import { Market as CcxtMarket } from "ccxt";
import {
  Asset,
} from "./types";

// Пример использования ccxt для получения списка доступных активов (монет) на бирже
export async function getExchangeAssets(exchangeId: string): Promise<Asset[]> {
  try {
    const exchange = new (ccxt as any)[exchangeId](); // TODO: fix
    const assets: CcxtMarket[] = await exchange.loadMarkets();
    const uniqueAssets: { [key: string]: Asset } = {};

    for (const market of Object.values(assets)) {
      uniqueAssets[market.base] = {
        id: market.baseId,
        symbol: market.base,
        name: market.base,
      };
      uniqueAssets[market.quote] = {
        id: market.quoteId,
        symbol: market.quote,
        name: market.quote,
      };
    }

    return Object.values(uniqueAssets);
  } catch (error) {
    console.error(`Ошибка при получении списка активов на бирже ${exchangeId}:`, error);
    return [];
  }
}