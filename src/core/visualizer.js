import { Player, SPEEDS } from './player.js';
import { ALGORITHMS } from '../algorithms/registry.js';
import { escapeHtml } from '../utils/html.js';
import { createBarsRenderer } from '../renderers/bars.js';
import { mountArrayInput } from '../inputs/arrayInput.js';
import { mountSearchInput } from '../inputs/searchInput.js';
// Fiecare algoritm spune în registru ce renderer și ce fel de date de intrare folosește.
const RENDERERS = {
  bars: createBarsRenderer,
};
const INPUTS = {
  array: mountArrayInput,
  search: mountSearchInput,
};

const ICON_PLAY = 'M8 5l11 7-11 7z';
const ICON_PAUSE = 'M7 5h4v14H7zM13 5h4v14h-4z';

let savedSpeed = 3; // viteza rămâne aceeași când treci la alt algoritm

// Construiește pagina unui algoritm în `app` și întoarce o funcție de curățenie.
export function mountVisualizer(app, entry) {
  const siblings = ALGORITHMS.filter((a) => a.category === entry.category);
  app.innerHTML = template(entry, siblings);

  const $ = (selector) => app.querySelector(selector);
  const el = {
    algo: $('#algo'),
    inputs: $('#inputs'),
    speed: $('#speed'),
    speedOut: $('#speedOut'),
    stage: $('#stage'),
    msg: $('#msg'),
    first: $('#first'),
    prev: $('#prev'),
    play: $('#play'),
    playIcon: $('#playIcon'),
    playLabel: $('#playLabel'),
    next: $('#next'),
    last: $('#last'),
    scrub: $('#scrub'),
    counter: $('#counter'),
    codeLines: [...app.querySelectorAll('#code li')],
    stats: $('#stats'),
    vars: $('#vars'),
    legend: $('#legend'),
  };

  const renderer = RENDERERS[entry.renderer](el.stage);
  el.legend.innerHTML = renderer.legend
    .map((item) => `<li><span class="sw" style="background: ${item.color}"></span>${item.label}</li>`)
    .join('');

  const player = new Player(show);
  player.speed = savedSpeed;
  el.speed.value = savedSpeed;
  updateSpeedLabel();

  // Desenează pasul curent: renderer-ul se ocupă de scenă, restul de panouri.
  function show(step, p) {
    renderer.render(step);
    el.codeLines.forEach((li, n) => li.classList.toggle('active', n === step.line));
    el.msg.textContent = step.msg ?? '';
    el.stats.innerHTML = Object.entries(step.stats ?? {})
      .map(([k, v]) => `<div class="stat"><span class="k">${k}</span><span class="v">${v}</span></div>`)
      .join('');
    el.vars.innerHTML = Object.entries(step.vars ?? {})
      .map(([k, v]) => `<dt>${k}</dt><dd>${escapeHtml(v)}</dd>`)
      .join('');
    el.scrub.max = p.last;
    el.scrub.value = p.index;
    el.counter.textContent = `Step ${p.index} / ${p.last}`;
    el.first.disabled = el.prev.disabled = p.index === 0;
    el.next.disabled = el.last.disabled = p.index === p.last;
    el.playLabel.textContent = p.playing ? 'Pause' : 'Play';
    el.playIcon.setAttribute('d', p.playing ? ICON_PAUSE : ICON_PLAY);
  }

  function updateSpeedLabel() {
    const s = SPEEDS[el.speed.value];
    el.speedOut.textContent = `${s} step${s === 1 ? '' : 's'}/s`;
  }

  function run(input) {
    renderer.build(input);
    const steps = [...entry.run(input)];
    player.load(steps);
    return steps;
  }
  INPUTS[entry.input](el.inputs, run, entry, el.stage);

  const stepTo = (k) => {
    player.stop();
    player.goTo(k);
  };
  el.play.addEventListener('click', () => player.toggle());
  el.first.addEventListener('click', () => stepTo(0));
  el.prev.addEventListener('click', () => stepTo(player.index - 1));
  el.next.addEventListener('click', () => stepTo(player.index + 1));
  el.last.addEventListener('click', () => stepTo(player.last));
  el.scrub.addEventListener('input', () => stepTo(Number(el.scrub.value)));
  el.speed.addEventListener('input', () => {
    savedSpeed = Number(el.speed.value);
    player.speed = savedSpeed;
    updateSpeedLabel();
  });
  el.algo.addEventListener('change', () => {
    location.hash = `#/${entry.category}/${el.algo.value}`;
  });

  function onKey(e) {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return; // nu furăm tastele câmpurilor
    if (e.key === ' ') {
      if (tag === 'BUTTON') return; // Space pe un buton îl apasă deja
      e.preventDefault();
      player.toggle();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepTo(player.index + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepTo(player.index - 1);
    }
  }
  document.addEventListener('keydown', onKey);

  return () => {
    player.stop();
    document.removeEventListener('keydown', onKey);
  };
}

const icon = (d) => `<svg class="icon stroke" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;

function template(entry, siblings) {
  const options = siblings
    .map((a) => `<option value="${a.id}"${a.id === entry.id ? ' selected' : ''}>${a.name}</option>`)
    .join('');
  const code = entry.code.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
  const complexity = Object.entries(entry.complexity)
    .map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`)
    .join('');
  return `
    <section class="toolbar" aria-label="Settings">
      <label class="field" for="algo">Algorithm
        <select id="algo">${options}</select>
      </label>
      <div class="inputs" id="inputs"></div>
      <label class="field" for="speed"><span>Speed <output id="speedOut"></output></span>
        <input type="range" id="speed" min="0" max="${SPEEDS.length - 1}">
      </label>
    </section>
    <div class="layout">
      <section class="stage-card" aria-label="Visualization">
        <div class="stage" id="stage" role="img"></div>
        <p class="msg" id="msg" aria-live="polite"></p>
        <div class="transport">
          <div class="buttons">
            <button id="first" class="icon-btn" type="button" aria-label="First step">${icon('M6 5v14M18 6l-7 6 7 6')}</button>
            <button id="prev" class="icon-btn" type="button" aria-label="Previous step">${icon('M15 5l-7 7 7 7')}</button>
            <button id="play" class="play" type="button">
              <svg class="icon solid" viewBox="0 0 24 24" aria-hidden="true"><path id="playIcon" d="${ICON_PLAY}"/></svg>
              <span id="playLabel">Play</span>
            </button>
            <button id="next" class="icon-btn" type="button" aria-label="Next step">${icon('M9 5l7 7-7 7')}</button>
            <button id="last" class="icon-btn" type="button" aria-label="Last step">${icon('M18 5v14M6 6l7 6-7 6')}</button>
          </div>
          <input type="range" id="scrub" min="0" max="0" value="0" aria-label="Step">
          <span class="counter" id="counter"></span>
        </div>
        <ul class="legend" id="legend" aria-label="Legend"></ul>
      </section>
      <aside class="side">
        <section class="panel">
          <h2>Pseudocode</h2>
          <div class="code-wrap"><ol class="code" id="code">${code}</ol></div>
        </section>
        <section class="panel">
          <h2>State</h2>
          <div class="stats" id="stats"></div>
          <dl class="vars" id="vars"></dl>
          <dl class="cx">${complexity}</dl>
        </section>
      </aside>
    </div>`;
}
