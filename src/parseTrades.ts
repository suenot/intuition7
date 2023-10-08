import ccxt from "ccxt";

export const parseOrderBooks = async () => {
  const binance = new ccxt.pro.binance({});
  const symbols = ['BTC/USDT', 'ETH/USDT', 'DOGE/USDT'];

  while (true) {
      const trades = await binance.watchTradesForSymbols(symbols);
      console.log(trades);
  }
}