import type { FloatKind, Theme, ThemeId } from '../data/themes';

/** Sent by the hero's call-to-action so the collection shows that theme's pieces. */
export const SHOW_THEME_EVENT = 'koseli:show-theme';

export function readThemes(): Theme[] {
  const json = document.getElementById('koseli-themes')?.textContent;
  return json ? JSON.parse(json) : [];
}

export function showThemeInCollection(id: ThemeId) {
  document.dispatchEvent(new CustomEvent<ThemeId>(SHOW_THEME_EVENT, { detail: id }));
}

/** Recolours everything on the page that follows the current theme. */
export function paintTheme(theme: Theme) {
  document.documentElement.style.setProperty('--theme-bg', theme.background);
  document.querySelectorAll<HTMLImageElement>('img[data-theme-tassel]').forEach((img) => {
    img.src = theme.floats.tassel;
  });
  document.querySelectorAll<HTMLImageElement>('img[data-float]').forEach((img) => {
    img.src = theme.floats[img.dataset.float as FloatKind];
  });
}
