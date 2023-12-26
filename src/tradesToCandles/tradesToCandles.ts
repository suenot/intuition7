import { Trade, Candle, Dictionary } from '../types';
import { store } from "../db/store/store";
import _ from 'lodash';

// export interface Trade {
//   id: string,
//   price: number,
//   amount: number,
//   type?: string, // 'market', 'limit', ... or undefined/None/null
//   total: number,
//   timestamp: number,
//   info: any; // the original decoded JSON as is
//   order?: string; // string order id or undefined/None/null
//   side: 'buy' | 'sell' | string;            // direction of the trade, 'buy' or 'sell'
//   takerOrMaker?: 'taker' | 'maker' | string; // string, 'taker' or 'maker'
//   cost: number; // total cost (including fees), `price * amount`
//   pairId: string; // symbol in CCXT format
//   instrumentId: string;
//   exchangeId: string;
//   fee?: Fee;
//   fees?: Fee[];
// }

// Timeframes names
// '0.2s' - fast ticks
// '1s' - ticks
// '1m'
// '3m'
// '5m'
// '15m',
// '30m',
// '1h'
// '2h'
// '4h'
// '6h'
// '8h'
// '12h',
// '1d'
// '3d'
// '1w'
// '1M'
// export interface Timeframe {
//   id: string,
//   name: string,
//   milliseconds: number,
// }

// export interface Candle {
//   id: string, // "BTC/USDT/binance/1m"
//   exchangeId: string,
//   instrumentId: string,
//   pairId: string,
//   baseId: string,
//   quoteId: string,
//   //
//   timestamp?: number,
//   timestampStart: number,
//   timestampEnd: number,
//   timeframe: number, // number is universal
//   timeframeId?: string,
//   timeframeName?: string,
//   status?: 'open' | 'closed' | string,
//   open: number,
//   high: number,
//   low: number,
//   close: number,
//   volume: number,
//   // Heikin-Ashi
//   xClose?: number, // (Open+High+Low+Close)/4 - The average price of the current bar.
//   xOpen?: number, // [xOpen(Previous Bar) + xClose(Previous Bar)]/2 -Midpoint of the previous bar.
//   xHigh?: number, // Max(High, xOpen, xClose) - Highest value in the set.
//   xLow?: number, // Min(Low, xOpen, xClose) - Lowest value in the set.
//   // counts
//   count?: number,
//   buyCount?: number,
//   sellCount?: number,
//   // volumes
//   buyVolume?: number,
//   sellVolume?: number,
//   // TODO: meta exchange (единая)
//   // cluster
//   // Нужно для синхронизации со стаканом
//   bestAsk?: number;
//   bestBid?: number;
//   spreadPrice?: number;
//   clusterPoints?: ClusterPoint[];
// }

// Мы складируем данные в store
// export interface Dictionary<T> {
//   [key: string]: T;
// }
// export interface Store {
//   candles: Dictionary<Candle[]>,
// }

const getTimeframeMilliseconds = (timeframe: string): number => {
  const timeframes: Dictionary<number> = {
    'tick': 0,
    '0.2s': 200,
    '1s': 1000,
    '1m': 60000,
    '3m': 180000,
    '5m': 300000,
    '15m': 900000,
    '30m': 1800000,
    '1h': 3600000,
    '2h': 7200000,
    '4h': 14400000,
    '6h': 21600000,
    '8h': 28800000,
    '12h': 43200000,
    '1d': 86400000,
    '3d': 259200000,
    '1w': 604800000,
    '1M': 2592000000,
  };
  return timeframes[timeframe] || 0;
};

export const getNextTimeframe = (timeframe: string): string => {
  const timeframes: Dictionary<string> = {
    'tick': '1m',
    // 'tick': '0.2s',
    // '0.2s': '1s',
    // '1s': '1m',
    // '1m': '3m',
    // '3m': '5m',
    // '5m': '15m',
    // '15m': '30m',
    // '30m': '1h',
    // '1h': '2h',
    // '2h': '4h',
    // '4h': '6h',
    // '6h': '8h',
    // '8h': '12h',
    // '12h': '1d',
    // '1d': '3d',
    // '3d': '1w',
    // '1w': '1M',
  };
  return timeframes[timeframe] || '';
}

export const upsertCandle = (candle: Candle): void => {
  if (!store.candles) store.candles = {};
  if (!store.candles[candle.id]) store.candles[candle.id] = [];
  if (candle.status === 'closed') {
    store.candles[candle.id].push(candle);
  } else if (candle.status === 'open') {
    store.candles[candle.id][store.candles[candle.id].length - 1] = candle;
  }
}

// TODO: нужно понять какой брать диапазон свечек timeframeNameFrom необходимый для timeframeNameTo
// TODO: нужно определить статус свечки
// TODO: а может быть, что тик попадает в две свечки? Нужно определиться с этим
export const candlesToCandle = (candles: Candle[], timeframeNameFrom: string, timeFrameNameTo: string): Candle => {

  const timestampCurrent = +Date.now();
  // Разница между текущим временем и временем последней свечки
  const diff = timestampCurrent - candles[candles.length - 1].timestampEnd;

  const timeframeFrom = getTimeframeMilliseconds(timeframeNameFrom);
  const timeframeTo = getTimeframeMilliseconds(timeFrameNameTo);
  const timeframeId = timeFrameNameTo;
  const timeframeName = timeFrameNameTo;

  const status = 'closed'; // if tick then closed, if minute then look for timestampEnd

  const firstCandle = candles[0];
  const lastCandle = candles[candles.length - 1];
  const instrumentTimeframeId = `${firstCandle.pairId}/${firstCandle.exchangeId}/${timeframeName}`;
  const id = instrumentTimeframeId;
  const exchangeId = firstCandle.exchangeId;
  const instrumentId = firstCandle.instrumentId;
  const pairId = firstCandle.pairId;
  const baseId = firstCandle.baseId;
  const quoteId = firstCandle.quoteId;
  const timestamp = firstCandle.timestamp;
  const timestampStart = firstCandle.timestamp;
  const timestampEnd = lastCandle.timestamp;

  const open = candles[0].open;
  const high = candles.reduce((acc, candle) => Math.max(acc, candle.high), 0);
  const low = candles.reduce((acc, candle) => Math.min(acc, candle.low), Infinity);
  const close = candles[candles.length - 1].close;

  const count = candles.reduce((acc, candle) => acc + candle.count, 0);
  const buyCount = candles.reduce((acc, candle) => acc + candle.buyCount, 0);
  const sellCount = candles.reduce((acc, candle) => acc + candle.sellCount, 0);
  const buyVolume = candles.reduce((acc, candle) => acc + candle.buyVolume, 0);
  const sellVolume = candles.reduce((acc, candle) => acc + candle.sellVolume, 0);
  const volume = candles.reduce((acc, candle) => acc + candle.volume, 0);

  const bestAsk = candles.reduce((acc, candle) => Math.min(acc, candle.bestAsk), Infinity);
  const bestBid = candles.reduce((acc, candle) => Math.max(acc, candle.bestBid), 0);
  const spreadPrice = (bestBid + bestAsk) / 2;
  // cluster points это массив цен от низкой к высокой, где просуммирован весь объем свечки по каждой кон
  const clusterPoints = candles.reduce((acc: any, candle: any) => {
    if (!acc[candle.price]) acc[candle.price] = 0;
    acc[candle.price] += candle.amount;
    return acc;
  }, {});
  const change = close - open;
  const changePercent = (close - open) / open * 100;
  const changePercentAbs = Math.abs(changePercent);

  const countDisbalance = buyCount - sellCount;
  const countDisbalancePercent = (buyCount - sellCount) / count * 100;
  const countDisbalancePercentAbs = Math.abs(countDisbalancePercent);

  const volumeDisbalance = buyVolume - sellVolume;
  const volumeDisbalancePercent = (buyVolume - sellVolume) / volume * 100;
  const volumeDisbalancePercentAbs = Math.abs(volumeDisbalancePercent);

  // Средневзвешенная цена покупки — это средняя цена покупки, весом которых является объем соответствующих сделок на покупку
  const weightedAverageBuyPrice = buyVolume / buyCount;
  // Средневзвешенная цена продажи — это средняя цена продажи, весом которых является объем соответствующих сделок на продажу
  const weightedAverageSellPrice = sellVolume / sellCount;
  // Средневзвешенная цена — это средняя цена сделок, весом которых является объем сделок
  const weightedAveragePrice = volume / count;

  // Медианная цена покупки от
  const medianBuyPrice = candles[Math.floor(buyCount / 2)]?.medianBuyPrice;
  // Медианная цена продажи
  const medianSellPrice = candles[Math.floor(sellCount / 2)]?.medianSellPrice;
  // Медианная цена
  const medianPrice = candles[Math.floor(count / 2)]?.medianPrice;

  // Стандартное отклонение от медианных цен
  const priceStandardDeviation = Math.sqrt(candles.reduce((acc, candle) => acc + Math.pow(candle.medianPrice - medianPrice, 2), 0) / count);

    // calculate Heikin-Ashi
  var xClose;
  var xOpen;
  var xHigh;
  var xLow;
  if (store.candles[id].length > 1) {
    // first previous candle with status Closed
    const previousCandle: Candle = store.candles[id].filter(candle => candle.status === 'closed')[store.candles[id].length - 1];
    if (previousCandle.xClose === undefined || previousCandle.xOpen === undefined) {
      previousCandle.xClose = previousCandle.close;
      previousCandle.xOpen = previousCandle.open;
    }
    xClose = (open + high + low + close) / 4;
    xOpen = (previousCandle?.xOpen + previousCandle?.xClose) / 2;
    xHigh = Math.max(high, xOpen, xClose);
    xLow = Math.min(low, xOpen, xClose);
  }


  var candle: Candle = {
    id,
    exchangeId,
    instrumentId,
    pairId,
    baseId,
    quoteId,
    //
    timestamp,
    timestampStart,
    timestampEnd,
    timeframe: timeframeTo,
    timeframeId,
    timeframeName,
    status,
    open,
    high,
    low,
    close,
    // Heikin-Ashi
    xClose,
    xOpen,
    xHigh,
    xLow,

    // counts
    count,
    buyCount,
    sellCount,
    // volumes
    buyVolume,
    sellVolume,
    volume,
    // cluster
    // Нужно для синхронизации со стаканом
    bestAsk,
    bestBid,
    spreadPrice,
    clusterPoints,
    // orders,

    // new fields
    change,
    changePercent,
    changePercentAbs,
    countDisbalance,
    countDisbalancePercent,
    countDisbalancePercentAbs,
    volumeDisbalance,
    volumeDisbalancePercent,
    volumeDisbalancePercentAbs,
    weightedAverageBuyPrice,
    weightedAverageSellPrice,
    weightedAveragePrice,
    medianBuyPrice,
    medianSellPrice,
    medianPrice,
    priceStandardDeviation,
  };

  return candle;

}



// Сама задача:
// Нужно написать функцию или набор функций на typescript, которая постоянно принимает trade и формирует свечки на их основе (словарь со свечками под каждую торговую пару лежит в глобальной переменной)
export const tradesToCandle = (tick: Trade[], timeframeName: string): Candle => {
  const firstTrade = tick[0];
  const lastTrade = tick[tick.length - 1];
  const instrumentTimeframeId = `${firstTrade.pairId}/${firstTrade.exchangeId}/${timeframeName}`;
  const id = instrumentTimeframeId;

  if (!store.candles) store.candles = {};
  if (!store.candles[id]) store.candles[id] = [];

  // const timeframe = getTimeframeMilliseconds('tick');
  // const timeframeId = 'tick';
  // const timeframeName = 'tick';
  const timeframe = getTimeframeMilliseconds(timeframeName);
  const timeframeId = timeframeName;
  const status = 'closed'; // if tick then closed, if minute then look for timestampEnd


  const exchangeId = firstTrade.exchangeId;
  const instrumentId = firstTrade.instrumentId;
  const pairId = firstTrade.pairId;
  const baseId = firstTrade.baseId;
  const quoteId = firstTrade.quoteId;
  const timestamp = firstTrade.timestamp;
  const timestampStart = firstTrade.timestamp;
  const timestampEnd = lastTrade.timestamp;

  const open = tick[0].price;
  const high = tick.reduce((acc, trade) => Math.max(acc, trade.price), 0);
  const low = tick.reduce((acc, trade) => Math.min(acc, trade.price), Infinity);
  const close = tick[tick.length - 1].price;

  const count = tick.length;
  const buyCount = tick.filter(trade => trade.side === 'buy').length;
  const sellCount = tick.filter(trade => trade.side === 'sell').length;
  const buyVolume = tick.filter(trade => trade.side === 'buy').reduce((acc, trade) => acc + trade.amount, 0);
  const sellVolume = tick.filter(trade => trade.side === 'sell').reduce((acc, trade) => acc + trade.amount, 0);
  const volume = tick.reduce((acc, trade) => acc + trade.amount, 0);

  const bestAsk = tick.reduce((acc, trade) => Math.min(acc, trade.price), Infinity);
  const bestBid = tick.reduce((acc, trade) => Math.max(acc, trade.price), 0);
  const spreadPrice = (bestBid + bestAsk) / 2;
  // cluster points это массив цен от низкой к высокой, где просуммирован весь объем свечки по каждой конкретной цене
  const clusterPointsObject = tick.reduce((acc: any, trade: any) => {
    if (!acc[trade.price]) acc[trade.price] = 0;
    acc[trade.price] += trade.amount;
    return acc;
  }, {});
  //
  // interface ClusterPoint {
  //   price: number;
  //   volume: number;
  //   percent: number;
  //   timestampFounded?: number; // время нахождения интересного события
  //   timestampLifeTime?: number;
  //   labelsId?: string[]; // чтобы отмечать стенки и интересные позиции
  //   messagesId?: string[]; // чтобы отмечать стенки и интересные позиции
  // }
  
  // clusterPoints to interface ClusterPoint с помощьд библиотеки lodash
  // object to array + add  fields from ClusterPoint
  const clusterPointsUnsorted = _.map(clusterPointsObject, (volume, price) => {
    const percent = volume / tick.reduce((acc, trade) => acc + trade.amount, 0) * 100;
    return {
      price: +price,
      volume,
      percent,
    };
  });
  // sort by price from low to high
  const clusterPoints = _.sortBy(clusterPointsUnsorted, 'price');

  // calculate Heikin-Ashi
  var xClose;
  var xOpen;
  var xHigh;
  var xLow;
  if (store.candles[id].length > 1) {
    // first previous candle with status Closed
    const previousCandle: Candle = store.candles[id].filter(candle => candle.status === 'closed')[store.candles[id].length - 1];
    if (previousCandle.xClose === undefined || previousCandle.xOpen === undefined) {
      previousCandle.xClose = previousCandle.close;
      previousCandle.xOpen = previousCandle.open;
    }
    xClose = (open + high + low + close) / 4;
    xOpen = (previousCandle?.xOpen + previousCandle?.xClose) / 2;
    xHigh = Math.max(high, xOpen, xClose);
    xLow = Math.min(low, xOpen, xClose);
  }

  // new fields
  const change = close - open;
  const changePercent = (close - open) / open * 100;
  const changePercentAbs = Math.abs(changePercent);

  const countDisbalance = buyCount - sellCount;
  const countDisbalancePercent = (buyCount - sellCount) / count * 100;
  const countDisbalancePercentAbs = Math.abs(countDisbalancePercent);

  const volumeDisbalance = buyVolume - sellVolume;
  const volumeDisbalancePercent = (buyVolume - sellVolume) / volume * 100;
  const volumeDisbalancePercentAbs = Math.abs(volumeDisbalancePercent);

  // Средневзвешенная цена покупки — это средняя цена покупки, весом которых является объем соответствующих сделок на покупку
  const weightedAverageBuyPrice = buyVolume / buyCount;
  // Средневзвешенная цена продажи — это средняя цена продажи, весом которых является объем соответствующих сделок на продажу
  const weightedAverageSellPrice = sellVolume / sellCount;
  // Средневзвешенная цена — это средняя цена сделок, весом которых является объем сделок
  const weightedAveragePrice = volume / count;

  // Медианная цена покупки
  const medianBuyPrice = tick.filter(trade => trade.side === 'buy').sort((a, b) => a.price - b.price)[Math.floor(buyCount / 2)]?.price;
  // Медианная цена продажи
  const medianSellPrice = tick.filter(trade => trade.side === 'sell').sort((a, b) => a.price - b.price)[Math.floor(sellCount / 2)]?.price;
  // Медианная цена
  const medianPrice = tick.sort((a, b) => a.price - b.price)[Math.floor(count / 2)]?.price;

  // Стандартное отклонение цены в долях — это мера волатильности, показывающая, насколько сильно цена акции изменяется за период в процентах
  const priceStandardDeviation = Math.sqrt(tick.reduce((acc, trade) => acc + Math.pow(trade.price - weightedAveragePrice, 2), 0) / count);

  // Получить ордербук на эту пару ???
  // const orders = 


  var candle: Candle = {
    id,
    exchangeId,
    instrumentId,
    pairId,
    baseId,
    quoteId,
    //
    timestamp,
    timestampStart,
    timestampEnd,
    timeframe,
    timeframeId,
    timeframeName,
    status,
    open,
    high,
    low,
    close,
    // Heikin-Ashi
    xClose,
    xOpen,
    xHigh,
    xLow,

    // counts
    count,
    buyCount,
    sellCount,
    // volumes
    buyVolume,
    sellVolume,
    volume,
    // cluster
    // Нужно для синхронизации со стаканом
    bestAsk,
    bestBid,
    spreadPrice,
    clusterPoints,
    // orders,

    // new fields
    change,
    changePercent,
    changePercentAbs,
    countDisbalance,
    countDisbalancePercent,
    countDisbalancePercentAbs,
    volumeDisbalance,
    volumeDisbalancePercent,
    volumeDisbalancePercentAbs,
    weightedAverageBuyPrice,
    weightedAverageSellPrice,
    weightedAveragePrice,
    medianBuyPrice,
    medianSellPrice,
    medianPrice,
    priceStandardDeviation,
  };

  return candle;
  // TODO: запись вынести в отдельную функцию
  // if (!store.candles) store.candles = {};
  // if (!store.candles[id]) store.candles[id] = [];
  // store.candles[id].push(candle);

  // run next tick if exist based on candles
  // const nextTimeframeName = getNextTimeframe(timeframeName);
  // nextTimeframeName && tradesToCandles(nextTimeframeName);

}