import sharp from 'sharp';
import { join } from 'node:path';
import { rgbDistance, rgbToHex, rgbToHsl, type RGB } from './color';

// Picks a handful of representative colors from an image at build time, so the
// "swatch squares" never need to be entered by hand in the CMS.
const cache = new Map<string, Promise<string[]>>();

// Photos are cream/white backdrops with wooden plaques, so neither is a
// "macramé color". Drop near-white, near-black, greyish and wood tones.
function isBackdropOrWood([r, g, b]: RGB) {
  const [h, s, l] = rgbToHsl(r, g, b);
  if (l > 0.78 || l < 0.2) return true;
  // Pale or greyish colors are backdrop shadows, not yarn.
  if (s < 0.4) return true;
  return h >= 15 && h <= 45 && s > 0.25 && s < 0.85 && l > 0.2 && l < 0.88;
}

async function extract(file: string, count: number): Promise<string[]> {
  const { data } = await sharp(file)
    .resize(64, 64, { fit: 'inside' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Bucket pixels into a coarse 4-bit-per-channel grid and average each bucket.
  const buckets = new Map<number, { r: number; g: number; b: number; n: number }>();
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const bucket = buckets.get(key) ?? { r: 0, g: 0, b: 0, n: 0 };
    bucket.r += r; bucket.g += g; bucket.b += b; bucket.n++;
    buckets.set(key, bucket);
  }

  // Favor common colors, with a small boost for saturated ones so a beige
  // wall does not crowd out the product's accent colors.
  const ranked = [...buckets.values()]
    .map((c) => {
      const rgb: RGB = [Math.round(c.r / c.n), Math.round(c.g / c.n), Math.round(c.b / c.n)];
      const sat = Math.max(...rgb) - Math.min(...rgb);
      return { rgb, score: c.n * (1 + sat / 128) };
    })
    .sort((a, b) => b.score - a.score);

  const picked: RGB[] = [];
  for (const { rgb } of ranked) {
    if (isBackdropOrWood(rgb)) continue;
    if (picked.every((p) => rgbDistance(p, rgb) > 48)) picked.push(rgb);
    if (picked.length === count) break;
  }
  return picked.map(rgbToHex);
}

/** Returns up to `count` hex colors for an image file in src/assets. */
export function getPalette(assetPath: string, count = 4): Promise<string[]> {
  const file = join(process.cwd(), 'src/assets', assetPath);
  const key = `${file}:${count}`;
  if (!cache.has(key)) cache.set(key, extract(file, count).catch(() => []));
  return cache.get(key)!;
}
