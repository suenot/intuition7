import { CandleIndicator } from '../types';
import { createStoreCandlesId } from '../createStoreCandlesId/createStoreCandlesId';

export const demoCandleIndicators: CandleIndicator[] = [
  {
    "value": "id",
    "fn": "instrumentTimeframeIdFn",
    "params": [],
    callback: (id: any) => {createStoreCandlesId(id)},
  },
  {
    "value": "exchangeId",
    "fn": "exchangeId",
    "params": [],
    callback: undefined,
  },
  {
    "value": "instrumentId",
    "fn": "instrumentId",
    "params": [],
    callback: undefined,
  },
  {
    "value": "pairId",
    "fn": "pairId",
    "params": [],
    callback: undefined,
  },
  {
    "value": "baseId",
    "fn": "baseId",
    "params": [],
    callback: undefined,
  },
  {
    "value": "quoteId",
    "fn": "quoteId",
    "params": [],
    callback: undefined,
  },
  {
    "value": "timestamp",
    "fn": "timestamp",
    "params": [],
    callback: undefined,
  },
  {
    "value": "timestampStart",
    "fn": "timestampStart",
    "params": [],
    callback: undefined,
  },
  {
    "value": "timestampEnd",
    "fn": "timestampEnd",
    "params": [],
    callback: undefined,
  },
  {
    "value": "timeframeMs",
    "fn": "timeframeMs",
    "params": [],
    callback: undefined,
  },
  {
    "value": "timeframeName",
    "fn": "timeframeName",
    "params": [],
    callback: undefined,
  },
  {
    "value": "status",
    "fn": "status",
    "params": [],
    callback: undefined,
  },
  {
    "value": "open",
    "fn": "open",
    "params": [],
    callback: undefined,
  },
  {
    "value": "high",
    "fn": "high",
    "params": [],
    callback: undefined,
  },
  {
    "value": "low",
    "fn": "low",
    "params": [],
    callback: undefined,
  },
  {
    "value": "close",
    "fn": "close",
    "params": [],
    callback: undefined,
  },
  {
    "value": "xClose",
    "fn": "xClose",
    "params": [],
    callback: undefined,
  },
  {
    "value": "xOpen",
    "fn": "xOpen",
    "params": [],
    callback: undefined,
  },
  {
    "value": "xHigh",
    "fn": "xHigh",
    "params": [],
    callback: undefined,
  },
  {
    "value": "xLow",
    "fn": "xLow",
    "params": [],
    callback: undefined,
  },
  {
    "value": "count",
    "fn": "count",
    "params": [],
    callback: undefined,
  },
  {
    "value": "buyCount",
    "fn": "buyCount",
    "params": [],
    callback: undefined,
  },
  {
    "value": "sellCount",
    "fn": "sellCount",
    "params": [],
    callback: undefined,
  },
  {
    "value": "buyVolume",
    "fn": "buyVolume",
    "params": [],
    callback: undefined,
  },
  {
    "value": "sellVolume",
    "fn": "sellVolume",
    "params": [],
    callback: undefined,
  },
  {
    "value": "volume",
    "fn": "volume",
    "params": [],
    callback: undefined,
  },
  {
    "value": "bestAsk",
    "fn": "bestAsk",
    "params": [],
    callback: undefined,
  },
  {
    "value": "bestBid",
    "fn": "bestBid",
    "params": [],
    callback: undefined,
  },
  {
    "value": "spreadPrice",
    "fn": "spreadPrice",
    "params": [],
    callback: undefined,
  },
  {
    "value": "clusterPoints",
    "fn": "clusterPoints",
    "params": [],
    callback: undefined,
  },
  {
    "value": "change",
    "fn": "change",
    "params": [],
    callback: undefined,
  },
  {
    "value": "changePercent",
    "fn": "changePercent",
    "params": [],
    callback: undefined,
  },
  {
    "value": "changePercentAbs",
    "fn": "changePercentAbs",
    "params": [],
    callback: undefined,
  },
  {
    "value": "countDisbalance",
    "fn": "countDisbalance",
    "params": [],
    callback: undefined,
  },
  {
    "value": "countDisbalancePercent",
    "fn": "countDisbalancePercent",
    "params": [],
    callback: undefined,
  },
  {
    "value": "countDisbalancePercentAbs",
    "fn": "countDisbalancePercentAbs",
    "params": [],
    callback: undefined,
  },
  {
    "value": "volumeDisbalance",
    "fn": "volumeDisbalance",
    "params": [],
    callback: undefined,
  },
  {
    "value": "volumeDisbalancePercent",
    "fn": "volumeDisbalancePercent",
    "params": [],
    callback: undefined,
  },
  {
    "value": "volumeDisbalancePercentAbs",
    "fn": "volumeDisbalancePercentAbs",
    "params": [],
    callback: undefined,
  },
  {
    "value": "weightedAverageBuyPrice",
    "fn": "weightedAverageBuyPrice",
    "params": [],
    callback: undefined,
  },
  {
    "value": "weightedAverageSellPrice",
    "fn": "weightedAverageSellPrice",
    "params": [],
    callback: undefined,
  },
  {
    "value": "weightedAveragePrice",
    "fn": "weightedAveragePrice",
    "params": [],
    callback: undefined,
  },
  {
    "value": "medianBuyPrice",
    "fn": "medianBuyPrice",
    "params": [],
    callback: undefined,
  },
  {
    "value": "medianSellPrice",
    "fn": "medianSellPrice",
    "params": [],
    callback: undefined,
  },
  {
    "value": "medianPrice",
    "fn": "medianPrice",
    "params": [],
    callback: undefined,
  },
  {
    "value": "priceStandardDeviation",
    "fn": "priceStandardDeviation",
    "params": [],
    callback: undefined,
  }
]