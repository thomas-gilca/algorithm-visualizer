import bubble from './sorting/bubble.js';
import insertion from './sorting/insertion.js';
import selection from './sorting/selection.js';
import mergesort from './sorting/mergesort.js';
import quicksort from './sorting/quicksort.js';
import heapsort from './sorting/heapsort.js';
import linear from './searching/linear.js';
import binary from './searching/binary.js';

export const ALGORITHMS = [bubble, selection, insertion, mergesort, quicksort, heapsort, linear, binary, ];

export const findAlgorithm = (id) => ALGORITHMS.find((a) => a.id === id);
