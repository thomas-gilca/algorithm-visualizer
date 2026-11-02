export function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function randomArray(n, min = 5, max = 99) {
  return Array.from({ length: n }, () => randomInt(min, max));
}

export function randomDistinct(n, min = 1, max = 99) {
  const values = new Set();
  while (values.size < n) values.add(randomInt(min, max));
  return [...values];
}