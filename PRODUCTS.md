# How to add, change, or remove a product

You do this in **Pages CMS** — a simple form-based editor. No code, no JSON, no
GitHub knowledge needed.

👉 **[app.pagescms.org](https://app.pagescms.org)**

Save a change there and the website updates itself in about 2 minutes. There is
no deploy button to press and no one to notify.

---

## First time only: getting access

**If you own the repository (developer / admin):**

1. Go to **[app.pagescms.org](https://app.pagescms.org)** and click **Sign in with GitHub**.
2. Install the Pages CMS GitHub App and select **only** the
   `Koseli-Crafts/koselicrafts` repository.
3. Open the repository in Pages CMS. It reads `.pages.yml` from this repo and
   shows a **Products** entry in the left sidebar.

**To let someone else edit (shop staff, family, anyone):**

They do **not** need a GitHub account. In Pages CMS, open **Settings →
Collaborators**, invite them **by email**, and they get their own login that can
edit products and photos — but cannot touch any settings or code.

Pages CMS is 100% free and open source (MIT).

---

## Add a new product

1. Open **[app.pagescms.org](https://app.pagescms.org)** and click **Products**
   in the left sidebar.
2. Click **Add an entry**.
3. Fill in the form:

   | Field | What to put |
   | :--- | :--- |
   | **Product name** | The name shown when someone taps the piece, e.g. `Wooden Wall Clock`. Keep it short. |
   | **Kind** | A short label above the name, e.g. `Ornament`, `Scripture`, `Wall hanging`. |
   | **Description** | One or two sentences shown when someone taps the piece. |
   | **Price (Rs.)** | Just the number: `1200`. For a range: `750-1500`. Leave it **empty** and the site shows "Price on request". |
   | **Photos** | Click to upload from your phone or computer. Add as many as you like. |
   | **Cut-out photo** | The piece on its own with the background removed (see *Photo tips*). This is the picture that floats in the collection. |
   | **Cord colour** | The macramé colour. Pick **Wood** if there is no cord. |
   | **Themes** | Which collection filters show the piece. Click the box and start typing a theme's name to see the choices. Pick one or more (see "Themes" below to add one). |
   | **Show color swatches** | Tick it for macramé pieces whose cord colour visitors may want to change, like the ornaments. Shows a row of colour squares; tapping one recolours the cord in the picture. |
   | **Swatch colours** | Leave it **empty**. The site then picks the cord's colours from the first photo by itself. Only fill it in if those picked colours look wrong (see below). |

4. Click **Save**.

The collection shows the **cut-out photo**. If you leave it empty, the first
photo is used instead, background and all, which looks out of place. So add a
cut-out whenever you can.

Done. Wait about 2 minutes, then refresh [koselicrafts.com](https://www.koselicrafts.com/).

### If the colour squares look wrong

When **Show color swatches** is ticked, the first square is the cord's own
colour and the next few are other shades of it, picked from the first photo.
If the photo's lighting fools it (for example the first square is brown instead
of pink), type the colours yourself in **Swatch colours**, one per line, as
colour codes like `#d71369`, main colour first. To find a code, open the photo
in any colour-picker tool such as
[imagecolorpicker.com](https://imagecolorpicker.com) and click the cord. The
bright extra colours (green, blue, red, pink, purple) are added automatically.

---

## Change a product

Click **Products**, click the product, edit any field, click **Save**.

To change a photo: remove the old one with its **✕**, upload the new one, and
drag it into position.

---

## Remove a product

Click **Products**, open the product, and use the **⋯** menu → **Delete**.

The photos stay in storage — that is fine, they simply stop appearing on the
site. To clear them out too, open the **Media** section and delete them there.

---

## Reorder products

Products appear on the website in the order they appear in the list. **Drag a
product up or down** in the Products list and click **Save**.

---

## Did it work?

Pages CMS shows a confirmation as soon as it saves. The website itself takes
about 2 more minutes to update.

If the site has not changed after a few minutes:

1. Hard-refresh the page (Ctrl+Shift+R, or Cmd+Shift+R on a Mac) — your browser
   may be showing you an old copy.
2. Still nothing? Go to
   [the Actions page](https://github.com/Koseli-Crafts/koselicrafts/actions) and
   look at the run at the top:
   - 🟡 **yellow dot** — still publishing, wait a minute.
   - ✅ **green tick** — it is live; hard-refresh again.
   - ❌ **red cross** — click it, open **Build → Check products.json**, and it
     prints a plain-English description of what is wrong.

**A failure never breaks the live site.** If something is wrong, the website
keeps showing the previous version until it is fixed. Customers never see a
broken page.

---

## Themes (the slideshow at the top and the shop filters)

Each theme is one slide at the top of the page (its colour, big word, sentence
and hanging photo) and one filter in the shop. Click **Themes** in the left
sidebar.

**Add a theme**

1. Click **Add an entry** and fill in the form. Each field says what it is for.
2. **Photo** must be a cut-out with a see-through background, like the product
   cut-outs (see *Photo tips* below). Upload it under **Photo**.
3. **Background colour** is a code like `#BED3AB`. Pick a soft, light colour so
   the dark text stays readable. Sites like
   [htmlcolorcodes.com](https://htmlcolorcodes.com) show the code for a colour.
4. **Position** sets the order: 1 comes first. The first theme is the colour the
   page opens with.
5. Click **Save**. Then open the products that belong to it and tick the new
   theme under **Themes**.

Leave the three **(advanced)** fields empty unless the photo looks too big, too
small or hits the menu.

**Keep it to about five or six themes with short names.** They all sit in one
row at the top of the page, and long or many names get squeezed onto two lines.

**Remove a theme**: first untick it on every product that uses it, then delete
it under **Themes**. If a product still uses a deleted theme, the site stops
updating and the Actions page names the product (see *Did it work?*). The live
site keeps showing the old version until that is fixed.

---

## Add a PDF people can download

PDFs appear on the **Resources** page (koselicrafts.com/resources), each with a
download button. The page is linked from the top menu and the footer.

1. In Pages CMS, click **Resources** in the left sidebar.
2. Click **Add an entry**.
3. Fill in **Name** (e.g. `Christmas gift catalogue 2026`), an optional
   **Description**, and upload the file under **PDF file**.
4. Click **Save**. The page updates in about 2 minutes.

To remove one, delete its entry. To change the order, drag the entries.

---

## Photo tips

- **Cut-out photos** need a see-through background, saved as `.png` or `.webp`.
  A free background remover such as [remove.bg](https://www.remove.bg) does this
  in one click. Crop close around the piece.
- Keep each photo under about 1 MB so the site stays fast — use
  [tinypng.com](https://tinypng.com) to shrink a large photo before uploading.
- Any filename is fine; the editor cleans it up automatically.

---

<details>
<summary><strong>Alternative: editing the files directly on GitHub</strong></summary>

Pages CMS is only a friendly front end for two things in this repository. You
can still edit them by hand if you prefer:

| What | Where |
| :--- | :--- |
| Product photos | `src/assets/products/` |
| Product text & prices | `src/data/products.json` |
| Downloadable PDFs | `public/resources/` |
| PDF names & descriptions | `src/data/resources.json` |

Each product is one block in `src/data/products.json`:

```json
  {
    "title": "Your Product Name",
    "description": "Two or three sentences describing the product.",
    "kind": "Wall hanging",
    "price": "1200",
    "images": ["/products/your-photo.jpg"],
    "cutout": "/products/your-photo-cutout.webp",
    "cord": "cream",
    "themes": ["src/data/themes/home.json"]
  },
```

Three rules keep the file valid:

1. Every `}` needs a comma after it — except the very last one.
2. All text goes inside double quotes `"like this"`.
3. Never delete the `[` on the first line or the `]` on the last line.

Two things must match what Pages CMS expects, or the editor breaks:

- **The price goes in quotes** — `"1200"`, not `1200`. A bare number makes the
  CMS refuse to save with *"Expected string, received number"*.
- **Image paths start with `/products/`** — `"/products/clock.jpg"`, not
  `"clock.jpg"`. Without the prefix the photo appears blank in the editor.

`npm run check` catches both, and so does the build in CI.

</details>

---

## For developers

- Product images are picked up automatically from `src/assets/products/` via
  `import.meta.glob` in `src/lib/product-images.ts`.
  **Adding a product never requires a code change.**
- `.pages.yml` defines the Pages CMS admin form. Editing it changes the fields
  editors see; it has no effect on the built site.
- `npm run check` validates `products.json` and its image references. The same
  check runs in CI before the build, so a bad edit fails without deploying.
- The site resolves image references by filename, so the `/products/` prefix is
  cosmetic to the build — but Pages CMS needs it to map a value back to
  `src/assets/products/`, and it needs `price` as a string (ranges like
  `750-1500` are not numbers). `check-products.mjs` enforces both, and checks
  that `cord` only uses the choices listed in `.pages.yml`, that every theme a
  product names exists, and that `swatchColors` are colour codes.
- The themes (hero slides and collection filters) are one JSON file each in
  `src/data/themes/`, edited as the "Themes" collection in Pages CMS. The file
  name without `.json` is the theme's id. Products point to themes with a
  Pages CMS `reference` field, which saves the file path
  (`src/data/themes/home.json`); `src/lib/themes.ts` reads the files and checks
  them. **Adding a theme never requires a code change.**
- Cord colours and their tassel pictures, and the wood pieces, live in
  `src/data/decor.ts`. Adding a cord colour or wood piece means updating that
  file and the matching choices in `.pages.yml`. The build stops with a plain
  message if the two disagree.
