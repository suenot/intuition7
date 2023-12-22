import { expect, test, describe } from "bun:test";
import { calculateLag } from './calculateLag';

describe('calculateLag', () => {
  test('calculates the lag when timestamp2 is greater', () => {
    const timestamp1 = 1000;
    const timestamp2 = 2000;
    const result = calculateLag(timestamp1, timestamp2);
    expect(result).toBe(1000);
  });

  test('calculates the lag when timestamp1 is greater', () => {
    const timestamp1 = 3000;
    const timestamp2 = 2000;
    const result = calculateLag(timestamp1, timestamp2);
    expect(result).toBe(1000);
  });

  test('calculates the lag when timestamps are equal', () => {
    const timestamp1 = 1000;
    const timestamp2 = 1000;
    const result = calculateLag(timestamp1, timestamp2);
    expect(result).toBe(0);
  });
});
