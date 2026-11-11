import './styles/main.css';
import { ALGORITHMS, CATEGORIES, findAlgorithm, algorithmsIn } from './algorithms/registry.js';
import { mountVisualizer } from './core/visualizer.js';
import { initTheme } from './core/theme.js';
import { mountCompare } from './core/Compare.js';

const app = document.getElementById('app');
const nav = document.getElementById('nav');
let unmount = null; // funcția de curățenie a paginii curente

function renderNav(activeCategory) {
  nav.innerHTML = CATEGORIES.filter((c) => algorithmsIn(c.id).length > 0)
    .map((c) => {
      const first = algorithmsIn(c.id)[0];
      const current = c.id === activeCategory ? ' aria-current="page"' : '';
      return `<a href="#/${c.id}/${first.id}"${current}>${c.name}</a>`;
    })
    .join('') +
    `<a href="#/compare"${activeCategory === 'compare' ? ' aria-current="page"' : ''}>Compare</a>`;
}

function route() {
  const parts = location.hash.split('/');
  unmount?.();

  if (parts[1] === 'compare') {
    unmount = mountCompare(app, parts[2], parts[3], parts[4]);
    renderNav('compare');
    return;
  }

  const entry = findAlgorithm(parts[2]);
  if (!entry) {
    location.hash = '#/sorting/bubble';
    return;
  }
  unmount = mountVisualizer(app, entry);
  renderNav(entry.category);
}

initTheme(document.getElementById('themeToggle'));
window.addEventListener('hashchange', route);
route();