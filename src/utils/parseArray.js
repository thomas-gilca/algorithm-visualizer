export function parseArray(text, { min = 1, max = 99, maxLength = 40 } = {}) {
  const parts = text.split(/[\s,;]+/).filter((p) => p !== '');
  if (parts.length < 2) {
    throw new Error('Type at least 2 numbers, separated by commas or spaces.');
  }
  if (parts.length > maxLength) {
    throw new Error(`Use at most ${maxLength} numbers.`);
  }
  return parts.map((p) => {
    const x = Number(p);
    if (!Number.isInteger(x) || x < min || x > max) {
      throw new Error(`"${p}" is not a whole number between ${min} and ${max}.`);
    }
    return x;
  });
}