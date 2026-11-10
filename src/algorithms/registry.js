import bubble from './sorting/bubble.js';
import insertion from './sorting/insertion.js';
import selection from './sorting/selection.js';
import mergesort from './sorting/mergesort.js';
import quicksort from './sorting/quicksort.js';
import heapsort from './sorting/heapsort.js';
import linear from './searching/linear.js';
import binary from './searching/binary.js';

export const CATEGORIES = [
  { id: 'sorting', name: 'Sorting', blurb: 'Six ways to put an array in order, from O(n²) to O(n log n).' },
  { id: 'searching', name: 'Searching', blurb: 'Find a value by checking everything, or by halving a sorted array.' },
  { id: 'trees', name: 'Trees', blurb: 'Binary search trees, the four traversals and a binary heap.' },
  { id: 'graphs', name: 'Graphs', blurb: 'Explore, find shortest paths, order tasks and build spanning trees.' },
  { id: 'pathfinding', name: 'Pathfinding', blurb: 'Draw walls on a grid and race BFS against A*.' },
];


export const algorithmsIn = (categoryId) => ALGORITHMS.filter((a) => a.category === categoryId);

export const ALGORITHMS = [bubble, selection, insertion, mergesort, quicksort, heapsort, linear, binary, ];

export const findAlgorithm = (id) => ALGORITHMS.find((a) => a.id === id);
