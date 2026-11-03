import { describe, it, expect } from 'vitest';
import { ALGORITHMS } from '../src/algorithms/registry.js';
import { randomArray } from '../src/utils/random.js';

const sorters = ALGORITHMS.filter((a) => a.category === 'sorting');
const ascending = (array) => [...array].sort((x, y) => x - y);

for (const algo of sorters) {
  describe(algo.name, () => {
    it('sorts 200 random arrays', () => {
      for (let t = 0; t < 200; t++) {
        const input = randomArray(2 + Math.floor(Math.random() * 39));
        const steps = [...algo.run(input)];
        expect(steps.at(-1).array).toEqual(ascending(input));
      }
    });

    it('handles edge cases', () => {
      const cases = [[1, 2], [2, 1], [1, 2, 3, 4], [4, 3, 2, 1], [7, 7, 7, 7], [5, 1, 5, 1]];
      for (const input of cases) {
        expect([...algo.run(input)].at(-1).array).toEqual(ascending(input));
      }
    });

    it('does not change its input', () => {
      const input = [5, 3, 8, 1];
      [...algo.run(input)];
      expect(input).toEqual([5, 3, 8, 1]);
    });

    it('marks every index as sorted at the end', () => {
      const input = randomArray(15);
      const last = [...algo.run(input)].at(-1);
      expect(new Set(last.sorted).size).toBe(input.length);
    });

    it('only points at real pseudocode lines', () => {
      for (const step of algo.run(randomArray(12))) {
        expect(step.line).toBeLessThan(algo.code.length);
      }
    });
  });
}