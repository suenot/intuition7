/**
 * Calculates the absolute time difference (lag) between two timestamps.
 * @param timestamp1 - The first timestamp.
 * @param timstamp2 - The second timestamp.
 * @returns The absolute time difference (lag) between the two timestamps.
 */
export const calculateLag = (timestamp1: number, timstamp2: number) => {
  return Math.abs(timestamp1 - timstamp2)
}
