import { Trade, Candle, Dictionary, CandleIndicator } from '../types'; // TODO: использовать ClusterPoint вместо any
import { store } from "../db/store/store";
import { getTimeframeMilliseconds } from '../getTimeframeMilliseconds/getTimeframeMilliseconds';
import _ from 'lodash';
import { listen } from 'bun';
import { demoCandleIndicators } from './demoCandleIndicators';

export const firstTradeFn = (tick: Trade[]) => tick[0];

export const lastTradeFn = (tick: Trade[]) => tick[tick.length - 1];

export const instrumentTimeframeIdFn = (firstTrade: Trade, timeframeName: string): string => `${firstTrade.pairId}/${firstTrade.exchangeId}/${timeframeName}`;

export const createInstrumentTimeframeId = (instrumentTimeframeId: string) => {
  if (!store.candles) store.candles = {};
  if (!store.candles[instrumentTimeframeId]) store.candles[instrumentTimeframeId] = [];
}

export const tradesToCandlesFunctions = {
  id: (params: object) => { return "BTC/USDT/binance/1m" },
  exchangeId: (params: object) => { return "exchangeId" },
  instrumentId: (params: object) => { return "instrumentId" },
  pairId: (params: object) => { return "pairId" },
  baseId: (params: object) => { return "baseId" },
  quoteId: (params: object) => { return "quoteId" },
  timestamp: (params: object) => { return Date.now() },
  timestampStart: (params: object) => { return Date.now() },
  timestampEnd: (params: object) => { return Date.now() },
  timeframe: (params: object) => { return 60000 },
  timeframeId: (params: object) => { return "1m" },
  timeframeName: (params: object) => { return "1 minute" },
  status: (params: object) => { return "closed" },
  open: (params: object) => { return 50000 },
  high: (params: object) => { return 51000 },
  low: (params: object) => { return 49000 },
  close: (params: object) => { return 50000 },
  xClose: (params: object) => { return 50000 },
  xOpen: (params: object) => { return 50000 },
  xHigh: (params: object) => { return 51000 },
  xLow: (params: object) => { return 49000 },
  count: (params: object) => { return 100 },
  buyCount: (params: object) => { return 60 },
  sellCount: (params: object) => { return 40 },
  buyVolume: (params: object) => { return 6000 },
  sellVolume: (params: object) => { return 4000 },
  volume: (params: object) => { return 10000 },
  bestAsk: (params: object) => { return 50000 },
  bestBid: (params: object) => { return 49000 },
  spreadPrice: (params: object) => { return 1000 },
  clusterPoints: (params: object) => { return [] },
  change: (params: object) => { return 100 },
  changePercent: (params: object) => { return 2 },
  changePercentAbs: (params: object) => { return 2 },
  countDisbalance: (params: object) => { return 20 },
  countDisbalancePercent: (params: object) => { return 20 },
  countDisbalancePercentAbs: (params: object) => { return 20 },
  volumeDisbalance: (params: object) => { return 2000 },
  volumeDisbalancePercent: (params: object) => { return 20 },
  volumeDisbalancePercentAbs: (params: object) => { return 20 },
  weightedAverageBuyPrice: (params: object) => { return 50000 },
  weightedAverageSellPrice: (params: object) => { return 49000 },
  weightedAveragePrice: (params: object) => { return 49500 },
  medianBuyPrice: (params: object) => { return 50000 },
  medianSellPrice: (params: object) => { return 49000 },
  medianPrice: (params: object) => { return 49500 },
  priceStandardDeviation: (params: object) => { return 500 },
  orders: (params: object) => { return [] },
}

// Then in your function where you use it:
export const tradesToCandle = (tick: Trade[], timeframeName: string, indicators: CandleIndicator[]): Candle => {
  let candle: any = {}; // Ideally, this should be Partial<Candle>
  if (indicators.length === 0) {
    return candle as Candle;
  }
  for (const indicator of indicators) {
    // Check if indicator is an object and has the necessary properties
    if (typeof indicator === 'object' && indicator !== null && 'value' in indicator && 'fn' in indicator && 'params' in indicator) {
      candle[indicator.value] = tradesToCandlesFunctions[indicator.fn](indicator.params);
    }
  }
  return candle as Candle;
};

export const _tradesToCandle = (tick: Trade[], timeframeName: string): Candle => {
  // let candle: any = {};

  const firstTrade = firstTradeFn(tick);
  const lastTrade = lastTradeFn(tick);
  const id = instrumentTimeframeIdFn(firstTrade, timeframeName);
  
  createInstrumentTimeframeId(id);

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
  
  // clusterPoints to interface ClusterPoint с помощью библиотеки lodash
  const clusterPointsUnsorted = _.map(clusterPointsObject, (volume, price) => {
    const percent = volume / tick.reduce((acc, trade) => acc + trade.amount, 0) * 100;
    return {
      price: +price,
      volume,
      percent,
    };
  });
  // sort by price from high to low
  const clusterPoints = _.orderBy(clusterPointsUnsorted, ['price'], ['desc']);

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
  let weightedAverageBuyPrice = undefined;
  if (buyCount !== 0 && buyVolume !== undefined && buyCount !== undefined) {
    weightedAverageBuyPrice = buyVolume / buyCount;
  }
  // Средневзвешенная цена продажи — это средняя цена продажи, весом которых является объем соответствующих сделок на продажу
  let weightedAverageSellPrice = undefined;
  if (sellCount !== 0 && sellVolume !== undefined && sellCount !== undefined) {
    weightedAverageSellPrice = sellVolume / sellCount;
  }
  // Средневзвешенная цена — это средняя цена сделок, весом которых является объем сделок
  const weightedAveragePrice = volume / count;

  // Медианная цена покупки
  let medianBuyPrice = undefined;
  if (buyCount !== 0) {
    medianBuyPrice = tick.filter(trade => trade.side === 'buy').sort((a, b) => a.price - b.price)[Math.floor(buyCount / 2)]?.price;
  }
  // Медианная цена продажи
  let medianSellPrice = undefined;
  if (sellCount !== 0) {
    medianSellPrice = tick.filter(trade => trade.side === 'sell').sort((a, b) => a.price - b.price)[Math.floor(sellCount / 2)]?.price;
  }
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
