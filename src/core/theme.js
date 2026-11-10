const KEY = 'av-theme';

// Tema e un atribut pe <html>: data-theme="dark" sau "light".
// La schimbare, noua temă „curge” ca o pată de cerneală din butonul apăsat.
export function initTheme(button) {
  const root = document.documentElement;
  const saved = localStorage.getItem(KEY);
  if (saved) root.dataset.theme = saved;

  // fără alegere salvată, urmăm setarea sistemului
  const isDark = () =>
    root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;

  const updateLabel = () => {
    button.textContent = isDark() ? 'Light theme' : 'Dark theme';
  };

  const switchTheme = () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    localStorage.setItem(KEY, root.dataset.theme);
    updateLabel();
  };

  button.addEventListener('click', () => {
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // browsere vechi sau cine a cerut „mai puțină mișcare”: schimbare directă
    if (!document.startViewTransition || reduceMotion) {
      switchTheme();
      return;
    }
    inkTransition(button, switchTheme);
  });
  updateLabel();
  // pregătim pata din timp, ca primul click să nu aștepte după desen
  (window.requestIdleCallback ?? setTimeout)(() => (ink ??= makeInkBlot()));
}

// ---------- tranziția cu cerneală ----------

// Desenăm o singură dată, pe un canvas, o pată de cerneală cu margini
// zdrențuite. Apoi o folosim ca mască și doar o mărim, iar mărirea unei
// imagini e ieftină pentru placa video, deci animația rămâne fluidă.
let ink = null;

function makeInkBlot(size = 1024) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const mid = size / 2;
  const R = size * 0.3; // raza „corpului” petei
  const rand = (a, b) => a + Math.random() * (b - a);
  g.fillStyle = '#000';

  // 1. corpul: un cerc deformat de câteva unde sinusoidale
  const waves = Array.from({ length: 7 }, (_, k) => ({ f: k + 3, a: rand(0.005, 0.02), p: rand(0, 7) }));
  const wobble = waves.reduce((s, w) => s + w.a, 0); // cât de mult poate intra spre centru
  g.beginPath();
  for (let i = 0; i <= 360; i++) {
    const t = (i / 360) * Math.PI * 2;
    const r = R * (1 + waves.reduce((s, w) => s + w.a * Math.sin(w.f * t + w.p), 0));
    const x = mid + r * Math.cos(t);
    const y = mid + r * Math.sin(t);
    i === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
  }
  g.fill();

  // 2. firele de cerneală care ies din pată: linii care șerpuiesc și se subțiază
  g.lineCap = 'round';
  for (let k = 0; k < 160; k++) {
    let t = rand(0, Math.PI * 2);
    let r = R * 0.9;
    let width = rand(R * 0.03, R * 0.11);
    let bend = rand(-0.02, 0.02);
    const steps = Math.floor(rand(6, 26));
    for (let s = 0; s < steps; s++) {
      const x1 = mid + r * Math.cos(t);
      const y1 = mid + r * Math.sin(t);
      r += R * 0.018;
      bend += rand(-0.012, 0.012); // direcția se schimbă puțin la fiecare pas
      t += bend;
      g.lineWidth = width;
      g.beginPath();
      g.moveTo(x1, y1);
      g.lineTo(mid + r * Math.cos(t), mid + r * Math.sin(t));
      g.stroke();
      width *= 0.84;
    }
  }

  // 3. stropi mici în jur
  for (let k = 0; k < 40; k++) {
    const t = rand(0, Math.PI * 2);
    const r = R * rand(1.05, 1.5);
    g.beginPath();
    g.arc(mid + r * Math.cos(t), mid + r * Math.sin(t), rand(1, R * 0.018), 0, Math.PI * 2);
    g.fill();
  }

  // marginile le înmuiem o singură dată, la final (blur pe fiecare linie ar fi lent)
  const soft = document.createElement('canvas');
  soft.width = soft.height = size;
  const sg = soft.getContext('2d');
  sg.filter = 'blur(2px)';
  sg.drawImage(c, 0, 0);

  // cât din mărimea imaginii acoperă sigur corpul petei (raza minimă)
  return { url: soft.toDataURL(), cover: (R * (1 - wobble)) / size };
}

function inkTransition(button, switchTheme) {
  ink ??= makeInkBlot();
  const root = document.documentElement;

  // pata pornește din mijlocul butonului
  const b = button.getBoundingClientRect();
  const x = b.left + b.width / 2;
  const y = b.top + b.height / 2;
  // distanța până la cel mai îndepărtat colț al ecranului
  const far = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const end = far / ink.cover; // mărimea finală a imaginii, ca pata să acopere tot

  root.style.setProperty('--ink-mask', `url(${ink.url})`);
  const transition = document.startViewTransition(switchTheme);

  transition.ready.then(() => {
    // mărim masca din 0 până la `end`, mereu centrată în (x, y)
    root.animate(
      {
        maskSize: ['0px 0px', `${end}px ${end}px`],
        maskPosition: [`${x}px ${y}px`, `${x - end / 2}px ${y - end / 2}px`],
      },
      {
        duration: 1100,
        easing: 'cubic-bezier(0.6, 0, 0.25, 1)', // pornește încet, curge, apoi se așază
        pseudoElement: '::view-transition-new(root)',
      },
    );
  });
}