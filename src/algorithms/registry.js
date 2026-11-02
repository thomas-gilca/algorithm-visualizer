import bubble from './sorting/bubble.js';
import insertion from './sorting/insertion.js';

export const ALGORITHMS = [bubble, insertion];

export const findAlgorithm = (id) => ALGORITHMS.find((a) => a.id === id);