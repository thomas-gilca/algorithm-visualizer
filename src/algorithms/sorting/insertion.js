export function* insertionSort(input) {
  const a = [...input];
  const n = a.length;
  let partial = [0];
  let sorted = [];
  let comparisons = 0;
  let shifts = 0;

  const snap = (extra) => ({
    array: [...a],
    partial: [...partial],
    sorted: [...sorted],
    stats: { Comparisons: comparisons, Shifts: shifts },
    ...extra,
  });

  yield snap({ line: 0, msg: `Start: n = ${n}. The first element alone is a sorted prefix.` });

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    let pos = i; // unde se află acum key în tablou (doar pentru afișare)
    yield snap({ line: 2, key: pos, msg: `i = ${i}: take key = a[${i}] = ${key}` });

    while (j >= 0) {
      comparisons++;
      yield snap({ line: 3, compare: [j], key: pos, msg: `Is a[${j}] = ${a[j]} greater than key = ${key}?` });
      if (a[j] <= key) break;

      // Pseudocodul face a[j + 1] = a[j]. Pentru afișare punem key în „gaură”,
      // altfel pe ecran ar apărea aceeași valoare de două ori.
      a[j + 1] = a[j];
      a[j] = key;
      pos = j;
      shifts++;
      yield snap({ line: 4, swap: [j, j + 1], msg: `Yes: shift ${a[j + 1]} one place to the right` });
      j--;
    }

    partial = Array.from({ length: i + 1 }, (_, k) => k);
    yield snap({ line: 5, key: pos, msg: `Place key = ${key} at index ${pos}. Indices 0 to ${i} are now sorted.` });
  }

  partial = [];
  sorted = Array.from({ length: n }, (_, k) => k);
  yield snap({ line: -1, msg: 'Done: the array is sorted' });
}

export default {
  id: 'insertion',
  name: 'Insertion Sort',
  category: 'sorting',
  input: 'array',
  renderer: 'bars',
  run: insertionSort,
  code: [
    'insertionSort(a, n)',
    '  for i = 1 to n − 1',
    '    key = a[i];  j = i − 1',
    '    while j ≥ 0 and a[j] > key',
    '      a[j + 1] = a[j];  j = j − 1',
    '    a[j + 1] = key',
  ],
  complexity: { Best: 'O(n)', Average: 'O(n²)', Worst: 'O(n²)', Memory: 'O(1)', Stable: 'yes' },
};