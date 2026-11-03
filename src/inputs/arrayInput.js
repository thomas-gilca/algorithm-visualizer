import { randomArray } from '../utils/random.js';
import { parseArray } from '../utils/parseArray.js';

let shared = null;

export function mountArrayInput(container, run) {
  shared ??= randomArray(12);
  container.innerHTML = `
    <label class="field" for="size"><span>Array size <output id="sizeOut">${shared.length}</output></span>
      <input type="range" id="size" min="5" max="40" value="${shared.length}">
    </label>
    <button class="btn" id="shuffle" type="button">New random array</button>
    <form class="custom" id="customForm">
      <label class="field" for="custom">Your array
        <input class="text" id="custom" type="text" placeholder="5, 3, 8, 1" autocomplete="off">
      </label>
      <button class="btn" type="submit">Use</button>
    </form>
    <p class="error" id="error" role="alert" hidden></p>`;
  const $ = (selector) => container.querySelector(selector);

  function use(array) {
    shared = array;
    $('#sizeOut').textContent = array.length;
    run(array);
  }

  $('#size').addEventListener('input', () => use(randomArray(Number($('#size').value))));
  $('#shuffle').addEventListener('click', () => use(randomArray(Number($('#size').value))));

  $('#customForm').addEventListener('submit', (e) => {
    e.preventDefault(); // altfel formularul ar reîncărca pagina
    try {
      use(parseArray($('#custom').value));
      $('#error').hidden = true;
    } catch (err) {
      $('#error').textContent = err.message;
      $('#error').hidden = false;
    }
  });

  run(shared);
}