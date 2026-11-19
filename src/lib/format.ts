/** 3 → "03" */
export const padNumber = (n: number) => String(n).padStart(2, '0');

export const piecesLabel = (count: number) => `${count} ${count === 1 ? 'piece' : 'pieces'}`;

/** The hero's big theme word fills about the same width whatever its length. */
export function heroWordSize(word: string) {
  const scale = Math.min(30, 118 / word.length);
  return `min(${scale.toFixed(1)}vw, ${Math.round(scale * 14.4)}px)`;
}
