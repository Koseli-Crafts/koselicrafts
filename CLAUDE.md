# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Static Astro + Tailwind v4 shop window for Koseli Crafts, a Kathmandu gift maker. There is no cart: every order goes to WhatsApp. Read `PRODUCT.md` (who it's for, tone, positioning) and `design.md` (visual rules, tokens) before changing copy or design.

## Commands

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Dev server on :4321 |
| `npm run build` | Build to `dist/`. Also validates `resources.json` (see below) |
| `npm run preview` | Serve the built site |
| `npm run check` | Validate `src/data/products.json`, the theme files and their images (`scripts/check-products.mjs`) |

There are no tests and no linter. CI (`.github/workflows/deploy-pages.yml`) runs `npm run check`, then `astro build`, and deploys to GitHub Pages on every push to `main`. Pushing to `main` puts the change live.

## Content is edited by non-technical staff in Pages CMS

`.pages.yml` defines the Pages CMS forms. Staff edit through it, and each save commits to `main`. That makes `.pages.yml` and the data files a contract with the people editing them:

- **Products**: `src/data/products.json`, with photos in `src/assets/products/`. The CMS writes image paths as `/products/<file>`. The site looks images up by filename only (`import.meta.glob` in `src/lib/product-images.ts`), but the CMS needs the prefix. `price` must be a string.
- **Resources**: `src/data/resources.json`, with PDFs in `public/resources/` (served as-is, at `/resources/<file>`). An entry with no `file` shows as "Coming soon". `src/lib/resources.ts` fails the build if a listed PDF is missing. The printed card in the 25 Names of Jesus Advent set links to `/resources/`, so that URL is fixed. The Advent explainer box on that page is hard-coded in `resources.astro`, not CMS data.
- `media` in `.pages.yml` is a list of named upload folders (`images`, `files`). Every image or file field must name one with `options.media`.
- A new data field must also be added to `.pages.yml`, and kept simple for non-technical editors. Update the staff guide in `PRODUCTS.md` when the editing steps change.
- **Themes**: one JSON file per theme in `src/data/themes/` (the "Themes" collection in Pages CMS); the file name is the theme's id. Products link to themes through a `reference` field that saves the file path (`src/data/themes/home.json`). `src/lib/themes.ts` loads and checks them; the build and `check-products.mjs` stop if a product names a theme that no longer exists.
- The `cord` and `wood` choices in `.pages.yml` must match `CORDS` and `WOOD` in `src/data/decor.ts`. `catalog.ts` (at build) stops with a plain message if they differ.
- Error messages in these checks are written for shop staff. Keep them in plain English.

## How the page fits together

- `src/pages/index.astro` stacks the sections in `src/components/sections/`. `src/pages/resources.astro` is the downloads page. Both use `src/layouts/Layout.astro`, which accepts `title` and `description`.
- **Themes drive the whole page.** `src/lib/themes.ts` builds them from the files in `src/data/themes/`. The hero cycles through them, and each one is also a collection filter. The hero writes the theme list into a JSON `<script id="koseli-themes">`. On each change, `src/scripts/theme.ts` (`paintTheme`) sets the `--theme-bg` CSS variable and swaps every `img[data-theme-tassel]` and `img[data-float]`. Anything that should follow the theme uses `var(--theme-bg)` or those data attributes. Per `design.md`, the theme colour is the only accent colour.
- **The catalogue is built at build time.** `loadCatalog()` in `src/lib/catalog.ts` turns the JSON into display data: price labels, WhatsApp order links from `src/lib/contact.ts`, and cut-out images. For products with `swatches`, it picks cord colours from the first photo using sharp (`src/lib/palette.ts`). In the browser, `src/lib/recolor.ts` changes the cord colour in the photo when a visitor taps a swatch.
- Motion: Lenis smooth scrolling and parallax start in `src/scripts/site-motion.ts` on every page. Shared motion and the UI kit (tag button, bead button, `.eyebrow`, `.wavy-link`) live in `src/styles/components/`. Design tokens are in `src/styles/base.css` (`@theme`).
- Build internal links from `import.meta.env.BASE_URL`, because CI passes `--base` (see `RESOURCES_PAGE` in `src/lib/resources.ts`).
