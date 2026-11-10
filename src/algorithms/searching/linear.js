export function* linearSearch({ array, target }) {
  const n = array.length;
  let comparisons = 0;

  const snap = (extra) => ({
    array,
    stats: { Comparisons: comparisons },
    vars: { Target: target },
    ...extra,
  });

  yield snap({ line: 0, msg: `Look for ${target}, checking every element from left to right` });

  for (let i = 0; i < n; i++) {
    comparisons++;
    // range [i, n − 1]: ce am verificat deja devine estompat
    yield snap({ line: 2, compare: [i], range: [i, n - 1], pointers: { i }, msg: `Is a[${i}] = ${array[i]} equal to ${target}?` });
    if (array[i] === target) {
      yield snap({ line: 2, found: i, pointers: { i }, msg: `Yes: found ${target} at index ${i}` });
      return;
    }
  }

  yield snap({ line: 3, range: [0, -1], msg: `${target} is not in the array: return −1` });
}

export default {
  id: 'linear',
  name: 'Linear Search',
  category: 'searching',
  input: 'search',
  renderer: 'bars',
  run: linearSearch,
  code: [
    'linearSearch(a, x)',
    '  for i = 0 to n − 1',
    '    if a[i] = x: return i',
    '  return −1',
  ],
  complexity: { Best: 'O(1)', Average: 'O(n)', Worst: 'O(n)', Memory: 'O(1)', 'Needs sorted input': 'no' },
};