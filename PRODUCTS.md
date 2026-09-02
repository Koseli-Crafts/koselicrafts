# How to add, change, or remove a product

**No coding needed.** Everything happens in two places on GitHub:

| What | Where |
| :--- | :--- |
| Product photos | the folder `src/assets/products` |
| Product text & prices | the file `src/data/products.json` |

After you save a change, the website rebuilds and goes live on its own in about
2 minutes. You do not need to tell anyone or press a deploy button.

---

## Before you start

- Log in to GitHub with an account that can edit this repository.
- Have your product photos ready on your computer.
- **Photo tips:** square-ish photos look best. Keep each file under about 1 MB
  so the site stays fast (use tinypng.com to shrink a big photo). Name files in
  lowercase with dashes, e.g. `wooden-clock.jpg` — no spaces, no Nepali
  characters in the filename.

---

## Add a new product

### Step 1 — Upload the photos

1. Open the repository on GitHub and click into `src` → `assets` → `products`.
2. Click **Add file** → **Upload files**.
3. Drag your photos in.
4. In the "Commit changes" box, type what you did, e.g. `add photos for wooden clock`.
5. Click **Commit changes**.

### Step 2 — Add the product details

1. Go to `src` → `data` and click `products.json`.
2. Click the **pencil icon** (✏️ Edit this file) at the top right.
3. Copy the block below and paste it **right after the very first `[`**, so your
   new product appears first on the website:

```json
  {
    "title": "Your Product Name",
    "description": "Two or three sentences describing the product.",
    "price": 1200,
    "images": ["your-photo.jpg"]
  },
```

4. Replace the text between the quotes with your own. Make sure
   `"your-photo.jpg"` is **exactly** the filename you uploaded in Step 1
   (including `.jpg` or `.png`, and lowercase/uppercase must match).
5. Click **Commit changes** → **Commit changes** again.

That's it. Wait ~2 minutes and refresh the website.

### The four fields explained

| Field | What to put |
| :--- | :--- |
| `title` | The product name shown on the card. |
| `description` | The longer text shown when someone taps the product. |
| `price` | A number like `1200`. For a range, use quotes: `"750-1500"`. Use `0` if the price is not decided — the site shows **TBD**. |
| `images` | One or more filenames from `src/assets/products`, in quotes, separated by commas. The **first one** is the photo shown on the card. |

Several photos for one product:

```json
    "images": ["clock-front.jpg", "clock-side.jpg", "clock-detail.jpg"]
```

---

## Change a product (price, name, description, photos)

1. Go to `src` → `data` → `products.json` and click the **pencil icon**.
2. Edit the text between the quotes — the price, the title, whatever needs changing.
3. Click **Commit changes** twice.

To swap a photo: upload the new one to `src/assets/products` (Step 1 above),
then change the filename inside `"images"` to the new one.

---

## Remove a product

1. Go to `src` → `data` → `products.json` and click the **pencil icon**.
2. Delete the whole block for that product — from its opening `{` down to its
   closing `}`, **including the comma after the `}`**.
3. Click **Commit changes** twice.

Optionally, also delete its now-unused photos from `src/assets/products`
(open the photo → the **⋯** menu → **Delete file**).

---

## Reorder products

Products appear on the website in the same order they appear in the file. Cut a
whole `{ ... },` block and paste it higher or lower to move it.

---

## The three rules that keep the file valid

The file is picky about punctuation. Almost every mistake is one of these:

1. **Every `}` needs a comma after it — except the very last one.**
2. **All text goes inside double quotes** `"like this"`. Numbers like `4500` do not.
3. **Never delete the `[` on the first line or the `]` on the last line.**

A correct file looks like this:

```json
[
  {
    "title": "First product",
    "description": "...",
    "price": 500,
    "images": ["one.jpg"]
  },
  {
    "title": "Last product",
    "description": "...",
    "price": 900,
    "images": ["two.jpg"]
  }
]
```

Note the comma after the first `}` and **no** comma after the last one.

---

## Did it work?

1. On GitHub, click the **Actions** tab at the top of the repository.
2. Look at the run at the top of the list:
   - 🟡 **yellow dot** — still publishing, wait a minute.
   - ✅ **green tick** — live. Refresh the website.
   - ❌ **red cross** — something in the file is wrong. **The website was not
     changed and is still showing the old version**, so nothing is broken for
     customers.

### If you see a red cross

1. Click the failed run, then click the **Build** box.
2. Click the step named **Check products.json**.
3. It prints a plain-English message, for example:

   > Product #2 ("Wooden Clock"): image "clock.JPG" was not found in
   > src/assets/products/. Upload it there, or fix the spelling.

4. Go back and fix exactly what it says, then commit again.

The most common causes are a missing or extra comma, a missing `"` quote, or a
photo filename that does not match the uploaded file (`.JPG` vs `.jpg`).

Still stuck? The website is unaffected, so there is no rush. Ask a developer, or
undo your change: open the **Commits** list, find your change, and revert it.

---

## For developers

- Images are picked up automatically via `import.meta.glob` in
  `src/components/sections/ProductsSection.astro` — **adding a product never
  requires a code change.**
- `npm run check` validates `products.json` and image references locally; the
  same check runs in CI before the build, so a bad edit fails before deploying.
- Filenames referenced in `products.json` must match files in
  `src/assets/products/` exactly; a mismatch also throws at build time.
