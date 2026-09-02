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
   | **Product name** | The name shown on the card, e.g. `Wooden Wall Clock`. |
   | **Description** | Two or three sentences shown when someone taps the product. |
   | **Price (Rs.)** | Just the number: `1200`. For a range: `750-1500`. Leave it **empty** and the site shows "Price on request". |
   | **Photos** | Click to upload from your phone or computer. Add as many as you like. |

4. Click **Save**.

The **first photo** is the one shown on the product card, so put the best one
first. Drag the photos to reorder them.

Done. Wait about 2 minutes, then refresh [koselicrafts.com](https://www.koselicrafts.com/).

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

## Photo tips

- Square-ish photos look best on the cards.
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

Each product is one block in `src/data/products.json`:

```json
  {
    "title": "Your Product Name",
    "description": "Two or three sentences describing the product.",
    "price": "1200",
    "images": ["your-photo.jpg"]
  },
```

Three rules keep the file valid:

1. Every `}` needs a comma after it — except the very last one.
2. All text goes inside double quotes `"like this"`.
3. Never delete the `[` on the first line or the `]` on the last line.

Image entries may be a bare filename (`clock.jpg`) or a path
(`/products/clock.jpg` — what Pages CMS writes). Either works.

</details>

---

## For developers

- Product images are picked up automatically from `src/assets/products/` via
  `import.meta.glob` in `src/components/sections/ProductsSection.astro`.
  **Adding a product never requires a code change.**
- `.pages.yml` defines the Pages CMS admin form. Editing it changes the fields
  editors see; it has no effect on the built site.
- `npm run check` validates `products.json` and its image references. The same
  check runs in CI before the build, so a bad edit fails without deploying.
- Image references are resolved by filename only, so a CMS-written
  `/products/x.jpg` and a hand-typed `x.jpg` behave identically.
