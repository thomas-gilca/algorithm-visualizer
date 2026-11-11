import { Player, SPEEDS } from './player.js';
import { ALGORITHMS, CATEGORIES } from '../algorithms/registry.js';
import { RENDERERS, INPUTS } from './visualizer.js';
 
// Pagina de comparație: doi algoritmi, aceleași date de intrare, un singur player.
// URL: #/compare/<categorie>/<algoritmA>/<algoritmB>
 
// Doar algoritmii care primesc date „pasive” au sens aici. BST și heap-ul
// au operații (insert, delete) care schimbă structura, deci rămân pe pagina lor.
const COMPARABLE_INPUTS = ['array', 'search', 'tree', 'graph', 'grid'];
 
// La contoarele astea, mai puțin înseamnă mai bine; le marcăm pe câștigător.
const LOWER_IS_BETTER = ['Steps', 'Comparisons', 'Swaps', 'Shifts', 'Writes', 'Expanded', 'Updates'];
 
const ICON_PLAY = 'M8 5l11 7-11 7z';
const ICON_PAUSE = 'M7 5h4v14H7zM13 5h4v14h-4z';
let savedSpeed = 3;
 
const comparable = (a) => COMPARABLE_INPUTS.includes(a.input);
 
// Doi algoritmi merg împreună dacă primesc același fel de date (și, la grafuri,
// dacă există măcar un graf pe care merg amândoi, de exemplu sortarea topologică cere un DAG).
function compatible(a, b) {
  if (a.input !== b.input) return false;
  if (a.input !== 'graph') return true;
  const { graphs } = mergeEntries(a, b);
  return !graphs || graphs.length > 0; // fără listă = merge pe orice graf
}
 
// Modulul de input primește un singur „entry”; îi dăm unul care le satisface pe amândouă.
function mergeEntries(a, b) {
  const all = (e) => e.graphs ?? null;
  const ga = all(a);
  const gb = all(b);
  return {
    ...a,
    needsSorted: a.needsSorted || b.needsSorted, // căutare binară + liniară: ambele pe tablou sortat
    usesTarget: a.usesTarget || b.usesTarget,
    usesStart: a.usesStart === false && b.usesStart === false ? false : undefined,
    graphs: ga && gb ? ga.filter((g) => gb.includes(g)) : (ga ?? gb ?? undefined),
  };
}
 
// Alege o pereche validă pentru categoria cerută, ținând cont de ce e în URL.
export function resolvePair(categoryId, idA, idB) {
  const inCategory = ALGORITHMS.filter((a) => comparable(a) && (!categoryId || a.category === categoryId));
  const pool = inCategory.length > 0 ? inCategory : ALGORITHMS.filter(comparable);
  const a = pool.find((x) => x.id === idA) ?? pool[0];
  const partners = pool.filter((x) => x !== a && compatible(a, x));
  const b = partners.find((x) => x.id === idB) ?? partners[0] ?? null;
  return { a, b };
}
 
export function mountCompare(app, categoryId, idA, idB) {
  const { a, b } = resolvePair(categoryId, idA, idB);
  if (!b) {
    app.innerHTML = '<p class="note">There is nothing to compare this algorithm with.</p>';
    return () => {};
  }
  const category = a.category;
  app.innerHTML = template(a, b);
 
  const $ = (selector) => app.querySelector(selector);
  const el = {
    category: $('#cmpCategory'),
    algoA: $('#algoA'),
    algoB: $('#algoB'),
    inputs: $('#inputs'),
    speed: $('#speed'),
    speedOut: $('#speedOut'),
    first: $('#first'),
    prev: $('#prev'),
    play: $('#play'),
    playIcon: $('#playIcon'),
    playLabel: $('#playLabel'),
    next: $('#next'),
    last: $('#last'),
    scrub: $('#scrub'),
    counter: $('#counter'),
    summary: $('#summary'),
  };
 
  // Fiecare jumătate are scena, mesajul și contoarele ei.
  const sides = [a, b].map((entry, k) => {
    const root = app.querySelectorAll('.racer')[k];
    const q = (s) => root.querySelector(s);
    return {
      entry,
      stage: q('.stage'),
      msg: q('.msg'),
      stats: q('.stats'),
      badge: q('.badge'),
      renderer: RENDERERS[entry.renderer](q('.stage')),
      steps: [],
    };
  });
  $('#legend').innerHTML = sides[0].renderer.legend
    .map((item) => `<li><span class="sw" style="background: ${item.color}"></span>${item.label}</li>`)
    .join('');
 
  // Un singur player pentru amândoi: pasul k arată pasul k din A și pasul k din B.
  // Cine termină primul rămâne pe ultimul lui pas până se termină și celălalt.
  const player = new Player(show);
  player.speed = savedSpeed;
  el.speed.value = savedSpeed;
  updateSpeedLabel();
 
  function show(pair, p) {
    sides.forEach((side, k) => {
      const step = pair[k];
      side.renderer.render(step);
      side.msg.textContent = step.msg ?? '';
      side.stats.innerHTML = Object.entries(step.stats ?? {})
        .map(([key, v]) => `<div class="stat"><span class="k">${key}</span><span class="v">${v}</span></div>`)
        .join('');
      const done = p.index >= side.steps.length - 1;
      side.badge.hidden = !done;
      side.badge.textContent = `Finished in ${side.steps.length - 1} steps`;
    });
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
 
  // Același input pentru amândoi. Rulăm fiecare algoritm o singură dată,
  // apoi lipim pașii în perechi.
  function run(input) {
    for (const side of sides) {
      side.renderer.build(input);
      side.steps = [...side.entry.run(input)];
    }
    const length = Math.max(...sides.map((s) => s.steps.length));
    const pairs = Array.from({ length }, (_, i) => sides.map((s) => s.steps[Math.min(i, s.steps.length - 1)]));
    renderSummary();
    player.load(pairs);
    return pairs;
  }
 
  // Tabelul de la final: pași și contoarele finale, unul lângă altul.
  function renderSummary() {
    const finals = sides.map((s) => ({ Steps: s.steps.length - 1, ...(s.steps.at(-1).stats ?? {}) }));
    const keys = [...new Set(finals.flatMap((f) => Object.keys(f)))];
    const rows = keys
      .map((key) => {
        const [x, y] = finals.map((f) => f[key]);
        const judge = LOWER_IS_BETTER.includes(key) && typeof x === 'number' && typeof y === 'number' && x !== y;
        const cell = (v, other) => {
          const win = judge && v < other;
          return `<td${win ? ' class="win"' : ''}>${v ?? '—'}</td>`;
        };
        return `<tr><th scope="row">${key}</th>${cell(x, y)}${cell(y, x)}</tr>`;
      })
      .join('');
    el.summary.innerHTML = `
      <thead><tr><th></th><th scope="col">${a.name}</th><th scope="col">${b.name}</th></tr></thead>
      <tbody>${rows}</tbody>`;
  }
 
  // Grid-ul se desenează cu mouse-ul pe scena din stânga.
  INPUTS[a.input](el.inputs, run, mergeEntries(a, b), sides[0].stage);
 
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
 
  const go = (cat, x, y) => {
    location.hash = `#/compare/${cat}/${x}/${y}`;
  };
  el.category.addEventListener('change', () => go(el.category.value, '', ''));
  el.algoA.addEventListener('change', () => go(category, el.algoA.value, b.id));
  el.algoB.addEventListener('change', () => go(category, a.id, el.algoB.value));
 
  function onKey(e) {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    if (e.key === ' ') {
      if (tag === 'BUTTON') return;
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
 
function template(a, b) {
  const categories = CATEGORIES.filter((c) => ALGORITHMS.some((x) => x.category === c.id && comparable(x)))
    .map((c) => `<option value="${c.id}"${c.id === a.category ? ' selected' : ''}>${c.name}</option>`)
    .join('');
  const pool = ALGORITHMS.filter((x) => x.category === a.category && comparable(x));
  const optionsA = pool
    .filter((x) => pool.some((y) => y !== x && compatible(x, y)))
    .map((x) => `<option value="${x.id}"${x === a ? ' selected' : ''}>${x.name}</option>`)
    .join('');
  const optionsB = pool
    .filter((x) => x !== a && compatible(a, x))
    .map((x) => `<option value="${x.id}"${x === b ? ' selected' : ''}>${x.name}</option>`)
    .join('');
  const racer = (entry, letter) => `
    <section class="stage-card racer" aria-label="${entry.name}">
      <header class="racer-head">
        <span class="tag">${letter}</span>
        <h2><a href="#/${entry.category}/${entry.id}">${entry.name}</a></h2>
        <span class="badge" hidden></span>
      </header>
      <div class="stage" role="img"></div>
      <p class="msg" aria-live="polite"></p>
      <div class="stats racer-stats"></div>
    </section>`;
 
  return `
    <section class="toolbar" aria-label="Settings">
      <label class="field" for="cmpCategory">Category <select id="cmpCategory">${categories}</select></label>
      <label class="field" for="algoA">Algorithm A <select id="algoA">${optionsA}</select></label>
      <label class="field" for="algoB">Algorithm B <select id="algoB">${optionsB}</select></label>
      <div class="inputs" id="inputs"></div>
      <label class="field" for="speed"><span>Speed <output id="speedOut"></output></span>
        <input type="range" id="speed" min="0" max="${SPEEDS.length - 1}">
      </label>
    </section>
    <div class="race">
      ${racer(a, 'A')}
      ${racer(b, 'B')}
    </div>
    <section class="stage-card">
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
    <section class="panel">
      <h2>Result</h2>
      <div class="table-wrap"><table class="summary" id="summary"></table></div>
      <p class="note">A step is one frame of the animation, not one unit of work, so compare the counters too:
      comparisons and swaps are what the algorithm actually pays for.</p>
    </section>`;
}