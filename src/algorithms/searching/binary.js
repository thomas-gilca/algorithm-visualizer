export function* binarySearch({array, target}){
    let lo=0;
    let hi = array.length-1;
    let comparisons=0;
    const snap=(extra)=>({array, stats:{Comparisons: comparisons}, vars:{Target: target, lo, hi},...extra,});
    yield snap({ line:1, range:[lo,hi],pointers:{lo,hi}, msg:`Look for ${target}, by comparing the middle value to ${target}.`});

    while(lo<=hi){
        const mid=Math.floor((lo+hi)/2);
        comparisons++;

        yield snap({line:3, range:[lo,hi], compare:[mid],pointers:{lo,mid,hi},msg:`mid=[(${lo}+${hi})/2]=${mid}, a[mid]=${array[mid]}`});
        if(array[mid]===target){
            yield snap({line:4,found:mid,range:[lo,hi],pointers:{mid},msg:`Found ${target} at index ${mid}`});
            return;
        }
        if(array[mid]<target){
            lo=mid+1;
            yield snap({line:5, range:[lo,hi], pointers:{lo,hi},msg:`${array[mid]}<${target}: drop the left half, lo=${lo}`});
        } else{
            hi=mid-1;
            yield snap({line:6, range:[lo,hi], pointers:{lo,hi},msg:`${array[mid]}>${target}: drop the right half, hi=${hi}`});
        }
    }
    yield snap({ line: 7, range: [lo, hi], msg: `lo > hi: ${target} is not in the array` });
}

export default{
    id: 'binary',
    name: 'Binary Search',
    category: 'searching',
    input:'search',
    renderer: 'bars',
    needsSorted:true,
    run: binarySearch,
    code:[
        'binarySearch(a,x)',
        'lo=0; hi=n-1',
        'while(lo<=hi)',
        '   mid=[(lo+hi)/2]',
        '   if a[mid] = x: return mid',
        '   if a[mid] < x: lo=mid+1',
        '   else: hi=mid-1',
        'return -1 //not found',
    ],
    complexity:{Best:'O(1)', Average:'O(log n)', Worst:'O(log n)', Memory:'O(1)', 'Needs sorted input': 'yes'},
};