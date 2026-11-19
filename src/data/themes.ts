import mayaOrnament from '../assets/products/cutout-maya-pink.webp';
import psalmPlaque from '../assets/products/cutout-psalm23-plaque.webp';
import soLoved from '../assets/products/cutout-you-are-so-loved.webp';
import havenCross from '../assets/products/cutout-haven-cross.webp';
import greenFrame from '../assets/products/cutout-frame-green.webp';
import { CORDS, WOOD, type CordId, type WoodId } from './decor';

/**
 * The hero cycles through these. Each one also colours the rest of the page,
 * and is a filter in the collection (products.json "themes").
 */
export const THEME_IDS = ['christmas', 'scripture', 'love', 'home', 'custom'] as const;
export type ThemeId = (typeof THEME_IDS)[number];

interface ThemeSource {
  id: ThemeId;
  word: string;
  nav: string;
  kicker: string;
  line: string;
  cta: string;
  background: string;
  cord: CordId;
  wood: [WoodId, WoodId, WoodId];
  image: string;
  imageAlt: string;
  imageHeight: number;
  cordLength: number;
  top: string;
}

const SOURCES: ThemeSource[] = [
  {
    id: 'christmas', word: 'Maya', nav: 'Christmas', kicker: 'Christmas ornaments',
    line: 'Engraved wood and bright macramé for the tree, a window or a gift.', cta: 'See the ornaments',
    background: '#F4ABC8', cord: 'pink', wood: ['snow', 'ma', 'heart'],
    image: mayaOrnament.src, imageAlt: 'Nepali Maya ornament in pink macramé', imageHeight: 520, cordLength: 150, top: '0px'
  },
  {
    id: 'scripture', word: 'Psalm', nav: 'Scripture', kicker: 'Scripture in Nepali',
    line: 'Psalm 23 and 1 John 4:19, engraved in Nepali and Tibetan/Dolpo script.', cta: 'See the scripture pieces',
    background: '#D9B48A', cord: 'cream', wood: ['cross', 'ka', 'disc'],
    image: psalmPlaque.src, imageAlt: 'Nepali Psalm 23 multi-tier plaque', imageHeight: 620, cordLength: 30, top: '0px'
  },
  {
    id: 'love', word: 'Loved', nav: 'Someone you love', kicker: 'For someone you love',
    line: 'Words of love in wood, finished with hand-knotted cotton cord.', cta: 'See gifts of love',
    background: '#F3D07E', cord: 'gold', wood: ['heart', 'ya', 'heart'],
    image: soLoved.src, imageAlt: 'You Are So Loved macramé hanging', imageHeight: 620, cordLength: 30, top: '0px'
  },
  {
    id: 'home', word: 'Haven', nav: 'New home', kicker: 'A blessing for a new home',
    line: 'Wall hangings for a home, a prayer corner or a church.', cta: 'See pieces for the home',
    background: '#BED3AB', cord: 'cream', wood: ['cross', 'disc', 'heart'],
    image: havenCross.src, imageAlt: 'Haven macramé cross hanging', imageHeight: 620, cordLength: 30, top: '0px'
  },
  {
    id: 'custom', word: 'Yours', nav: 'Custom', kicker: 'Your own words',
    line: 'Send us a name, a verse or a message, and we’ll engrave it.', cta: 'See custom pieces',
    background: '#93C9DA', cord: 'sage', wood: ['ka', 'ma', 'ya'],
    image: greenFrame.src, imageAlt: 'Green macramé frame plaque, left plain for engraving', imageHeight: 400, cordLength: 0, top: '200px'
  }
];

export type FloatKind = 'tassel' | 'wood-0' | 'wood-1' | 'wood-2';

/** A theme with its picture URLs worked out, safe to hand to the browser as JSON. */
export interface Theme extends ThemeSource {
  /** Pictures for the loose pieces; "tassel" is also the tassel on every tag button. */
  floats: Record<FloatKind, string>;
}

export const THEMES: Theme[] = SOURCES.map((source) => ({
  ...source,
  floats: {
    tassel: CORDS[source.cord].tassel,
    'wood-0': WOOD[source.wood[0]],
    'wood-1': WOOD[source.wood[1]],
    'wood-2': WOOD[source.wood[2]]
  }
}));

export const FIRST_THEME = THEMES[0];
