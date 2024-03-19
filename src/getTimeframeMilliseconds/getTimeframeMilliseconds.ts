import { timeframes } from '../timeframes/timeframes';

export const getTimeframeMilliseconds = (timeframe: string): number => {
  const timeframeFound = timeframes.find((tf) => tf.name === timeframe);
  return timeframeFound ? timeframeFound.ms : 0;
};