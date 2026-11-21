import { CORDS, WOOD, isCordId, type CordId, type WoodId } from '../data/decor';
import { basename, productImage, productImageNames } from './product-images';

/**
 * One file in src/data/themes/, as Pages CMS writes it. The hero cycles through
 * the themes, each one colours the rest of the page, and each is a filter in
 * the collection. The file name (without .json) is the theme's id.
 */
interface ThemeEntry {
  order?: number;
  nav: string;
  word: string;
  kicker: string;
  line: string;
  cta: string;
  background: string;
  cord: string;
  wood?: string[];
  image: string;
  imageAlt?: string;
  imageHeight?: number;
  cordLength?: number;
  top?: number;
}

export type FloatKind = 'tassel' | 'wood-0' | 'wood-1' | 'wood-2';

/** A theme ready for the page, safe to hand to the browser as JSON. */
export interface Theme {
  id: string;
  nav: string;
  word: string;
  kicker: string;
  line: string;
  cta: string;
  background: string;
  cord: CordId;
  image: string;
  imageAlt: string;
  imageHeight: number;
  cordLength: number;
  top: string;
  /** Pictures for the loose pieces; "tassel" is also the tassel on every tag button. */
  floats: Record<FloatKind, string>;
}

const DEFAULT_WOOD: WoodId[] = ['disc', 'heart', 'ka'];
const REQUIRED_TEXT = ['nav', 'word', 'kicker', 'line', 'cta'] as const;

const themeFiles = import.meta.glob<ThemeEntry>('../data/themes/*.json', { eager: true, import: 'default' });

/** "src/data/themes/home.json", "/src/data/themes/home.json" or "home" all mean the theme "home". */
export const themeIdOf = (ref: string) => basename(ref).replace(/\.json$/, '');

const isWoodId = (value: string): value is WoodId => value in WOOD;

function toTheme(id: string, entry: ThemeEntry): Theme {
  const where = `The theme "${entry.nav || id}" (src/data/themes/${id}.json)`;
  for (const field of REQUIRED_TEXT) {
    if (!String(entry[field] ?? '').trim()) throw new Error(`${where} is missing "${field}". Fill it in in Pages CMS.`);
  }
  if (!/^#[0-9a-f]{6}$/i.test(entry.background?.trim() ?? '')) {
    throw new Error(`${where} has the background colour "${entry.background}". Write it as a colour code like #F4ABC8.`);
  }
  if (!isCordId(entry.cord)) {
    throw new Error(`${where} has the cord colour "${entry.cord}". Pick one of: ${Object.keys(CORDS).join(', ')}.`);
  }
  const image = productImage(entry.image ?? '');
  if (!image) {
    throw new Error(
      `${where} uses the photo "${entry.image}", but that file is not in src/assets/products/.\n` +
      `Available images: ${productImageNames().join(', ')}`
    );
  }
  const unknownWood = (entry.wood ?? []).filter((piece) => !isWoodId(piece));
  if (unknownWood.length) {
    throw new Error(`${where} has unknown wood pieces: ${unknownWood.join(', ')}. Pick from: ${Object.keys(WOOD).join(', ')}.`);
  }
  const picked = (entry.wood ?? []).filter(isWoodId);
  const wood = [0, 1, 2].map((i) => (picked.length ? picked[i % picked.length] : DEFAULT_WOOD[i]));

  return {
    id,
    nav: entry.nav.trim(),
    word: entry.word.trim(),
    kicker: entry.kicker.trim(),
    line: entry.line.trim(),
    cta: entry.cta.trim(),
    background: entry.background.trim(),
    cord: entry.cord,
    image: image.src,
    imageAlt: entry.imageAlt?.trim() || entry.word.trim(),
    imageHeight: entry.imageHeight || 620,
    cordLength: entry.cordLength ?? 30,
    top: `${entry.top ?? 0}px`,
    floats: {
      tassel: CORDS[entry.cord].tassel,
      'wood-0': WOOD[wood[0]],
      'wood-1': WOOD[wood[1]],
      'wood-2': WOOD[wood[2]]
    }
  };
}

const entries = Object.entries(themeFiles)
  .map(([path, entry]) => ({ id: themeIdOf(path), entry }))
  .sort((a, b) => (a.entry.order ?? Infinity) - (b.entry.order ?? Infinity) || a.entry.nav.localeCompare(b.entry.nav));

if (entries.length === 0) {
  throw new Error('There are no themes in src/data/themes/. Add at least one theme in Pages CMS.');
}

export const THEMES: Theme[] = entries.map(({ id, entry }) => toTheme(id, entry));

export const FIRST_THEME = THEMES[0];

export const isThemeId = (id: string) => THEMES.some((theme) => theme.id === id);
