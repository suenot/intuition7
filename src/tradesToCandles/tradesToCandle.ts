import { Trade, Candle, Dictionary } from '../types'; // TODO: использовать ClusterPoint вместо any
import { store } from "../db/store/store";
import { getTimeframeMilliseconds } from '../getTimeframeMilliseconds/getTimeframeMilliseconds';
import _ from 'lodash';

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
