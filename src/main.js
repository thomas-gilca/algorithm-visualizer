import './styles/main.css';
import { ALGORITHMS, findAlgorithm } from './algorithms/registry.js';
import { mountVisualizer } from './core/visualizer.js';

const app = document.getElementById('app');
let unmount = null; // funcția de curățenie a paginii curente

// '#/sorting/bubble' -> ['#', 'sorting', 'bubble']
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
}

window.addEventListener('hashchange', route);
route();