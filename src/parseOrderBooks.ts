import ccxt from "ccxt";

export const parseOrderBooks = async () => {
  const binance = new ccxt.pro.binance({});
  const symbols = ['BTC/USDT', 'ETH/USDT', 'DOGE/USDT'];
  // const symbolsTimeframes = [['BTC/USDT', '1m'], ['ETH/USDT', '1m'], ['DOGE/USDT', '1m']];

  while (true) {
      // const trades = await binance.watchTradesForSymbols(symbols);
      // console.log(trades);
      const orderbook = await binance.watchOrderBookForSymbols(symbols);
      console.log(orderbook);
      // const ohlcvs = await binance.watchOHLCVForSymbols(symbolsTimeframes);
      // console.log(ohlcvs);
  }
}