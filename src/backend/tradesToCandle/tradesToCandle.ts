import { Trade, Candle, CandleIndicator } from '../../types';
import { store } from "../../db/store/store";
import { getTimeframeMilliseconds } from '../../backend/getTimeframeMilliseconds/getTimeframeMilliseconds';
import _ from 'lodash';
// import { demoCandleIndicators } from './demoCandleIndicators';

export const firstTradeFn = ({tick}: {tick: Trade[]}) => {
  // console.log('firstTradeFn');
  // console.log({tick})
  return tick?.[0];
}

export const lastTradeFn = ({tick}: {tick: Trade[]}) => tick?.[tick.length - 1];

export const instrumentTimeframeIdFn = ({candle}: {candle: Candle}): string | undefined => {
  const {firstTrade, timeframeName} = candle;
  // console.log({firstTrade, timeframeName});
  if (!firstTrade || !firstTrade.pairId || !firstTrade.exchangeId || !timeframeName) {
    return undefined;
  }
  return `${firstTrade?.pairId}/${firstTrade?.exchangeId}/${timeframeName}`
};

export const pairIdFn = ({candle}: {candle: Partial<Candle>}) => { return candle?.firstTrade ? candle?.firstTrade.pairId : undefined };

export const baseIdFn = ({candle}: {candle: Partial<Candle>}) => { return candle?.firstTrade ? candle?.firstTrade.baseId : undefined };

export const quoteIdFn = ({candle}: {candle: Partial<Candle>}) => { return candle?.firstTrade ? candle?.firstTrade.quoteId : undefined };

export const timestampFn = ({candle}: {candle: Partial<Candle>}) => {
  const { timeframeMs } = candle;
  if (!candle?.firstTrade?.timestamp || !timeframeMs) {
    return undefined;
  }
  return Math.floor(candle.firstTrade.timestamp / timeframeMs) * timeframeMs;
};

export const exchangeIdFn = ({candle}: {candle: Partial<Candle>}) => { return candle?.firstTrade ? candle?.firstTrade?.exchangeId : undefined };
export const instrumentIdFn = ({candle}: {candle: Partial<Candle>}) => { return candle?.firstTrade ? candle?.firstTrade.instrumentId : undefined };

export const timeframeMsFn = ({candle}: {candle: Partial<Candle>}) => { return getTimeframeMilliseconds(candle?.timeframeName || "") };

export const timeframeNameFn = ({timeframeName}: {timeframeName: string}) => { return timeframeName  || undefined};

export const statusFn = ({candle}: {candle: Partial<Candle>}) => {
  // TODO: Тут какая-то чушь, надо переосмыслить
  // const {timeframeMs, timestampStart, timestampEnd} = candle;
  // if (!timeframeMs || !timestampStart || !timestampEnd) {
  //   return undefined;
  // }
  // return timeframeMs + timestampStart <= timestampEnd ? 'open' : 'closed';
};

export const openFn = ({tick}: {tick: Trade[]}) => { return tick[0].price };
export const highFn = ({tick}: {tick: Trade[]}) => { return tick.reduce((acc, trade) => Math.max(acc, trade.price), 0) };
export const lowFn = ({tick}: {tick: Trade[]}) => { return tick.reduce((acc, trade) => Math.min(acc, trade.price), Infinity) };
export const closeFn = ({tick}: {tick: Trade[]}) => { return tick[tick.length - 1].price };


export const countFn = ({tick}: {tick: Trade[]}) => tick.length;
export const buyCountFn = ({tick}: {tick: Trade[]}) => tick.filter(trade => trade.side === 'buy').length;
export const sellCountFn = ({tick}: {tick: Trade[]}) => tick.filter(trade => trade.side === 'sell').length;
export const buyVolumeFn = ({tick}: {tick: Trade[]}) => tick.filter(trade => trade.side === 'buy').reduce((acc, trade) => acc + trade.amount, 0);
export const sellVolumeFn = ({tick}: {tick: Trade[]}) => tick.filter(trade => trade.side === 'sell').reduce((acc, trade) => acc + trade.amount, 0);
export const volumeFn = ({tick}: {tick: Trade[]}) => tick.reduce((acc, trade) => acc + trade.amount, 0);

export const bestAskFn = ({tick}: {tick: Trade[]}) => tick.reduce((acc, trade) => Math.min(acc, trade.price), Infinity);
export const bestBidFn = ({tick}: {tick: Trade[]}) => tick.reduce((acc, trade) => Math.max(acc, trade.price), 0);
export const spreadPriceFn = ({candle}: {candle: Candle}) => {
  const { bestBid, bestAsk } = candle;
  if (!bestBid || !bestAsk) {
    return undefined;
  }
  return (bestBid + bestAsk) / 2;
};

export const clusterPointsFn = ({tick}: {tick: Trade[]}) => {
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

  return clusterPoints;
}

export const changeFn = ({candle}: {candle: Candle}) => {
  const { open, close } = candle;
  if (!open || !close) return undefined;
  return close - open;
}
export const changePercentFn = ({candle}: {candle: Candle}) => {
  const { open, close } = candle;
  if (!open || !close) return undefined;
  return (close - open) / open * 100;
}
export const changePercentAbsFn = ({candle}: {candle: Candle}) => {
  const { changePercent } = candle;
  if (!changePercent) return undefined;
  return Math.abs(changePercent);
}

export const countDisbalanceFn = ({candle}: {candle: Candle}) => {
  const { buyCount, sellCount } = candle;
  if (!buyCount || !sellCount) return undefined;
  return buyCount - sellCount;
}

export const countDisbalancePercentFn = ({candle}: {candle: Candle}) => {
  const { buyCount, sellCount, count } = candle;
  if (!buyCount || !sellCount || !count) return undefined;
  return (buyCount - sellCount) / count * 100;
}
export const countDisbalancePercentAbsFn = ({candle}: {candle: Candle}) => {
  const { countDisbalancePercent } = candle;
  if (!countDisbalancePercent) return undefined;
  return Math.abs(countDisbalancePercent);
}

export const volumeDisbalanceFn = ({candle}: {candle: Candle}) => {
  const { buyVolume, sellVolume } = candle;
  if (!buyVolume || !sellVolume) return undefined;
  return buyVolume - sellVolume;
}
export const volumeDisbalancePercentFn = ({candle}: {candle: Candle}) => {
  const { buyVolume, sellVolume, volume } = candle;
  if (!buyVolume || !sellVolume || !volume) return undefined;
  return (buyVolume - sellVolume) / volume * 100;
}
export const volumeDisbalancePercentAbsFn = ({candle}: {candle: Candle}) => {
  const { volumeDisbalancePercent } = candle;
  if (!volumeDisbalancePercent) return undefined;
  return Math.abs(volumeDisbalancePercent);
}

// Средневзвешенная цена покупки — это средняя цена покупки, весом которых является объем соответствующих сделок на покупку
export const weightedAverageBuyPriceFn = ({candle}: {candle: Candle}) => {
  const { buyCount, buyVolume } = candle;
  if (!buyCount || !buyVolume) return undefined;
  return buyVolume / buyCount;
}

// Средневзвешенная цена продажи — это средняя цена продажи, весом которых является объем соответствующих сделок на продажу
export const weightedAverageSellPriceFn = ({candle}: {candle: Candle}) => {
  const { sellCount, sellVolume } = candle;
  if (!sellCount || !sellVolume) return undefined;
  return sellVolume / sellCount;
}

// Средневзвешенная цена — это средняя цена сделок, весом которых является объем сделок
export const weightedAveragePriceFn = ({candle}: {candle: Candle}) => {
  const { volume, count } = candle;
  if (!volume || !count) return undefined;
  return volume / count;
}
// Медианная цена покупки
export const medianBuyPriceFn = ({tick, candle}: {tick: Trade[], candle: Candle}) => {
  const { buyCount } = candle;
  if (!buyCount) return undefined;
  return tick.filter(trade => trade.side === 'buy').sort((a, b) => a.price - b.price)[Math.floor(buyCount / 2)]?.price;
}

// Медианная цена продажи
export const medianSellPriceFn = ({tick, candle}: {tick: Trade[], candle: Candle}) => {
  const { sellCount } = candle;
  if (!sellCount) return undefined;
  return tick.filter(trade => trade.side === 'sell').sort((a, b) => a.price - b.price)[Math.floor(sellCount / 2)]?.price;
}

// Медианная цена
export const medianPriceFn = ({tick, candle}: {tick: Trade[], candle: Candle}) => {
  const { count } = candle;
  if (!count) return undefined;
  return tick.sort((a, b) => a.price - b.price)[Math.floor(count / 2)]?.price;
}

// Стандартное отклонение цены в долях — это мера волатильности, показывающая, насколько сильно цена акции изменяется за период в процентах
export const priceStandardDeviationFn = ({tick, candle}: {tick: Trade[], candle: Candle}) => {
  const { count, weightedAveragePrice } = candle;
  if (!count || !weightedAveragePrice) return undefined;
  return Math.sqrt(tick.reduce((acc, trade) => acc + Math.pow(trade.price - weightedAveragePrice, 2), 0) / count);
}

export const getTimestampOfPreviousCandle = ({timestamp, timeframeName}: {timestamp: number, timeframeName: string}) => {
  const timeframeMs = getTimeframeMilliseconds(timeframeName);
  return timestamp - timeframeMs;
}

// Грязная функция, которая вытаскивает из хранилища предыдущую свечу с закрытым статусом
export const previousCandleFn = ({candle}: {candle: Candle}) => {
  const { id } = candle;
  if (!id || !store.candles[id]) return undefined;
  // return store.candles[id].filter(candle => candle.status === 'closed')[store.candles[id].length - 1];
  if (!candle.timestamp || !candle.timeframeName) return undefined;
  const timestampOfPreviousCandle = getTimestampOfPreviousCandle({timestamp: candle.timestamp, timeframeName: candle.timeframeName});
  return store.candles?.[id]?.[timestampOfPreviousCandle];
}

// Heikin-Ashi
export const xCloseFn = ({candle}: {candle: Candle}) => {
  const { open, high, low, close } = candle;
  if (!open || !high || !low || !close) return undefined;
  return (open + high + low + close) / 4;
}

export const xOpenFn = ({candle}: {candle: Candle}) => {
  const { previousCandle } = candle;
  if (!previousCandle || !previousCandle?.xOpen || !previousCandle?.xClose) return undefined;
  return (previousCandle?.xOpen + previousCandle?.xClose) / 2;
}

export const xHighFn = ({candle}: {candle: Candle}) => {
  const { high, xOpen, xClose } = candle;
  if (!high || !xOpen || !xClose) return undefined;
  return Math.max(high, xOpen, xClose);
}

export const xLowFn = ({candle}: {candle: Candle}) => {
  const { low, xOpen, xClose } = candle;
  if (!low || !xOpen || !xClose) return undefined;
  return Math.min(low, xOpen, xClose);
}

export const tradesToCandlesFunctions = {
  id: instrumentTimeframeIdFn,
  firstTrade: firstTradeFn,
  lastTrade: lastTradeFn,
  exchangeId: exchangeIdFn,
  instrumentId: instrumentIdFn,
  pairId: pairIdFn,
  baseId: baseIdFn,
  quoteId: quoteIdFn,
  timeframeMs: timeframeMsFn,
  timeframeName: timeframeNameFn,
  timestamp: timestampFn,
  status: statusFn,
  open: openFn,
  high: highFn,
  low: lowFn,
  close: closeFn,
  count: countFn,
  buyCount: buyCountFn,
  sellCount: sellCountFn,
  buyVolume: buyVolumeFn,
  sellVolume: sellVolumeFn,
  volume: volumeFn,
  bestAsk: bestAskFn,
  bestBid: bestBidFn,
  spreadPrice: spreadPriceFn,
  clusterPoints: clusterPointsFn,
  change: changeFn,
  changePercent: changePercentFn,
  changePercentAbs: changePercentAbsFn,
  countDisbalance: countDisbalanceFn,
  countDisbalancePercent: countDisbalancePercentFn,
  countDisbalancePercentAbs: countDisbalancePercentAbsFn,
  volumeDisbalance: volumeDisbalanceFn,
  volumeDisbalancePercent: volumeDisbalancePercentFn,
  volumeDisbalancePercentAbs: volumeDisbalancePercentAbsFn,
  weightedAverageBuyPrice: weightedAverageBuyPriceFn,
  weightedAverageSellPrice: weightedAverageSellPriceFn,
  weightedAveragePrice: weightedAveragePriceFn,
  medianBuyPrice: medianBuyPriceFn,
  medianSellPrice: medianSellPriceFn,
  medianPrice: medianPriceFn,
  priceStandardDeviation: priceStandardDeviationFn,
  // previousCandle: previousCandleFn,
  xClose: xCloseFn,
  xOpen: xOpenFn,
  xHigh: xHighFn,
  xLow: xLowFn,
  // orders: ordersFn,
  // trades?
}

// Get trades and candle indicators and return a candle. Save the candle to the store is not implemented here.
export const tradesToCandle = (tick: Trade[], timeframeName: string, indicators: CandleIndicator[]): Candle => {
  let candle: any = {}; // Ideally, this should be Partial<Candle>
  const previousCandle = previousCandleFn({candle});
  if (indicators.length === 0) {
    return candle as Candle;
  }
  for (const indicator of indicators) {
    // Check if indicator is an object and has the necessary properties
    if (typeof indicator === 'object' && indicator !== null && 'value' in indicator && 'fn' in indicator && 'params' in indicator) {
      candle[indicator.value] = tradesToCandlesFunctions[indicator.fn]({tick, candle, previousCandle, timeframeName, ...indicator.params} as any);
    }
  }
  // console.log({candle});
  return candle as Candle;
};