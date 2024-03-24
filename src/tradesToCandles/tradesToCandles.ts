import { Trade, Candle, CandleIndicator } from '../types';
import { getTimeframeMilliseconds } from 'src/getTimeframeMilliseconds/getTimeframeMilliseconds';
import { store } from "../db/store/store";

// разбиваем трейды на срезы для генерации свечек
export const tradesToCandles = async ({trades, pair, timeframeName}: {trades: Trade[], pair: string, timeframeName: string}) => {
  // trades.sort((a, b) => a.timestamp - b.timestamp); // опционально можно дополнительно отсортировать трейды
  const startTimestamp = trades?.[0]?.timestamp;
  const endTimestamp = trades?.[trades.length - 1]?.timestamp;
  // нужно получить ровные интервалы времени (для секундых свечек, т.е. где timeframeName = 1s: 00:00:00, 00:00:01, 00:00:02, ...)
  // т.е. в диапазоне [startTimestamp : endTimestamp)
  const timeframeInMs = getTimeframeMilliseconds(timeframeName);

  // Мне нужен 100мс интервал
  // Convert startTimestamp and endTimestamp to 100ms intervals
  const start = Math.floor(startTimestamp / timeframeInMs);
  const end = Math.floor(endTimestamp / timeframeInMs);

  // Generate even time intervals
  const timeIntervals = [];
  for (let time = start; time < end; time += timeframeInMs) {
    timeIntervals.push(time * timeframeInMs); // Convert back to milliseconds
  }

  console.log(timeIntervals);


  // идем в store.candles и смотрим, есть ли свечи в нужном таймфрейме
  // если нет, то генерируем
  // если есть, то обновляем
  // возвращаем массив свечек
  const candles: Candle[] = [];
  for (const time of timeIntervals) {
    // const candle = store.candles
    candles.push( );
  }
  return true;
}