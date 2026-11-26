// A picked colour or choice rides along with a piece's address, after a slash in
// the shop (/#nepali-maya-ornament/green) and after a # on its own page
// (/pieces/nepali-maya-ornament/#green). src/pages/pieces/[id].astro turns the
// second into the first with an inline script that cannot import this file.

/** The shop's #part for a piece: "nepali-maya-ornament/green". */
export const pieceAddress = (pieceId: string, optionId?: string) => (optionId ? `${pieceId}/${optionId}` : pieceId);

/** Reads the shop's #part back into its piece and option. */
export function readPieceAddress(address: string) {
  const [pieceId, optionId = ''] = address.split('/');
  return { pieceId, optionId };
}

/** A piece's own page, pointing at one option: "…/pieces/nepali-maya-ornament/#green". */
export const pageWithOption = (pageUrl: string, optionId?: string) => (optionId ? `${pageUrl}#${optionId}` : pageUrl);
