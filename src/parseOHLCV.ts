import ccxt from "ccxt";

export const parseOrderBooks = async () => {
  const binance = new ccxt.pro.binance({});
  const symbolsTimeframes = [['BTC/USDT', '1m'], ['ETH/USDT', '1m'], ['DOGE/USDT', '1m']];

  while (true) {
      const ohlcvs = await binance.watchOHLCVForSymbols(symbolsTimeframes);
      console.log(ohlcvs);
  }
}