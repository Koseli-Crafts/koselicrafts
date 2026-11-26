export const PHONE = { display: '+977 971-2095355', href: 'tel:+9779712095355' };
export const EMAIL = 'info@koselicrafts.com';

const WHATSAPP_NUMBER = '9779712095355';

const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const ORDER_LINK = whatsappLink('Hello Koseli Crafts, I’d like to place an order.');

export const QUESTION_LINK = whatsappLink('Hello Koseli Crafts, I’d like to ask about a gift.');

/** The order message names the piece, the cord colour if the visitor picked another, and links to it. */
export const productOrderLink = (title: string, pieceUrl: string, cordColour?: string) =>
  whatsappLink(
    `Hello, I like ${title} and want to place an order.` +
    (cordColour ? ` I’d like it with ${cordColour} cord.` : '') +
    `\n${pieceUrl}`
  );

export function engravingLink(words: string) {
  const text = words.trim();
  return whatsappLink(
    text
      ? `Hello Koseli Crafts, I’d like a custom engraving with these words: “${text}”`
      : 'Hello Koseli Crafts, I’d like a custom engraving.'
  );
}
