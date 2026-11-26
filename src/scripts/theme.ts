import type { FloatKind, Theme } from '../lib/themes';

/** Sent by the hero's call-to-action so the collection shows that theme's pieces. */
export const SHOW_THEME_EVENT = 'koseli:show-theme';

export function readThemes(): Theme[] {
  const json = document.getElementById('koseli-themes')?.textContent;
  return json ? JSON.parse(json) : [];
}

export function showThemeInCollection(id: string) {
  document.dispatchEvent(new CustomEvent<string>(SHOW_THEME_EVENT, { detail: id }));
}

/** Recolours everything on the page that follows the current theme. */
export function paintTheme(theme: Theme) {
  document.documentElement.style.setProperty('--theme-bg', theme.background);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.background);
  document.querySelectorAll<HTMLImageElement>('img[data-theme-tassel]').forEach((img) => {
    img.src = theme.floats.tassel;
  });
  document.querySelectorAll<HTMLImageElement>('img[data-float]').forEach((img) => {
    img.src = theme.floats[img.dataset.float as FloatKind];
  });
}
