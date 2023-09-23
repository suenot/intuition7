import ccxt from "ccxt";
import {
  Instrument,
} from "./types";

// Пример использования ccxt для получения списка доступных пар (инструментов) на бирже
export async function getExchangeInstruments(exchangeId: string): Promise<Instrument[]> {
  console.log('getExchangeInstruments');
  try {
    // const ccxt = await import('https://cdn.jsdelivr.net/npm/ccxt@latest/src');
    const exchange = new (ccxt as any)[exchangeId]();
    const markets = await exchange.loadMarkets();
    console.log('getExchangeInstruments try before return');
    return Object.values(markets).map((market: any) => ({
      symbol: market.symbol,
      baseAsset: market.base,
      quoteAsset: market.quote,
    }));
  } catch (error) {
    console.error(`Ошибка при получении списка пар на бирже ${exchangeId}:`, error);
    return [];
  }
}