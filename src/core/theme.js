const KEY = 'av-theme';

export function initTheme(button) {
  const root = document.documentElement;
  const saved = localStorage.getItem(KEY);
  if (saved) root.dataset.theme = saved;

  const isDark = () =>
    root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;

  const updateLabel = () => {
    button.textContent = isDark() ? 'Light theme' : 'Dark theme';
  };

  button.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    localStorage.setItem(KEY, root.dataset.theme);
    updateLabel();
  });
  updateLabel();
}