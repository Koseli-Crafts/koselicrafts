/** The base path the site is served under: "" on koselicrafts.com. */
export const SITE_ROOT = import.meta.env.BASE_URL.replace(/\/$/, '');

// CI passes the real address with --site; local builds fall back to the live one.
const ORIGIN = import.meta.env.SITE ?? 'https://www.koselicrafts.com';

export const absoluteUrl = (path: string) => new URL(path, ORIGIN).href;

/** A piece's own page. It carries the link preview and sends visitors on to the piece in the shop. */
export const piecePage = (id: string) => `${SITE_ROOT}/pieces/${id}/`;

/** The picture shown when a link is pasted into WhatsApp or Facebook. */
export const shareImagePath = (name: string) => `${SITE_ROOT}/share/${name}.jpg`;

export const SITE_SHARE_IMAGE = 'koseli';
