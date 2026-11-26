import { parse } from 'yaml';
import productsData from '../data/products.json';
import pagesCmsConfig from '../../.pages.yml?raw';
import { CORDS, WOOD, isCordId, type CordId } from '../data/decor';
import { basename, productImage, productImageNames } from './product-images';
import { FIRST_THEME, THEMES, isThemeId, themeIdOf } from './themes';
import { absoluteUrl, piecePage } from './site';
import { colorName, hexToRgb, rgbDistance } from './color';
import { productOrderLink } from './contact';
import { getPalette } from './palette';

/** One entry of src/data/products.json, as Pages CMS writes it. */
export interface ProductEntry {
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
  variants?: VariantEntry[];
}

/** One "Choices" entry: a version of the piece with its own photo, e.g. a hanging ribbon. */
interface VariantEntry {
  name: string;
  material?: string;
  colour?: string;
  photo: string;
}

export interface Product {
  id: string;
  title: string;
  kind: string;
  description: string;
  priceLabel: string;
  orderLink: string;
  image: { src: string; width: number; height: number };
  /** The shown photo's file name in src/assets/products/, for the link preview picture. */
  imageFile: string;
  /** The colour of the piece's first theme, behind it in the link preview. */
  themeBackground: string;
  /** The piece's own page, for sharing. */
  shareUrl: string;
  cord: CordId;
  cordLabel: string;
  /** Theme ids, e.g. "christmas". */
  themes: string[];
  /** Macramé colours a visitor can try; the first is the piece's own colour. */
  swatches: Swatch[];
  /** Versions a visitor picks between, each with its own photo. None is picked at first. */
  variants: Variant[];
}

export interface Variant {
  /** Its part of the piece's address: /#the-piece/red-satin-ribbon. */
  id: string;
  name: string;
  /** Close-up of the material, shown in its square button. */
  materialSrc?: string;
  /** Colour of its square button when there is no close-up. */
  hex?: string;
  image: { src: string; width: number; height: number };
}

export interface Swatch {
  /** Its part of the piece's address: /#the-piece/deep-pink. */
  id: string;
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
  // Staff sometimes type the currency anyway: "Rs. 1500" or "1500/-".
  const text = String(price ?? '').trim().replace(/^rs\.?\s*/i, '').replace(/\s*\/-$/, '');
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

// "God’s Macramé Cross" becomes "gods-macrame-cross": accents and apostrophes dropped, other gaps a dash.
const slug = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f'’]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/**
 * A short code made from the text itself, so it stays the same however the
 * products are ordered (FNV-1a, written in base 36).
 */
function nameCode(text: string) {
  let hash = 0x811c9dc5;
  for (const char of text) {
    hash ^= char.codePointAt(0)!;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36);
}

// A name with no English letters (written only in Nepali) has nothing to make a
// readable link from, so it gets a code made from the name: "piece-1k3x9qz".
const pieceId = (title: string) => slug(title) || `piece-${nameCode(title.trim())}`;

/** Link names for a piece's options. A repeated name gets a number: "pink", "pink-2". */
function optionIds(names: string[], unnamed: string) {
  const seen: string[] = [];
  return names.map((name) => {
    const base = slug(name) || unnamed;
    const repeats = seen.filter((earlier) => earlier === base).length;
    seen.push(base);
    return repeats ? `${base}-${repeats + 1}` : base;
  });
}

// Wide pieces (ornaments, frames) would look oversized at full height.
export const displayHeight = (image: { width: number; height: number }) =>
  Math.round(Math.min(600, 400 / (image.width / image.height)));

export async function loadCatalog(entries = productsData as ProductEntry[]): Promise<Product[]> {
  checkCmsChoices();

  // Each product's link (/#its-name) comes from its name and sits beside the theme
  // filters' links (/#christmas), so no two may be the same.
  const ids = entries.map((entry) => pieceId(entry.title));
  const seen = new Map<string, string>(THEMES.map((theme) => [theme.id, `the theme "${theme.nav}"`]));
  entries.forEach((entry, index) => {
    const other = seen.get(ids[index]);
    if (other) throw new Error(`The product "${entry.title}" has a name too alike to ${other} to tell their links apart. Change the product's name.`);
    seen.set(ids[index], `the product "${entry.title}"`);
  });

  return Promise.all(
    entries.map(async (entry, index) => {
      const photo = findImage(entry, entry.images[0]);
      const image = entry.cutout ? findImage(entry, entry.cutout) : photo;
      const cord = isCordId(entry.cord) ? entry.cord : 'wood';
      const variantIds = optionIds((entry.variants ?? []).map((variant) => variant.name), 'choice');
      const variants = (entry.variants ?? []).map((variant, k) => {
        const photo = findImage(entry, variant.photo);
        return {
          id: variantIds[k],
          name: variant.name.trim(),
          materialSrc: variant.material ? findImage(entry, variant.material).src : undefined,
          hex: variant.colour?.trim() || undefined,
          image: { src: photo.src, width: photo.width, height: photo.height }
        };
      });
      // Choices show real photos, so recolouring the cord would fight them.
      const swatchColors = entry.swatches && !variants.length ? withPresets(await ownColors(entry)) : [];
      const swatchNames = swatchColors.map(colorName);
      const swatchIds = optionIds(swatchNames, 'colour');
      const swatches = swatchColors.map((hex, k) => ({ id: swatchIds[k], hex, name: swatchNames[k] }));
      const id = ids[index];
      const themes = productThemes(entry);
      const shareUrl = absoluteUrl(piecePage(id));

      return {
        id,
        title: entry.title,
        kind: entry.kind?.trim() || 'Handmade',
        description: entry.description,
        priceLabel: formatPrice(entry.price),
        orderLink: productOrderLink(entry.title, shareUrl),
        image: { src: image.src, width: image.width, height: image.height },
        imageFile: basename(entry.cutout || entry.images[0]),
        themeBackground: THEMES.find((theme) => theme.id === themes[0])?.background ?? FIRST_THEME.background,
        shareUrl,
        cord,
        cordLabel: cord === 'wood' ? CORDS.wood.label : `${CORDS[cord].label} cord`,
        themes,
        swatches,
        variants
      };
    })
  );
}
