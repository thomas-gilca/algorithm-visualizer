import bubble from './sorting/bubble.js';
import insertion from './sorting/insertion.js';
import selection from './sorting/selection.js';

export const ALGORITHMS = [bubble, selection,  insertion,];

export const findAlgorithm = (id) => ALGORITHMS.find((a) => a.id === id);