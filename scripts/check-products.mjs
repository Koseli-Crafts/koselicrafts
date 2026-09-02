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

if (!Array.isArray(products)) errors.push('The file must start with [ and end with ].');

products.forEach((product, i) => {
  const where = `Product #${i + 1}${product?.title ? ` ("${product.title}")` : ''}`;
  if (!product?.title?.trim()) errors.push(`${where}: "title" is missing or empty.`);
  if (!product?.description?.trim()) errors.push(`${where}: "description" is missing or empty.`);
  if (product?.price === undefined) errors.push(`${where}: "price" is missing (use 0 if not decided yet).`);
  if (!Array.isArray(product?.images) || product.images.length === 0) {
    errors.push(`${where}: "images" must list at least one image filename.`);
    return;
  }
  for (const filename of product.images) {
    used.add(filename);
    if (!available.includes(filename)) {
      errors.push(
        `${where}: image "${filename}" was not found in ${IMAGE_DIR}/.\n` +
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
