// Plain-English validator for src/data/products.json.
// Run with: npm run check
import { readFileSync, readdirSync } from 'node:fs';

const DATA = 'src/data/products.json';
const IMAGE_DIR = 'src/assets/products';

const errors = [];
const warnings = [];

let products;
try {
  products = JSON.parse(readFileSync(DATA, 'utf8'));
} catch (error) {
  console.error(`\n❌ ${DATA} is not valid JSON.\n   ${error.message}`);
  console.error('   Common causes: a missing comma between products, a comma after the LAST');
  console.error('   product, or a missing " quote. Paste the file into jsonlint.com to spot it.\n');
  process.exit(1);
}

const available = readdirSync(IMAGE_DIR).filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f));
const used = new Set();

// Pages CMS reads and writes images as "/products/name.jpg" (the `output` prefix
// in .pages.yml). The site itself only cares about the filename, but the CMS
// cannot resolve a value without the prefix — it shows a broken preview — so the
// prefix is required here to keep hand-edits from breaking the editor.
const PREFIX = '/products/';
const basename = (imageRef) => String(imageRef).split('/').pop();

if (!Array.isArray(products)) errors.push('The file must start with [ and end with ].');

products.forEach((product, i) => {
  const where = `Product #${i + 1}${product?.title ? ` ("${product.title}")` : ''}`;
  if (!product?.title?.trim()) errors.push(`${where}: "title" is missing or empty.`);
  if (!product?.description?.trim()) errors.push(`${where}: "description" is missing or empty.`);
  if (product?.price !== undefined && typeof product.price !== 'string') {
    errors.push(
      `${where}: "price" must be in quotes, e.g. "${product.price}" instead of ${product.price}.\n` +
      `   Pages CMS rejects a bare number with "Expected string, received number".`
    );
  }
  if (!Array.isArray(product?.images) || product.images.length === 0) {
    errors.push(`${where}: "images" must list at least one image filename.`);
    return;
  }
  for (const imageRef of product.images) {
    const filename = basename(imageRef);
    used.add(filename);
    if (!String(imageRef).startsWith(PREFIX)) {
      errors.push(
        `${where}: image "${imageRef}" must be written as "${PREFIX}${filename}".\n` +
        `   Without that prefix the photo shows up blank in the Pages CMS editor.`
      );
    }
    if (!available.includes(filename)) {
      errors.push(
        `${where}: image "${imageRef}" was not found in ${IMAGE_DIR}/.\n` +
        `   Upload it there, or fix the spelling. Names are case-sensitive and must include\n` +
        `   the extension (.jpg / .png). Available: ${available.join(', ')}`
      );
    }
  }
});

for (const filename of available) {
  if (!used.has(filename)) warnings.push(`${IMAGE_DIR}/${filename} is not used by any product — add it to ${DATA} or delete it.`);
}

for (const w of warnings) console.warn(`⚠️  ${w}`);

if (errors.length) {
  console.error(`\n❌ Found ${errors.length} problem(s) in ${DATA}:\n`);
  for (const e of errors) console.error(` • ${e}\n`);
  console.error('Fix the above and try again. Nothing was published.\n');
  process.exit(1);
}

console.log(`✅ ${products.length} products look good.`);
