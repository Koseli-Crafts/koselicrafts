import sharp from 'sharp';
import { join } from 'node:path';

// The size WhatsApp and Facebook show link previews at.
export const SHARE_IMAGE = { width: 1200, height: 630 };
const PADDING = 50;

/** A product photo (from src/assets/products/) centred on a plain colour. */
export async function shareImage(productFile: string, background: string) {
  const piece = await sharp(join(process.cwd(), 'src/assets/products', productFile))
    .resize(SHARE_IMAGE.width - 2 * PADDING, SHARE_IMAGE.height - 2 * PADDING, { fit: 'inside', withoutEnlargement: true })
    .toBuffer();

  return sharp({ create: { ...SHARE_IMAGE, channels: 3, background } })
    .composite([{ input: piece, gravity: 'center' }])
    .jpeg({ quality: 85 })
    .toBuffer();
}
