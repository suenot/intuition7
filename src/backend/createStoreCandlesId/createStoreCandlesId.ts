import { store } from "../../db/store/store";
import { Candle } from '../../types';

// Грязная функция, которая создает заготовку для свечи в хранилище
export const createStoreCandlesId = ({candle}: {candle: Candle}) => {
  const {id} = candle;
  if (id) {
    if (!store?.candles) store.candles = {};
    if (!store?.candles?.[id]) store.candles[id] = {};
  }
}