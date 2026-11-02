export function* bubbleSort(input) {
  const a = [...input];
  const n = a.length;
  const sorted = [];
  let comparisons = 0;
  let swaps = 0;

  const snap = (extra) => ({
    array: [...a],
    sorted: [...sorted],
    stats: { Comparisons: comparisons, Swaps: swaps },
    ...extra,
  });

  yield snap({ line: 0, msg: `Start: n = ${n}. Each pass bubbles the largest remaining value to the right.` });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      comparisons++;
      yield snap({ line: 3, compare: [j, j + 1], msg: `Compare a[${j}] = ${a[j]} with a[${j + 1}] = ${a[j + 1]}` });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        swapped = true;
        yield snap({ line: 4, swap: [j, j + 1], msg: `${a[j + 1]} > ${a[j]}, so swap them` });
      }
    }
    sorted.push(n - 1 - i);
    yield snap({ line: 5, msg: `Pass ${i + 1} done: ${a[n - 1 - i]} is in its final place` });

    if (!swapped) {
      for (let k = 0; k < n - 1 - i; k++) sorted.push(k);
      yield snap({ line: 6, msg: 'No swaps in this pass, so the whole array is sorted' });
      return;
    }
  }
  sorted.push(0);
  yield snap({ line: -1, msg: 'Done: the array is sorted' });
}

export default {
  id: 'bubble',
  name: 'Bubble Sort',
  category: 'sorting',
  input: 'array',
  renderer: 'bars',
  run: bubbleSort,
  code: [
    'bubbleSort(a, n)',
    '  for i = 0 to n − 2',
    '    for j = 0 to n − 2 − i',
    '      if a[j] > a[j + 1]',
    '        swap(a[j], a[j + 1])',
    '    a[n − 1 − i] is in its final place',
    '    if no swap in this pass: stop',
  ],
  complexity: { Best: 'O(n)', Average: 'O(n²)', Worst: 'O(n²)', Memory: 'O(1)', Stable: 'yes' },
};