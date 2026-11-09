export function* mergeSort(input){
    const a=[...input];
    const n= a.length;
    let sorted=[];
    let comparisons=0;
    let writes=0;


    const snap =(extra) =>({
        array: [...a],
        sorted: [...sorted],
        stats: {Comparisons: comparisons, Writes: writes },
        ...extra,
    })

    yield snap({ line:0 , msg: `Divide the array equally until there is one element left. `});
    
    function* sort(left, right) {
        if (left >= right) {
            return;
        }
        const middle = Math.floor((left+right)/2);
        yield snap({ line: 2, range: [left,right], pointers: {left, middle, right}, msg: `Split a[${left}..${right}] into a[${left}..${middle}] and a[${middle + 1}..${right}]`,
        });

        yield* sort(left, middle);
        yield* sort(middle + 1, right); 
        yield* merge(left,middle,right);
    }

    function* merge(left, middle, right){
        const aux= a.slice(left,right+1);
        const auxRow= a.map((_,k)=>(k>=left && k<=right ? aux[k-left] : null));
        let i=left; 
        let j=middle+1;

        yield snap({ line: 6, range:[left,right], aux:auxRow, msg:`Merge: copy a[${left}..${right}] into aux (the row under the bars)` });
        
        for(let k=left; k<=right; k++){
            if(i>middle){
                a[k]= aux[j-left];
                j++;
            } else if(j>right){
                a[k] = aux[i-left];
                i++;
            } else {
                comparisons++;
                yield snap({
                line: 7,
                range: [left, right],
                aux: auxRow,
                auxCompare: [i, j],
                pointers: { k, i, j },
                msg: `Compare aux[${i}] = ${aux[i - left]} with aux[${j}] = ${aux[j - left]}`,
                });
                if(aux[i-left]<=aux[j-left]){
                    a[k] = aux[i-left];
                    i++;
                } else {
                    a[k]=aux[j-left];
                    j++;
                }
            }
            writes++;
            yield snap({ line: 7, range: [left, right], aux: auxRow, swap: [k], pointers: { k }, msg: `Write ${a[k]} into a[${k}]` });
        } 
    }
    yield* sort(0, n - 1);
    sorted = a.map((_, k) => k);
    yield snap({ line: -1, msg: 'Done: the array is sorted' });

}


export default {
    id: 'mergesort',
    name: 'Merge Sort',
    category: 'sorting',
    input: 'array',
    renderer: 'bars',
    run: mergeSort,
    code: [
    'mergeSort(a, lo, hi)',
    '  if lo ≥ hi: return',
    '  mid = ⌊(lo + hi) / 2⌋',
    '  mergeSort(a, lo, mid)',
    '  mergeSort(a, mid + 1, hi)',
    '  merge(a, lo, mid, hi)',
    'merge: copy a[lo..hi] into aux',
    '  write the smaller of aux[i], aux[j] into a[k]',
        
    ],
    complexity: { Best: 'O(n*log(n))', Average: 'O(n*log(n))', Worst: 'O(n*log(n))', Memory: 'O(n)', Stable: 'yes' },
}
