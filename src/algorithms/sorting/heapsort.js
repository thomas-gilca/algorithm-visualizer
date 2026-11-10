export function* heapSort(input) {
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

yield snap({ line: 0, msg: 'Start: turn the array into a max-heap, then move the maximum to the end, n − 1 times.' });

function* siftDown(i, size){
    while(true){
        const left= 2 * i + 1;
        const right= 2 * i + 2;
        const kids =[left,right].filter((c)=> c<size);
        if(kids.length === 0) return;

        let largest=i;
        for(const c of kids){
            comparisons++;
            if(a[c]>a[largest])largest =c;
        }
        yield snap({
        line: 6,
        key: i,
        compare: kids,
        pointers: { i },
        msg:
          largest === i
            ? `${a[i]} is not smaller than its children (${kids.map((c) => a[c]).join(', ')}): stop`
            : `The larger child of ${a[i]} is ${a[largest]}`,
      });
        if(largest === i) return;
    
    [a[i],a[largest]]=[a[largest],a[i]];
    swaps++;
    yield snap({ line: 7, swap: [i, largest], msg: `Swap: ${a[largest]} moves down, ${a[i]} moves up` });
    i = largest;
    }
  }
  for(let i = Math.floor(n/2)-1;i>=0;i--){
    yield snap({ line: 1, key: i, pointers: { i }, msg: `Build the heap: sift down a[${i}] = ${a[i]}` });
    yield* siftDown(i, n);
  }
  for(let end=n-1;end>=1;end--){
    [a[0], a[end]] = [a[end], a[0]];
    swaps++;
    sorted.push(end);
    yield snap({ line: 3, swap: [0, end], msg: `The maximum ${a[end]} goes to index ${end}, its final place` });
    yield* siftDown(0, end);
  }
  sorted.push(0);
  yield snap({ line: -1, msg: 'Done: the array is sorted' });
}
export default {
  id: 'heap-sort',
  name: 'Heap Sort',
  category: 'sorting',
  input: 'array',
  renderer: 'bars',
  run: heapSort,
  code: [
    'heapSort(a, n)',
    '  for i = ⌊n/2⌋ − 1 down to 0: siftDown(a, i, n)',
    '  for end = n − 1 down to 1',
    '    swap(a[0], a[end])   // the maximum goes to the end',
    '    siftDown(a, 0, end)',
    'siftDown(a, i, size)',
    '  c = the larger child of a[i] (inside size)',
    '  if a[c] > a[i]: swap them, i = c, repeat',
  ],
  complexity: { Best: 'O(n log n)', Average: 'O(n log n)', Worst: 'O(n log n)', Memory: 'O(1)', Stable: 'no' },
};