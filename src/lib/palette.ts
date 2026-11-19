import sharp from 'sharp';
import { join } from 'node:path';

// Picks a handful of representative colors from an image at build time, so the
// "swatch squares" never need to be entered by hand in the CMS.
const cache = new Map<string, Promise<string[]>>();

const hex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');

// Photos are cream/white backdrops with wooden plaques, so neither is a
// "macramé color". Drop near-white, near-black and wood tones.
function isBackdropOrWood([r, g, b]: number[]) {
  const max = Math.max(r, g, b) / 255, min = Math.min(r, g, b) / 255;
  const l = (max + min) / 2, d = max - min;
  if (l > 0.78 || l < 0.2) return true;
  if (d === 0) return true;
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = max === r / 255 ? ((g - b) / 255 / d) % 6 : max === g / 255 ? (b - r) / 255 / d + 2 : (r - g) / 255 / d + 4;
  h = (h * 60 + 360) % 360;
  // Pale or grayish colors are backdrop shadows, not yarn.
  if (s < 0.4) return true;
  return h >= 15 && h <= 45 && s > 0.25 && s < 0.85 && l > 0.2 && l < 0.88;
}

const distance = (a: number[], b: number[]) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

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
      const rgb = [Math.round(c.r / c.n), Math.round(c.g / c.n), Math.round(c.b / c.n)];
      const sat = Math.max(...rgb) - Math.min(...rgb);
      return { rgb, score: c.n * (1 + sat / 128) };
    })
    .sort((a, b) => b.score - a.score);

  const picked: number[][] = [];
  for (const { rgb } of ranked) {
    if (isBackdropOrWood(rgb)) continue;
    if (picked.every((p) => distance(p, rgb) > 48)) picked.push(rgb);
    if (picked.length === count) break;
  }
  return picked.map(([r, g, b]) => hex(r, g, b));
}

/** Returns up to `count` hex colors for an image file in src/assets. */
export function getPalette(assetPath: string, count = 4): Promise<string[]> {
  const file = join(process.cwd(), 'src/assets', assetPath);
  const key = `${file}:${count}`;
  if (!cache.has(key)) cache.set(key, extract(file, count).catch(() => []));
  return cache.get(key)!;
}
