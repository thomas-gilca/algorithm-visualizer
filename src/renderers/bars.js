export const barsLegend = [
  { label: 'Comparing', color: 'var(--compare)' },
  { label: 'Swapping or writing', color: 'var(--swap)' },
  { label: 'Key, pivot or minimum', color: 'var(--key)' },
  { label: 'Sorted so far', color: 'var(--partial)' },
  { label: 'Final place or found', color: 'var(--done)' },
];
export function createBarsRenderer(stage) {
  let cols = [];
  let max = 1;

  function build(input) {
    // sortările primesc un tablou, căutările primesc { array, target }
    const array = Array.isArray(input) ? input : input.array;
    max = Math.max(1, ...array);
    stage.className = array.length > 24 ? 'stage bars dense' : 'stage bars';
    stage.replaceChildren();
    cols = array.map((_, i) => {
      const col = document.createElement('div');
      col.className = 'col';
      col.innerHTML = `<span class="val"></span><div class="bar"></div><span class="idx">${i}</span><span class="ptr"></span><span class="aux"></span>`;
      stage.append(col);
      const [val, bar, , ptr, aux] = col.children;
      return { col, val, bar, ptr, aux };
    });
  }

  function render(step) {
    const pointers = step.pointers ?? {};
    step.array.forEach((value, i) => {
      const c = cols[i];
      c.bar.style.setProperty('--h', value / max);
      c.bar.dataset.state = stateOf(step, i);
      c.col.classList.toggle('dim', isOutside(step.range, i));
      c.val.textContent = value;
      c.ptr.textContent = Object.keys(pointers)
        .filter((name) => pointers[name] === i)
        .join('\n');
      c.aux.textContent = step.aux?.[i] ?? '';
      c.aux.classList.toggle('hot', step.auxCompare?.includes(i) ?? false);
    });
    stage.setAttribute('aria-label', `Array: ${step.array.join(', ')}`);
  }

  return { build, render, legend: barsLegend };
}

function stateOf(step, i) {
  if (step.swap?.includes(i)) return 'swap';
  if (step.compare?.includes(i)) return 'compare';
  if (step.found === i) return 'done';
  if (step.key === i || step.pivot === i) return 'key';
  if (step.sorted?.includes(i)) return 'done';
  if (step.partial?.includes(i)) return 'partial';
  return '';
}

function isOutside(range, i) {
  return range ? i < range[0] || i > range[1] : false;
}