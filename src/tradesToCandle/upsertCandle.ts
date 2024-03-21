import { Candle } from '../types';
import { store } from "../db/store/store";
import _ from 'lodash';

export const upsertCandle = (candle: Candle): void => {
  if (!candle || !candle.id) return; // return early if candle or candle.id is undefined

  if (!store.candles) store.candles = {};
  if (!store.candles[candle.id]) store.candles[candle.id] = [];
  if (candle.status === 'closed') {
    store.candles[candle.id].push(candle);
  } else if (candle.status === 'open') {
    store.candles[candle.id][store.candles[candle.id].length - 1] = candle;
  }
}