# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Christians in Nepal.** Local believers buying for their own home or as a gift (a *koseli*) for family and friends. They order by WhatsApp.
- **Churches and ministries in Nepal.** Congregations and ministries ordering in quantity or asking for custom pieces, for example for events, gifts to members or outreach.

Both groups need to see what a piece is, what it says and what it costs, then start an order with a human.

## Product Purpose

Koseli Crafts is a small business in Kathmandu, Nepal. It makes laser-cut and laser-engraved wooden pieces, often finished by hand with macramé. "Koseli" is Nepali for "gift".

The website is the shop window. It shows the catalogue and sends visitors to WhatsApp to order. Success means a visitor finds a piece they want and starts a WhatsApp conversation about it.

## Positioning

Lead with handmade Nepali gifts, and be friendly to faith rather than preaching it. Scripture pieces are the biggest range, but the brand is "a gift made by hand in Kathmandu", not a ministry.

What a neighbouring decor shop can't truthfully copy:

- scripture and texts engraved in Nepali (Devanagari) and other Himalayan languages and scripts;
- the shop's own laser workshop, with pieces finished by hand;
- custom engraving of a customer's own words.

## Operating Context

- **Ordering happens on WhatsApp.** Each product has a deep link with a prefilled message naming the piece. There is no cart or checkout on the site.
- **Staff manage the catalogue in Pages CMS.** It edits `src/data/products.json` and product photos without code (see `PRODUCTS.md` and `.pages.yml`). Any new product field must also be added to `.pages.yml`, and must stay simple enough for non-technical staff.
- **Product files come from a separate repo.** Laser files are made in the sibling `Koseli-Crafts/products` repo. Its product kinds are `scripture`, `seasonal` (Christmas, Easter), `custom` and `badges` (mountain peaks). Its art categories are `general`, `christmas`, `easter`, `tibetan` and `nepali`.
- **Macramé finishing is done at the bench,** guided by the staff guidebook in the sibling `guidebook` folder.
- **Back of each piece:** the engraved back says buying supports a small Christian business in Nepal, with `koselicrafts.com` as the reference.

## Capabilities and Constraints

- **Stack:** Astro and Tailwind, deployed as a static site at koselicrafts.com. Pages CMS commits trigger a rebuild in about 2 minutes.
- **Product fields today:** title, description (plain text), price in Rs. (a number, a range like `750-1500`, or empty for "Price on request"), photos, a cut-out photo (background removed, shown in the collection), a kind label, a cord colour, themes (collection filters), and an optional colour-swatch switch.
- **Contact:** WhatsApp, phone +977 971-2095355, email info@koselicrafts.com.
- **Payment and delivery: deliberately vague.** The site must not promise payment methods, delivery areas, costs or timelines. Copy says to contact the shop for details.
- **Undecided:** whether the shop ships outside Nepal, and whether it states a WhatsApp reply time.

## Brand Commitments

- Name: **Koseli Crafts**. The logo exists at `../raw/KoseliCrafts_logo.iO4d9lPy.png` (outside this repo).
- Made in Kathmandu, Nepal. The footer line "Designed and handcrafted in Nepal" is existing brand copy.
- Faith-friendly and gift-first in tone (see Positioning).

## Evidence on Hand

- **Catalogue:** 13 products in `src/data/products.json`, mostly scripture macramé and engraved plaques, plus a bookmark. More are coming.
- **Photos:** `src/assets/products/`. A mix of real phone photos (such as `psalm23-plaque.jpeg`, `psalm23-rustic.jpg` and `whatsapp-image-*`) and AI-generated lifestyle renders (`chatgpt-image-*`, `grok-image-*`).
- **Workshop and product photos outside the repo:** `../raw/` (for example `IMG_20261017_*.jpg` and the macramé shots).
- **No testimonials exist.** The site has no testimonials section. Do not invent customers, quotes, ratings, order counts, press or delivery claims.

## Product Principles

1. **Every piece leads to a conversation.** The aim of each surface is a WhatsApp message about a specific piece, so make that path short and clear.
2. **Show the real thing.** Prefer real photos of real pieces over renders, and real words over filler copy.
3. **Gift first, faith welcome.** Speak to giving and craft, and let the scripture carry the faith.
4. **Staff can run it alone.** Any catalogue change must be possible in Pages CMS by someone who doesn't code.
5. **Promise only what's true.** Payment, delivery and timing stay "contact us" until the shop confirms them.

## Accessibility & Inclusion

- *Inferred, not confirmed:* most visitors are on phones in Nepal, often on mobile data, so keep pages light and fast.
- Product text includes Nepali (Devanagari) and other Himalayan scripts, so these must render correctly.
