export function bynarysearch(a,x){
    let l=0;
    let h=a.length-1;
    while(l<=h){
        const mid= Math.floor((l+h)/2);
        if(a[mid]=== x) return mid;
        if(a[mid]< x) l=mid+1;
        else h=mid-1;
    }
    return -1;
}
export function sieve(n){
    const isPrime= new Array(n+1).fill(true)
    isPrime[0]= false;
    isPrime[1]=false;
    for(let i = 2 ;i*i<=n; i++){
        if(!isPrime[i]) continue
        for(let j=i*i;j<=n;j+=i)
            isPrime[j]= false;
    }
    const primes=[]
    for (let i=2;i<=n;i++){
        if(isPrime[i]) primes.push(i);
    }
    return primes;
}

export function Lee(grid, start, target ){
    const rows= grid.length;
    const cols= grid[0].length;
    const dist= Array.from({ length: rows}, () => new Array(cols).fill(-1))
    const dirs= [[-1,0],[0,1],[1,0],[0,-1]]

    const queue=[start];
    dist[start[0]][start[1]]=0;

    while(queue.length>0){
       const [r,c]= queue.shift();
        if(r === target[0] && c === target[1]) return dist[r][c];
        for(const [dr,dc] of dirs ){
            const nr= r+dr;
            const nc= c+dc;
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if(grid[nr][nc]==='#' || dist[nr][nc] !==-1) continue;
            dist[nr][nc]=dist[r][c]+1;
            queue.push([nr,nc]);

        }
    }
    return -1;
}
export function* range(from, to){
    for(let i=from;i<to;i++)
        yield i;
}

console.log(bynarysearch([1,3,5,7,9,11],7));
console.log(bynarysearch([1, 3, 5, 7, 9, 11], 4));
console.log(sieve(30));

const maze = [
  '..#....',
  '.##.##.',
  '...#...',
  '.#...#.',
];
console.log(Lee(maze, [0, 0], [0, 6]));
console.log(Lee(['.#.', '.#.', '.#.'], [0, 0], [0, 2]));
console.log([...range(2, 6)]);
