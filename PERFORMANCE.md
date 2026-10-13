# Verification and performance report

## Scope

This is a frontend prototype, not a performance certification. No traffic capacity or real-user Core Web Vitals are claimed.

## Executed locally — 2026-10-13

- Dependency installation: completed; reproducible lockfile included.
- TypeScript strict type checking: passed.
- ESLint: passed with no warnings after configuration cleanup.
- Production build attempted with default Turbopack and with Webpack. Both stopped with the execution environment's `ENOENT: uv_resident_set_memory` before application compilation could complete. This is not a successful build result.
- Unit tests: all 9 passed locally. Repository CI results are recorded below.
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

GitHub Actions run: https://github.com/Iman-gholami/kasra/actions/runs/38386109941

Verified source commit: `7c6e2967d7ff486cd08f62510da56e1759c56355`.

- Dependency installation, strict TypeScript, ESLint, and all 9 unit tests: passed.
- Next.js 16.4.0 production build (Turbopack): passed on the Ubuntu GitHub-hosted runner using Node 22.
- All 16 Chromium Playwright tests: passed. Coverage includes category navigation, normalized search, filter/sort/page URLs, variant stock, cart totals and persistence, wishlist persistence, validation and demo order confirmation, mobile menu/Escape/focus, supporting routes/404, and overflow checks at all seven specified widths.
- Automated axe checks on category and populated checkout pages: passed within the configured WCAG 2 A/AA and 2.1 AA tags. This is not a full WCAG 2.2 certification or a substitute for manual assistive-technology testing.
- Earlier CI failures exposed an incorrect font path, insufficient footer contrast, unstable form accessible names and ambiguous test selectors. These were corrected before the successful run.
- Selected desktop frames from an earlier CI trace were inspected. Full visual sign-off and testing on real mobile devices remain outstanding.
- `npm audit --omit=dev`: zero reported runtime vulnerabilities at execution. The full audit reported a development-only `braces` advisory through the Next ESLint plugin's glob dependencies; the registry's latest braces release was still affected. Recheck the advisory and upgrade the tooling when a compatible fix is available. ESLint 9 remains selected because current transitive plugin peer constraints do not consistently accept ESLint 10.
- Lighthouse and real-user Core Web Vitals remain unmeasured. No score or traffic-capacity claim is made.

Subsequent documentation-only changes do not alter the verified application or tests.
