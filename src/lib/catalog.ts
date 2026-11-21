import { parse } from 'yaml';
import productsData from '../data/products.json';
import pagesCmsConfig from '../../.pages.yml?raw';
import { CORDS, WOOD, isCordId, type CordId } from '../data/decor';
import { basename, productImage, productImageNames } from './product-images';
import { THEMES, isThemeId, themeIdOf } from './themes';
import { colorName, hexToRgb, rgbDistance } from './color';
import { productOrderLink } from './contact';
import { getPalette } from './palette';

/** One entry of src/data/products.json, as Pages CMS writes it. */
interface ProductEntry {
  title: string;
  kind?: string;
  description: string;
  price?: number | string;
  images: string[];
  cutout?: string;
  cord?: string;
  themes?: string[];
  swatches?: boolean;
  swatchColors?: string[];
}

export interface Product {
  id: string;
  title: string;
  kind: string;
  description: string;
  priceLabel: string;
  orderLink: string;
  image: { src: string; width: number; height: number };
  cord: CordId;
  cordLabel: string;
  /** Theme ids, e.g. "christmas". */
  themes: string[];
  /** Macramé colours a visitor can try; the first is the piece's own colour. */
  swatches: Swatch[];
}

export interface Swatch {
  hex: string;
  name: string;
}

function findImage(product: ProductEntry, imageRef: string) {
  const image = productImage(imageRef);
  if (!image) {
    throw new Error(
      `Product "${product.title}" refers to the image "${imageRef}", but that file is not in src/assets/products/.\n` +
      `Available images: ${productImageNames().join(', ')}`
    );
  }
  return image;
}

// Price may be a number (1200), a range ("750-1500"), or empty/0 when it has
// not been decided yet.
function formatPrice(price: ProductEntry['price']) {
  const text = String(price ?? '').trim();
  if (!text || Number(text) === 0) return 'Price on request';
  const amounts = text.split(/\s*[-–]\s*/).map(Number);
  if (amounts.some(Number.isNaN)) return `Rs. ${text}`;
  return `Rs. ${amounts.map((amount) => amount.toLocaleString('en-IN')).join('–')}`;
}

// Bright colours offered on top of each photo's own macramé colours.
const PRESET_COLORS = ['#22c55e', '#1e88e5', '#e53935', '#ec4899', '#8b5cf6'];

const farFrom = (hex: string, others: string[]) =>
  others.every((other) => rgbDistance(hexToRgb(hex), hexToRgb(other)) > 90);

const withPresets = (own: string[]) =>
  own.length ? [...own, ...PRESET_COLORS.filter((color) => farFrom(color, own))] : own;

// The piece's own cord colours: as typed in the CMS, or else picked from the
// original photo, which still shows the cord against its backdrop.
async function ownColors(entry: ProductEntry) {
  const typed = (entry.swatchColors ?? []).map((hex) => hex.trim().toLowerCase()).filter(Boolean);
  return typed.length ? typed : getPalette(`products/${basename(entry.images[0])}`);
}

// The cord colours and wood pieces staff can pick in Pages CMS must be the ones
// this code knows about, or a product or theme would silently lose its colour.
function checkCmsChoices() {
  const content = parse(pagesCmsConfig).content as { name: string; fields: { name: string; options: { values: { name: string }[] } }[] }[];
  const choicesOf = (collection: string, field: string): string[] =>
    content.find((c) => c.name === collection)!.fields.find((f) => f.name === field)!.options.values.map((v) => v.name);
  const same = (a: readonly string[], b: readonly string[]) => [...a].sort().join() === [...b].sort().join();
  for (const collection of ['products', 'themes']) {
    if (!same(choicesOf(collection, 'cord'), Object.keys(CORDS))) {
      throw new Error(`The cord colours for ${collection} in .pages.yml (${choicesOf(collection, 'cord')}) differ from src/data/decor.ts (${Object.keys(CORDS)}).`);
    }
  }
  if (!same(choicesOf('themes', 'wood'), Object.keys(WOOD))) {
    throw new Error(`The wood pieces in .pages.yml (${choicesOf('themes', 'wood')}) differ from src/data/decor.ts (${Object.keys(WOOD)}).`);
  }
}

// Pages CMS saves each theme as its file path ("src/data/themes/home.json").
function productThemes(entry: ProductEntry) {
  return (entry.themes ?? []).map((ref) => {
    const id = themeIdOf(ref);
    if (!isThemeId(id)) {
      throw new Error(
        `Product "${entry.title}" is in the theme "${id}", but there is no such theme any more.\n` +
        `Pick one of its current themes in Pages CMS: ${THEMES.map((theme) => theme.nav).join(', ')}.`
      );
    }
    return id;
  });
}

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Wide pieces (ornaments, frames) would look oversized at full height.
export const displayHeight = (image: { width: number; height: number }) =>
  Math.round(Math.min(600, 400 / (image.width / image.height)));

export async function loadCatalog(): Promise<Product[]> {
  checkCmsChoices();
  const entries = productsData as ProductEntry[];

  return Promise.all(
    entries.map(async (entry) => {
      const photo = findImage(entry, entry.images[0]);
      const image = entry.cutout ? findImage(entry, entry.cutout) : photo;
      const cord = isCordId(entry.cord) ? entry.cord : 'wood';
      const swatchColors = entry.swatches ? withPresets(await ownColors(entry)) : [];
      const swatches = swatchColors.map((hex) => ({ hex, name: colorName(hex) }));

      return {
        id: slug(entry.title),
        title: entry.title,
        kind: entry.kind?.trim() || 'Handmade',
        description: entry.description,
        priceLabel: formatPrice(entry.price),
        orderLink: productOrderLink(entry.title),
        image: { src: image.src, width: image.width, height: image.height },
        cord,
        cordLabel: cord === 'wood' ? CORDS.wood.label : `${CORDS[cord].label} cord`,
        themes: productThemes(entry),
        swatches
      };
    })
  );
}
