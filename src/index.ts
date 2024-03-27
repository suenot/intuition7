import { store } from './db/store/store';
// Export all functions to use in external projects

// Parsing
import { getExchanges } from "./providers/ccxt/getExchanges";
import { getMarketData } from "./providers/ccxt/getMarketData";
import { parseCandles } from "./providers/ccxt/parseCandles";
import { parseTrades } from "./providers/ccxt/parseTrades";
import { parseOrderBooks } from "./providers/ccxt/parseOrderBooks";

// Timeframe utils
import { getNextTimeframe } from "./backend/getNextTimeframe/getNextTimeframe";
import { getTimeframeMilliseconds } from "./backend/getTimeframeMilliseconds/getTimeframeMilliseconds";

// Convert ccxt data to core format
import { tradeCcxtToCore } from "./providers/ccxt/tradesCcxtToCore/tradesCcxtToCore";
import { orderBookCcxtToCore } from "./providers/ccxt/orderBookCcxtToCore/orderBookCcxtToCore";

// Generating candles in core format
import { tradesToCandle } from "./backend/tradesToCandle/tradesToCandle";
// import { candlesToCandle } from "./candlesToCandle/candlesToCandle";

// Insert/Update/Upsert data to db
// ...

// Utils
import { toShift } from "./backend/toShift/toShift";
import { calculateLag } from "./backend/calculateLag/calculateLag";
import { sleep } from "./backend/sleep/sleep";

export { store, getExchanges, getMarketData, parseCandles, parseTrades, parseOrderBooks, getNextTimeframe, getTimeframeMilliseconds, tradeCcxtToCore, orderBookCcxtToCore, tradesToCandle, toShift, calculateLag, sleep };