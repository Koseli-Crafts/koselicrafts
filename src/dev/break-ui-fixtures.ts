// Worst-case product data for the dev-only page at /dev/break-ui/<state>.
// Every value is something shop staff could plausibly type into Pages CMS.
import productsData from '../data/products.json';
import type { ProductEntry } from '../lib/catalog';

const demo = productsData as ProductEntry[];

const worst: ProductEntry[] = [
  {
    title: 'Personalised Wedding Name Plaque with Ruth 1:16 in Nepali and English',
    kind: 'Wedding & anniversary gift',
    description: 'Both your names and the date, engraved with Ruth 1:16.',
    price: 'Rs. 1500',
    images: ['/products/psalm23-plaque.jpeg'],
    cutout: '/products/cutout-first-loved.webp',
    cord: 'gold',
    themes: ['src/data/themes/love.json', 'src/data/themes/home.json']
  },
  {
    title: 'परमेश्वरको प्रेम काठको फलक',
    kind: 'धर्मशास्त्र',
    description: 'नेपाली अक्षरमा कुँदिएको परमेश्वरको प्रेमको पद, हातले बाटिएको डोरीसँग।',
    price: '1500',
    images: ['/products/psalm23-plaque.jpeg'],
    cutout: '/products/cutout-gods-love.webp',
    cord: 'lavender',
    themes: ['src/data/themes/scripture.json']
  },
  {
    title: 'Haven Cross',
    kind: 'Wall hanging',
    description:
      'Natural cream cotton cord on a wooden dowel, knotted around a central cross.\n\n' +
      'Each one is knotted by hand in our Kathmandu workshop, so the fringe and knots vary a little from piece to piece. ' +
      'We can make it longer or shorter, or in another cord colour, if you message us first.\n\n' +
      'Size: about 30 cm wide and 75 cm long including the hanging cord. Please allow 5 to 7 days for us to make it.',
    price: '1200-2500',
    images: ['/products/psalm23-rustic.jpg'],
    cutout: '/products/cutout-haven-cross.webp',
    cord: 'cream',
    themes: ['src/data/themes/home.json']
  },
  {
    title: 'Philippians 4:13 Macramé',
    kind: '',
    description: 'A macramé hanging with Philippians 4:13.',
    price: '',
    images: ['/products/psalm23-rustic.jpg'],
    cord: 'sage',
    themes: ['src/data/themes/scripture.json']
  },
  {
    title: 'Maya Ornament in Your Colour',
    kind: 'Ornament',
    description: 'Pick the macramé colour you like.',
    price: '750',
    images: ['/products/macrame-ornament-maya-pink.webp'],
    cutout: '/products/cutout-maya-pink.webp',
    cord: 'pink',
    themes: ['src/data/themes/christmas.json'],
    swatches: true,
    swatchColors: ['#d71369', '#ab0a46', '#ea3786', '#e968a6', '#7a0630']
  },
  {
    title: 'Cross',
    kind: 'Ornament',
    description: 'Small.',
    price: '300',
    images: ['/products/bookmark.png'],
    cutout: '/products/cutout-bookmark.webp',
    cord: 'wood',
    themes: []
  },
  {
    title: 'Christmas Star ⭐ Ornament',
    kind: 'Ornament',
    description: 'A star for the top of the tree.',
    price: '1,200',
    images: ['/products/macrame-ornament-faith-teal.webp'],
    cutout: '/products/cutout-faith-teal.webp',
    cord: 'teal',
    themes: ['src/data/themes/christmas.json']
  }
];

// A busy year for a small workshop: about sixty pieces in the shop.
const many: ProductEntry[] = Array.from({ length: 60 }, (_, n) => ({
  ...demo[n % demo.length],
  title: `${demo[n % demo.length].title} No. ${n + 1}`
}));

export const STATES = {
  demo: { label: 'Demo data', entries: demo },
  worst: { label: 'Worst case', entries: worst },
  empty: { label: 'Empty', entries: [] },
  one: { label: 'One', entries: demo.slice(0, 1) },
  many: { label: '60 pieces', entries: many }
} satisfies Record<string, { label: string; entries: ProductEntry[] }>;
