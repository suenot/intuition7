/**
 * Calculates the absolute time difference (lag) between two timestamps.
 * @param timestamp1 - The first timestamp.
 * @param timestamp2 - The second timestamp.
 * @returns The absolute time difference (lag) between the two timestamps.
 */
export const calculateLag = (timestamp1: number, timestamp2: number): number => {
  return Math.abs(timestamp1 - timestamp2)
}