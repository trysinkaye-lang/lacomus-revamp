# LACOMUS Cinematic Revamp — Phase 4

Standalone Next.js concept redesign for LACOMUS, now combining the cinematic scroll-story foundation with a conversion-oriented luxury commerce layer.

## Phase 4 additions

- local concept shopping bag with quantity controls and persistence
- official-store checkout handoff (no fake checkout or payment capture)
- live-current storefront pricing reflected in the concept as of Sep 8, 2026
- Blue Sapphire, Pink Sapphire and Emerald olfactive note architecture
- 30-second scent finder interaction
- Signature Duo commerce CTA
- current 4.84 / 355 verified-review social-proof treatment
- delivery/support service architecture
- accessible FAQ / concierge section
- mobile-friendly cart drawer and scent finder dialog
- responsive conversion CTAs without sacrificing cinematic art direction

## Commerce integration boundary

The bag in this prototype is intentionally local-only. It does **not** pretend to create a real Shopify cart. Secure purchasing hands off to the current official LACOMUS storefront.

For production, replace the handoff with one of these integrations after the merchant provides authorization:

1. Shopify Storefront Cart API (recommended)
2. Shopify theme implementation directly inside the active store
3. Headless Shopify storefront with product/variant IDs and checkout URLs

Do not hard-code unverified Shopify variant IDs.

## Current product references used

- Blue Sapphire: ₱1,299.00
- Pink Sapphire: ₱1,299.00
- Emerald: ₱1,169.10 sale / ₱1,299.00 compare-at
- Blue + Pink Sapphire Bundle: ₱2,468.10 sale / ₱2,598.00 compare-at
- Current storefront social proof: 4.84 / 5 across 355 verified reviews

These values are content snapshots and must be replaced with live Shopify data in production.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
