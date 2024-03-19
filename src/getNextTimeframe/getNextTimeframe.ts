import { timeframes } from '../timeframes/timeframes';

// find the next timeframe with active = true, else return the current timeframe
export const getNextTimeframe = (timeframe: string): string => {
  const currentIndex = timeframes.findIndex((tf) => tf.name === timeframe);
  const nextTimeframe = timeframes.find((tf, i) => i > currentIndex && tf.active);
  return nextTimeframe ? nextTimeframe.name : timeframe;

}