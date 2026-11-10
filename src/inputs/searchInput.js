import { randomArray, randomInt } from '../utils/random.js';

let shared = null;

export function mountSearchInput(container, run, entry) {
  // căutarea binară merge doar pe un tablou sortat
  const prepare = (array) => (entry.needsSorted ? [...array].sort((x, y) => x - y) : array);
  shared ??= randomArray(12);
  let array = prepare(shared);

  container.innerHTML = `
    <label class="field" for="size"><span>Array size <output id="sizeOut">${array.length}</output></span>
      <input type="range" id="size" min="5" max="40" value="${array.length}">
    </label>
    <button class="btn" id="shuffle" type="button">New random array</button>
    <form class="custom" id="targetForm">
      <label class="field" for="target">Value to find
        <input class="text num" id="target" type="number" min="1" max="99" required>
      </label>
      <button class="btn" type="submit">Search</button>
    </form>`;
  const $ = (selector) => container.querySelector(selector);

  // prima căutare pe un tablou nou caută o valoare care chiar există
  const pickTarget = () => array[randomInt(0, array.length - 1)];

  function search() {
    run({ array, target: Number($('#target').value) });
  }

  function newArray(n) {
    shared = randomArray(n);
    array = prepare(shared);
    $('#sizeOut').textContent = n;
    $('#target').value = pickTarget();
    search();
  }

  $('#size').addEventListener('input', () => newArray(Number($('#size').value)));
  $('#shuffle').addEventListener('click', () => newArray(Number($('#size').value)));
  $('#targetForm').addEventListener('submit', (e) => {
    e.preventDefault();
    search();
  });

  $('#target').value = pickTarget();
  search();
}
