# Verification and performance report

## Scope

This is a frontend prototype, not a performance certification. No traffic capacity or real-user Core Web Vitals are claimed.

## Executed locally — 2026-10-13

- Dependency installation: completed; reproducible lockfile included.
- TypeScript strict type checking: passed.
- ESLint: passed with no warnings after configuration cleanup.
- Production build attempted with default Turbopack and with Webpack. Both stopped with the execution environment's `ENOENT: uv_resident_set_memory` before application compilation could complete. This is not a successful build result.
- Unit tests and repository CI results: see the final verification update below.
- Browser execution and screenshots: not performed. The managed environment has no supported browser-control capability for this workflow.
- Lighthouse: not run. No mobile score, LCP, INP or CLS measurement is reported.

## Engineering choices

- Server-rendered home/catalog/category/product content; isolated client components for interaction.
- 12 products per server-side catalog page; bounded mock search suggestions and selected-ID retrieval.
- URL filters and sort state, including intersected variant stock constraints.
- One variable, locally hosted Persian font subset with `font-display: swap`.
- Local responsive WebP hero using Next Image, preload only for the main hero/product image, fixed image proportions and SVG product placeholders.
- No carousel library, animation runtime, analytics, authentication SDK or remote font calls.
- Lightweight useSyncExternalStore state with a stable server snapshot and validated persisted cart quantities.
- CSS reduced-motion support. Responsive breakpoints target 320, 375, 390, 430, 768, 1024 and 1440px.

## Reproducible performance follow-up

On a standard Node 22 machine, run `npm ci && npm run build && npm start`. Use a pinned Lighthouse version with Chrome headless, mobile simulated throttling, the same host and a clean profile. Run `/`, `/shop`, and `/product/shomiz-1` five times; report the median and the exact browser/Lighthouse versions, CPU/network settings, machine and cache state. Measure a populated cart/checkout separately. Preserve reports as CI artifacts.

Target: mobile Performance >=90 under that defined setup. Real-user targets, when instrumentation and sufficient data exist: p75 LCP <=2.5s, INP <=200ms, CLS <=0.1. Lab and field metrics must be reported separately. Illustrative SVG product cards are cheaper than real photography; repeat measurements after asset replacement. No benchmark values are inferred from code structure.

## Final verification update

Pending repository CI. Browser layout, interaction, focus, axe and overflow checks are supplied as executable Playwright tests but remain unverified until that suite runs successfully.
