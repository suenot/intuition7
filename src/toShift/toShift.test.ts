import { expect, test, describe } from "bun:test";
import { toShift } from './toShift';

describe('toShift', () => {
  test('should add elements from newArray to baseArray', () => {
    const baseArray = [1, 2, 3];
    const newArray = [4, 5, 6];
    const max = 6;

    const result = toShift(baseArray, newArray, max);

    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('should remove elements from baseArray if total length exceeds max', () => {
    const baseArray = [1, 2, 3];
    const newArray = [4, 5, 6];
    const max = 5;

    const result = toShift(baseArray, newArray, max);

    expect(result).toEqual([2, 3, 4, 5, 6]);
  });

  test('should not modify baseArray or newArray if total length does not exceed max', () => {
    const baseArray = [1, 2];
    const newArray = [3];
    const max = 5;

    const result = toShift(baseArray, newArray, max);

    expect(result).toEqual([1, 2, 3]);
  });
});