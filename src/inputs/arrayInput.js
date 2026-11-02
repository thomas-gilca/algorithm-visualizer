import { randomArray } from '../utils/random.js';

let shared = null;

export function mountArrayInput(container, run) {
  shared ??= randomArray(12);
  container.innerHTML = `
    <label class="field" for="size"><span>Array size <output id="sizeOut">${shared.length}</output></span>
      <input type="range" id="size" min="5" max="40" value="${shared.length}">
    </label>
    <button class="btn" id="shuffle" type="button">New random array</button>`;
  const $ = (selector) => container.querySelector(selector);

  function use(array) {
    shared = array;
    $('#sizeOut').textContent = array.length;
    run(array);
  }

  $('#size').addEventListener('input', () => use(randomArray(Number($('#size').value))));
  $('#shuffle').addEventListener('click', () => use(randomArray(Number($('#size').value))));

  run(shared);
}