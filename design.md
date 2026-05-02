---
version: alpha
name: Pendleton
description: Nordic knit: charcoal wool, oat cream, lichen red.
colors:
  primary: "#1E1C18"
  secondary: "#7D776D"
  tertiary: "#A23C2E"
  neutral: "#E9DFC7"
  surface: "#F2E9D2"
  on-primary: "#F2E9D2"
typography:
  display:
    fontFamily: Fraunces
    fontSize: 4.5rem
    fontWeight: 500
    letterSpacing: "-0.015em"
  h1:
    fontFamily: Fraunces
    fontSize: 2.3rem
    fontWeight: 500
  body:
    fontFamily: Inter
    fontSize: 1rem
    lineHeight: 1.7
  label:
    fontFamily: Inter
    fontSize: 0.72rem
    fontWeight: 600
    letterSpacing: "0.14em"
rounded:
  sm: 2px
  md: 4px
  lg: 8px
spacing:
  sm: 8px
  md: 16px
  lg: 32px
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: 12px 20px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
    padding: 24px
---
## Overview

A Nordic-knit palette: charcoal wool, oat cream, lichen red accent, quiet serif.

## Colors

The palette is built around high-contrast neutrals and a single accent that drives interaction.

- **Primary (`#1E1C18`):** Headlines and core text.
- **Secondary (`#7D776D`):** Borders, captions, and metadata.
- **Tertiary (`#A23C2E`):** The sole driver for interaction. Reserve it.
- **Neutral (`#E9DFC7`):** The page foundation.

## Typography

- **display:** Fraunces 4.5rem
- **h1:** Fraunces 2.3rem
- **body:** Inter 1rem
- **label:** Inter 0.72rem

## Do's and Don'ts

- **Do** use Tertiary for exactly one action per screen.
- **Do** let Neutral carry the composition — negative space is a feature.
- **Don't** introduce gradients. This system is flat on purpose.
- **Don't** mix Tertiary with alternate accents; the single-accent rule is load-bearing.
