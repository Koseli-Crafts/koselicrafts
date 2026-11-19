import tasselPink from '../assets/decor/tassel-pink.webp';
import tasselTeal from '../assets/decor/tassel-teal.webp';
import tasselGold from '../assets/decor/tassel-gold.webp';
import tasselLavender from '../assets/decor/tassel-lavender.webp';
import tasselSage from '../assets/decor/tassel-sage.webp';
import tasselCream from '../assets/decor/tassel-cream.webp';
import woodCross from '../assets/decor/wood-cross.webp';
import woodDisc from '../assets/decor/wood-disc.webp';
import woodHeart from '../assets/decor/wood-heart.webp';
import woodKa from '../assets/decor/wood-ka.webp';
import woodMa from '../assets/decor/wood-ma.webp';
import woodSnow from '../assets/decor/wood-snow.webp';
import woodYa from '../assets/decor/wood-ya.webp';

/** Macramé cord colours. Each product names one in products.json ("cord"). */
export const CORDS = {
  pink: { label: 'Pink', tassel: tasselPink.src },
  teal: { label: 'Teal', tassel: tasselTeal.src },
  gold: { label: 'Gold', tassel: tasselGold.src },
  lavender: { label: 'Lavender', tassel: tasselLavender.src },
  sage: { label: 'Sage', tassel: tasselSage.src },
  cream: { label: 'Cream', tassel: tasselCream.src },
  wood: { label: 'Wood', tassel: tasselCream.src }
} as const;

export type CordId = keyof typeof CORDS;

export const isCordId = (value: unknown): value is CordId =>
  typeof value === 'string' && value in CORDS;

/** Small laser-cut wooden shapes that float around the page. */
export const WOOD = {
  cross: woodCross.src,
  disc: woodDisc.src,
  heart: woodHeart.src,
  ka: woodKa.src,
  ma: woodMa.src,
  snow: woodSnow.src,
  ya: woodYa.src
} as const;

export type WoodId = keyof typeof WOOD;
