import ccxt from "ccxt";
import debug from "debug";
const log = debug("parseOHLCV");

export const parseOrderBooks = async () => {
  try {
    const binance = new ccxt.pro.binance({});
    const symbolsTimeframes = [['BTC/USDT', '1m'], ['ETH/USDT', '1m'], ['DOGE/USDT', '1m']];

    while (true) {
      try {
        const ohlcvs = await binance.watchOHLCVForSymbols(symbolsTimeframes);
        // console.log(ohlcvs);
      } catch (e) {
        log(e);
      }
    }
  } catch (e) {
    log(e);
    parseOrderBooks();
  }
}