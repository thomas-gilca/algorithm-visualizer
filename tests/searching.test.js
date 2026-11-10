import { describe, it, expect } from 'vitest';
import { linearSearch } from '../src/algorithms/searching/linear.js';
import { binarySearch } from '../src/algorithms/searching/binary.js';
import { randomArray, randomInt } from '../src/utils/random.js';

const lastStep = (steps) => [...steps].at(-1);

describe('searching', () => {
  it('linear search finds the first occurrence, or nothing', () => {
    for (let t = 0; t < 200; t++) {
      const array = randomArray(10, 1, 20);
      const target = randomInt(1, 20);
      const found = lastStep(linearSearch({ array, target })).found;
      expect(found ?? -1).toBe(array.indexOf(target));
    }
  });

  it('binary search finds the value when it exists', () => {
    for (let t = 0; t < 200; t++) {
      const array = randomArray(15, 1, 30).sort((x, y) => x - y);
      const target = randomInt(1, 30);
      const found = lastStep(binarySearch({ array, target })).found;
      if (array.includes(target)) expect(array[found]).toBe(target);
      else expect(found).toBeUndefined();
    }
  });

  it('binary search needs at most 6 comparisons for 40 elements', () => {
    const array = Array.from({ length: 40 }, (_, i) => i + 1);
    for (const target of [1, 20, 40, 41]) {
      expect(lastStep(binarySearch({ array, target })).stats.Comparisons).toBeLessThanOrEqual(6);
    }
  });
});