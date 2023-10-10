import ccxt from "ccxt";
import debug from "debug";
const log = debug("parseOrderBooks");

export const parseOrderBooks = async () => {
  const binance = new ccxt.pro.binance({});
  const symbols = ['BTC/USDT', 'ETH/USDT', 'DOGE/USDT'];

  while (true) {
    try {
      const trades = await binance.watchTradesForSymbols(symbols);
      console.log(trades);
    } catch(e) { log(e) };
  }
}