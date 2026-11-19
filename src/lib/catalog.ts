import { parse } from 'yaml';
import productsData from '../data/products.json';
import pagesCmsConfig from '../../.pages.yml?raw';
import { CORDS, isCordId, type CordId } from '../data/decor';
import { THEME_IDS, type ThemeId } from '../data/themes';
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
  themes: ThemeId[];
  /** Macramé colours a visitor can try; the first is the piece's own colour. */
  swatches: Swatch[];
}

export interface Swatch {
  hex: string;
  name: string;
}

// Every file in src/assets/products/ is picked up automatically. Entries may be a
// bare filename ("clock.jpg") or a path ("/products/clock.jpg", which is what
// Pages CMS writes); only the filename is used to look the image up.
const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/products/*.{jpg,jpeg,png,webp,avif,gif}',
  { eager: true }
);

const imagesByFilename = Object.fromEntries(
  Object.entries(imageModules).map(([path, mod]) => [path.split('/').pop()!, mod.default])
);

const basename = (imageRef: string) => imageRef.split('/').pop()!;

function findImage(product: ProductEntry, imageRef: string) {
  const image = imagesByFilename[basename(imageRef)];
  if (!image) {
    throw new Error(
      `Product "${product.title}" refers to the image "${imageRef}", but that file is not in src/assets/products/.\n` +
      `Available images: ${Object.keys(imagesByFilename).join(', ')}`
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

// The cord colours and themes staff can pick in Pages CMS must be the ones this
// code knows about, or a product would silently lose its colour or filter.
function checkCmsChoices() {
  const fields = parse(pagesCmsConfig).content.find((c: { name: string }) => c.name === 'products').fields;
  const choicesOf = (name: string): string[] =>
    fields.find((f: { name: string }) => f.name === name).options.values.map((v: { name: string }) => v.name);
  const same = (a: readonly string[], b: readonly string[]) => [...a].sort().join() === [...b].sort().join();
  if (!same(choicesOf('cord'), Object.keys(CORDS))) {
    throw new Error(`The cord colours in .pages.yml (${choicesOf('cord')}) differ from src/data/decor.ts (${Object.keys(CORDS)}).`);
  }
  if (!same(choicesOf('themes'), THEME_IDS)) {
    throw new Error(`The themes in .pages.yml (${choicesOf('themes')}) differ from src/data/themes.ts (${THEME_IDS}).`);
  }
}

const isThemeId = (value: string): value is ThemeId => (THEME_IDS as readonly string[]).includes(value);

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
        themes: (entry.themes ?? []).filter(isThemeId),
        swatches
      };
    })
  );
}
