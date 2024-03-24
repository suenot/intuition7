import { Trade, Candle, CandleIndicator } from '../types';
import { getTimeframeMilliseconds } from '../getTimeframeMilliseconds/getTimeframeMilliseconds';
import { store } from "../db/store/store";
import { demoTrades } from './data';
import { tradesToCandle } from '../tradesToCandle/tradesToCandle';
import { demoCandleIndicators } from '../tradesToCandle/demoCandleIndicators';

// разбиваем трейды на срезы для генерации свечек
export const tradesToCandles = async ({trades, pair, timeframeName, mergeWithStore}: {trades: Trade[], pair: string, timeframeName: string, mergeWithStore?: boolean}) => {
  // trades.sort((a, b) => a.timestamp - b.timestamp); // опционально можно дополнительно отсортировать трейды
  const startTimestamp = trades?.[0]?.timestamp;
  const endTimestamp = trades?.[trades.length - 1]?.timestamp;
  const diffTimestamp = endTimestamp - startTimestamp;
  console.log({startTimestamp, endTimestamp, diffTimestamp});
  // нужно получить ровные интервалы времени (для секундых свечек, т.е. где timeframeName = 1s: 00:00:00, 00:00:01, 00:00:02, ...)
  // т.е. в диапазоне [startTimestamp : endTimestamp)
  const timeframeInMs = getTimeframeMilliseconds(timeframeName);
  console.log({timeframeInMs});

  // Мне нужен 100мс интервал
  // Convert startTimestamp and endTimestamp to 100ms intervals
  const start = Math.floor(startTimestamp / timeframeInMs);
  const end = Math.floor(endTimestamp / timeframeInMs);
  const diff = end - start;
  const numberOfCandles = diff / timeframeInMs;
  console.log({start, end, diff, numberOfCandles});

  // Generate even time intervals
  const timeIntervals = [];
  for (let time = start; time < end; time += timeframeInMs) {
    timeIntervals.push(time * timeframeInMs); // Convert back to milliseconds
  }
  console.log({timeIntervals});

  // if (mergeWithStore) {
  // TODO: получаем для каждого интервала свечи из store.candles
  // }

  // Generate candles
  const candles: Candle[] = [];
  for (const timeInterval of timeIntervals) {
    const tradesInInterval = trades.filter((trade) => {
      return trade.timestamp >= timeInterval && trade.timestamp < timeInterval + timeframeInMs;
    });
    if (tradesInInterval.length === 0) continue;
    const candle = await tradesToCandle(tradesInInterval, timeframeName, demoCandleIndicators);
    candles.push(candle);
  }

  return candles;
}