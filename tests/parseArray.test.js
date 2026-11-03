import { describe, it, expect } from 'vitest';
import { parseArray } from '../src/utils/parseArray.js';

describe('parseArray', () => {
  it('reads numbers separated by commas and spaces', () => {
    expect(parseArray('5, 3 8,1')).toEqual([5, 3, 8, 1]);
  });

  it('rejects text that is not a number', () => {
    expect(() => parseArray('5, x, 3')).toThrow('"x" is not a whole number');
  });

  it('rejects numbers outside 1..99', () => {
    expect(() => parseArray('5, 300')).toThrow('between 1 and 99');
  });

  it('needs at least two numbers', () => {
    expect(() => parseArray('7')).toThrow('at least 2');
  });
});