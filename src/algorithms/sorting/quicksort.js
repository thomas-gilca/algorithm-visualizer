export function* quickSort(input){
    const a=[...input];
    const n= a.length;
    let sorted=[];
    let comparisons=0;
    let swaps=0;

    const snap =(extra) =>({
        array: [...a],
        sorted: [...sorted],
        stats: {Comparisons: comparisons, Swaps: swaps},
        ...extra,
    });

    yield snap({ line: 0, msg: 'Start: pick a pivot, move smaller values to its left, then sort both sides.' });
    
    function* sort(lo,hi){
        if(lo>hi)return;
        if(lo===hi){
            sorted.push(lo);
            yield snap({ line: 1, range: [lo, hi], msg: `a[${lo}..${hi}] has one element: ${a[lo]} is in its final place` });
            return;
        }

        const pivot=a[hi];
        let i = lo;
        yield snap({ line: 2, range: [lo, hi], pivot: hi, pointers: { i }, msg: `Pivot = a[${hi}] = ${pivot}` });

        for(let j = lo; j < hi; j++){
            comparisons++;
            yield snap({line: 4,range: [lo, hi],pivot: hi,compare: [j],pointers: { i, j },msg: `Is a[${j}] = ${a[j]} smaller than the pivot ${pivot}?`,});
            if(a[j]<pivot){
                if(i !== j){
                    [a[i],a[j]]=[a[j],a[i]];
                    swaps++;
                }
                yield snap({line: 5,range: [lo, hi],pivot: hi,swap: [i, j],pointers: { i, j },msg: i === j ? `Yes: ${a[i]} stays at index ${i}, and i moves right` : `Yes: swap it to index ${i}, and i moves right`,});
                i++;
            }
        }

        if(i !==hi){
            [a[i],a[hi]]=[a[hi],a[i]];
            swaps++;
        }
        sorted.push(i);
        yield snap({ line: 6, range: [lo, hi], swap: [i, hi], pointers: { i }, msg: `Put the pivot ${pivot} at index ${i}: its final place` });

        yield* sort(lo,i-1);
        yield* sort(i+1, hi);
    }
    yield* sort(0,n-1);
    sorted = a.map((_,k)=>k);
    yield snap({ line: -1, msg: 'Done: the array is sorted' });
}

export default {
  id: 'quicksort',
  name: 'Quick Sort',
  category: 'sorting',
  input: 'array',
  renderer: 'bars',
  run: quickSort,
  code: [
    'quickSort(a, lo, hi)',
    '  if lo ≥ hi: return',
    '  pivot = a[hi];  i = lo',
    '  for j = lo to hi − 1',
    '    if a[j] < pivot',
    '      swap(a[i], a[j]);  i = i + 1',
    '  swap(a[i], a[hi])   // pivot in its final place',
    '  quickSort(a, lo, i − 1);  quickSort(a, i + 1, hi)',
  ],
  complexity: { Best: 'O(n log n)', Average: 'O(n log n)', Worst: 'O(n²)', Memory: 'O(log n)', Stable: 'no' },
};