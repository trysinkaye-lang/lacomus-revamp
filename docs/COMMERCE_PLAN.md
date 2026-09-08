# Phase 4 — Production Commerce Plan

## Objective

Preserve the cinematic LACOMUS experience while making the purchase path fast, explicit, mobile-first and measurable.

## Prototype behavior

The current build keeps a local concept bag in `localStorage`. Product links and final checkout handoff go to `lacomusph.com`. No payment data is requested or stored in this concept.

## Production implementation

### Product data
Fetch product title, price, compare-at price, availability, imagery, product handle and variant IDs from Shopify instead of hard-coding them.

### Cart
Use Shopify Storefront Cart API for:
- create cart
- add / remove merchandise lines
- quantity updates
- cart cost totals
- checkout URL

### Conversion events
Track:
- fragrance_scene_view
- scent_finder_start
- scent_finder_complete
- add_to_cart
- cart_open
- begin_checkout
- purchase (Shopify / analytics integration)

### Performance
- self-host approved optimized campaign media
- use responsive image derivatives
- lazy-load below-the-fold campaigns
- load cinematic video only on capable devices
- keep checkout path usable with JavaScript motion disabled

### UX principles
- one primary CTA per scene
- show price before asking for cart intent
- keep scent notes scannable
- never hide shipping / return expectations
- preserve full keyboard access
- respect `prefers-reduced-motion`
