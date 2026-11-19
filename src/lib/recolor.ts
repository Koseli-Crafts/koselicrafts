// Shifts the hue of a macramé photo's yarn from one colour to another, leaving
// the wood and backdrop alone. Runs in the browser.

import { hexToHsl, hslToRgb, rgbToHsl } from './color';

function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

const originals = new Map<string, Promise<ImageData>>();
const recolored = new Map<string, Promise<string>>();

function loadPixels(src: string) {
  let pixels = originals.get(src);
  if (!pixels) {
    pixels = new Promise<ImageData>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 1000 / Math.max(img.naturalWidth, img.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.naturalWidth * scale);
        canvas.height = Math.round(img.naturalHeight * scale);
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
      };
      img.onerror = reject;
      img.src = src;
    });
    originals.set(src, pixels);
  }
  return pixels;
}

async function paint(src: string, sourceHex: string, targetHex: string) {
  const original = await loadPixels(src);
  const [h0, s0, l0] = hexToHsl(sourceHex);
  const [h1, s1, l1] = hexToHsl(targetHex);
  const out = new ImageData(new Uint8ClampedArray(original.data), original.width, original.height);
  const px = out.data;
  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] === 0) continue;
    const [h, s, l] = rgbToHsl(px[i], px[i + 1], px[i + 2]);
    // Soft mask: weight 1 for saturated pixels near the yarn's hue, fading to
    // 0 for pale, greyish or off-hue pixels (backdrop shadows, wood).
    const hueDistance = Math.abs(((h - h0 + 540) % 360) - 180);
    const weight = (1 - smooth(18, 34, hueDistance)) * smooth(0.22, 0.42, s);
    if (weight <= 0) continue;
    const nh = (h + (h1 - h0) + 360) % 360;
    const ns = Math.min(1, s0 > 0.01 ? s * (s1 / s0) : s1);
    const nl = Math.min(1, Math.max(0, l + (l1 - l0)));
    const [nr, ng, nb] = hslToRgb(nh, ns, nl);
    px[i] += (nr - px[i]) * weight;
    px[i + 1] += (ng - px[i + 1]) * weight;
    px[i + 2] += (nb - px[i + 2]) * weight;
  }
  const canvas = document.createElement('canvas');
  canvas.width = out.width;
  canvas.height = out.height;
  canvas.getContext('2d')!.putImageData(out, 0, 0);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Could not recolour the image');
  return URL.createObjectURL(blob);
}

/** Returns a URL for `src` with its `sourceHex` yarn turned `targetHex`. */
export function recolorImage(src: string, sourceHex: string, targetHex: string): Promise<string> {
  if (sourceHex === targetHex) return Promise.resolve(src);
  const key = `${src}|${targetHex}`;
  let url = recolored.get(key);
  if (!url) {
    url = paint(src, sourceHex, targetHex);
    recolored.set(key, url);
  }
  return url;
}
