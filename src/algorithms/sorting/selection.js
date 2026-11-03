export function* selectionSort(input){
    const a= [...input];
    const n= a.length;
    const sorted=[];
    let comparisons= 0 ;
    let swaps = 0;

    const snap = (extra) => ({
        array: [...a],
        sorted: [...sorted],
        stats: {Comparisons: comparisons, Swaps: swaps },
        ...extra,
    });

    yield snap({line: 0, msg: `Start: n = ${n}. For each element, find the minimum, put it first then repeat.`});

    for(let i=0; i<n-1; i++){
        let min=i;
        yield snap({line : 2, key: min, pointers:{i,min}, msg: `Assume that a[${i}]=${a[i]} is the minimum of the array.` });
        for(let j = i+1; j < n ;j++){
            comparisons++;
            yield snap ({line: 4, key: min,compare:[j], pointers: {i,j,min},msg: `Is a[${j}] = ${a[j]} smaller than ${a[min]}?` });
            if(a[j]<a[min]){
                min = j;
                yield snap ({line: 5, key: min, pointers: {i,j,min},msg: `Yes: the new minimum is ${a[min]}, at index ${min}. `});
            }
        }
        if(min!==i){
        [a[min],a[i]]=[a[i],a[min]];
        swaps++;
        }
        sorted.push(i);
        yield snap({line: 6, swap: [i,min], pointers: {i,min},msg: min !== i ? `Swap: ${a[i]} goes to index ${i}, its final place` : `${a[i]} is already in its final place`});

    }
    sorted.push(n-1);
    yield snap({line:-1, msg: `Done, the array is sorted`})
}
export default{
    id: 'selection',
    name: 'Selection Sort',
    category: 'sorting',
    input: 'array',
    renderer: 'bars',
    run: selectionSort,
    code: [
        'selectionSort(a,n)',
        '   for i = 0 to n - 2',
        '       min=i',
        '       for j= i + 1 to n - 1',
        '           if a[j] < a[min]',
        '               min=j',
        '       swap(a[i],a[min])',

    ],
    complexity: { Best: 'O(n²)', Average: 'O(n²)', Worst: 'O(n²)', Memory: 'O(1)', Stable: 'yes' },
};