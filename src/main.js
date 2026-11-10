import './styles/main.css';
import { ALGORITHMS, CATEGORIES, findAlgorithm, algorithmsIn } from './algorithms/registry.js';
import { mountVisualizer } from './core/visualizer.js';
import { initTheme } from './core/theme.js';

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
    .join('');
}

// '#/sorting/quick' -> ['#', 'sorting', 'quick']
function route() {
  const algorithmId = location.hash.split('/')[2];
  const entry = findAlgorithm(algorithmId);
  if (!entry) {
    const first = ALGORITHMS[0];
    location.hash = `#/${first.category}/${first.id}`; // declanșează din nou route()
    return;
  }
  unmount?.();
  unmount = mountVisualizer(app, entry);
  renderNav(entry.category);
}

initTheme(document.getElementById('themeToggle'));
window.addEventListener('hashchange', route);
route();