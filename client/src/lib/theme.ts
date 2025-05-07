export type Theme = 'light' | 'dark' | 'luxury';

export const setTheme = (theme: Theme): void => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

export const getTheme = (): Theme => {
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  return savedTheme || 'light';
};

export const applyTheme = (): void => {
  const theme = getTheme();
  setTheme(theme);
};
