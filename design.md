---
version: beta
name: Unspooled
description: Gift-shop warmth. Cream paper, dark bark ink, one bright theme colour that changes with the hero.
colors:
  ink: "#2B2118"
  paper: "#F7F1E8"
  oat: "#EFE6D8"
  muted: "#6B5D4C"
  wood: "#C99A69"
  theme-christmas: "#F4ABC8"
  theme-scripture: "#D9B48A"
  theme-love: "#F3D07E"
  theme-home: "#BED3AB"
  theme-custom: "#93C9DA"
typography:
  display:
    fontFamily: Bricolage Grotesque
    fontWeight: 800
    letterSpacing: "-0.035em"
  body:
    fontFamily: Bricolage Grotesque
  devanagari-fallback:
    fontFamily: Anek Devanagari
  engraving:
    fontFamily: Tiro Devanagari Hindi
  label:
    fontSize: 12px
    fontWeight: 600
    letterSpacing: "0.24em"
    textTransform: uppercase
---
## Overview

Real pieces, cut out from their photos, hang on cords and sway. The page is
cream paper and dark ink; one bright theme colour runs through the hero, the
workshop band, the engraving section, the open question and the footer, and it
changes when the hero moves to the next theme.

Source of truth for the look: the "Final design" page of the Koseli Crafts
redesign canvas. Tokens live in `src/styles/base.css`; themes in
`src/data/themes.ts`.

## Pieces of the kit

- **Tag button** (`TagButton.astro`): dark pill shaped like a gift tag, with a
  knot and a tassel in the current theme's cord colour. The main action on any
  screen, usually "Order on WhatsApp".
- **Bead button** (`.bead`): a round wooden disc for arrows and close.
- **Stitched chip** (`.stitch`): outlined pill with a dashed inner stitch.
- **Floating pieces** (`FloatingPieces.astro`): tassels and laser-cut shapes
  that bob and drift with the pointer.

## Do's and Don'ts

- **Do** show pieces as cut-outs hanging from a cord, not as photos in boxes.
- **Do** keep text in ink on paper or on the theme colour; check contrast.
- **Don't** add a second accent colour; the theme colour is the only one.
- **Don't** use emoji as icons.
