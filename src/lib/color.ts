// Colour conversions shared by the build (palette picking, swatch names) and the
// browser (recolouring). Hue is in degrees; saturation and lightness are 0–1.

export type RGB = [red: number, green: number, blue: number];
export type HSL = [hue: number, saturation: number, lightness: number];

export const hexToRgb = (hex: string): RGB =>
  [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16)) as RGB;

export const rgbToHex = ([r, g, b]: RGB) =>
  '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2, d = max - min;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, s, l];
}

export const hexToHsl = (hex: string) => rgbToHsl(...hexToRgb(hex));

export function hslToRgb(h: number, s: number, l: number): RGB {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

export const rgbDistance = (a: RGB, b: RGB) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

const HUE_NAMES: [upTo: number, name: string][] = [
  [15, 'red'], [40, 'orange'], [65, 'yellow'], [160, 'green'], [195, 'teal'],
  [250, 'blue'], [290, 'purple'], [345, 'pink'], [360, 'red']
];

/** A plain name for a colour, such as "dark pink", for screen readers. */
export function colorName(hex: string) {
  const [h, s, l] = hexToHsl(hex);
  const hue = s < 0.15 ? 'grey' : HUE_NAMES.find(([upTo]) => h < upTo)![1];
  return l < 0.4 ? `dark ${hue}` : l > 0.65 ? `light ${hue}` : hue;
}
