import { Trade, Candle, Dictionary } from '../types';
import { store } from "../db/store/store";
import _ from 'lodash';
import { getTimeframeMilliseconds } from '../getTimeframeMilliseconds/getTimeframeMilliseconds';

// TODO: нужно понять какой брать диапазон свечек timeframeNameFrom необходимый для timeframeNameTo
// TODO: нужно определить статус свечки
// TODO: а может быть, что тик попадает в две свечки? Нужно определиться с этим. tickToTicks() или divideTicksByMinutes()
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

  const count = candles.reduce((acc, candle) => acc + (candle?.count || 1), 0);
  const buyCount = candles.reduce((acc, candle) => acc + (candle?.buyCount || 1), 0);
  const sellCount = candles.reduce((acc, candle) => acc + (candle?.sellCount || 1), 0);
  const buyVolume = candles.reduce((acc, candle) => acc + (candle?.buyVolume || 0), 0);
  const sellVolume = candles.reduce((acc, candle) => acc + (candle?.sellVolume || 0), 0);
  const volume = candles.reduce((acc, candle) => acc + candle.volume, 0);

  const bestAsk = candles.reduce((acc, candle) => Math.min(acc, (candle.bestAsk || Infinity)), Infinity);
  const bestBid = candles.reduce((acc, candle) => Math.max(acc, (candle.bestBid || -Infinity)), 0);
  const spreadPrice = (bestBid + bestAsk) / 2;

  // TODO: нужно убедиться, чтобы собираются правильно
  const clusterPointsUnsorted = candles.reduce((acc: any, candle: any) => {
    candle.clusterPoints.forEach((clusterPoint: any) => {
      if (!acc[clusterPoint.price]) acc[clusterPoint.price] = 0;
      acc[clusterPoint.price] += clusterPoint.volume;
    });
    return acc;
  }, {});

  const clusterPoints = _.sortBy(clusterPointsUnsorted, 'price', 'desc');


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
  let medianPrice: number | undefined = undefined;
  if (count && count % 2 === 0) {
    medianPrice = candles[Math.floor(count / 2)]?.medianPrice;
  }

  // // Стандартное отклонение от медианных цен TODO
  // if (medianPrice && candle?.medianPrice && typeof candle.medianPrice === 'number') {
  //   const priceStandardDeviation = Math.sqrt(candles.reduce((acc, candle) => acc + Math.pow(candle.medianPrice - medianPrice, 2), 0) / count);
  // }

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
    // priceStandardDeviation,
  };

  return candle;

}