import ccxt from "ccxt";
import {
  Exchange,
} from "./types";

// Пример использования ccxt для получения информации о бирже
export async function getExchangeInfo(exchangeId: string): Promise<Exchange | null> {
  try {
    // const ccxt = await import('https://cdn.jsdelivr.net/npm/ccxt@latest/src');
    const exchange = new (ccxt as any)[exchangeId]();
    return {
      id: exchange.id,
      name: exchange.name,
      url: exchange.urls.www,
      version: exchange.version,
      active: false,
      pairs: {},
    };
  } catch (error) {
    console.error(`Ошибка при получении информации о бирже ${exchangeId}:`, error);
    return null;
  }
}