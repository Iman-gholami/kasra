# Verification and performance report

## Scope and targets

Frontend prototype with mock inventory and illustrated product placeholders. Lab scores do not establish traffic capacity or real-user performance. Target: mobile Lighthouse Performance >=90. Field targets, only when sufficient real-user data exists: p75 LCP <=2.5s, INP <=200ms, CLS <=0.1.

## Reproduce the lab run

Use Node >=22.19, run `npm ci`, `npm run build`, `npx playwright install --with-deps chromium`, then `npm run audit:lab`. Port 3000 must be free. The script starts and stops the production server and measures `/`, `/shop`, and `/product/shomiz-1` three times each. It writes raw Lighthouse JSON/HTML, environment details, medians, and desktop/mobile screenshots under `audit-results/`. CI uploads them as `storefront-audit` artifacts for 14 days.

Lighthouse 13.5.0; mobile simulated throttling; 412×823 emulation at DPR 1.75; 150ms RTT, 1638.4 Kbps throughput, 4× CPU slowdown. Each sample launches a fresh Chrome process with Lighthouse storage reset enabled. The origin and image-optimization caches can be warm from preceding checks. These are local-origin CI lab measurements, not an internet-hosted production test. No lab TBT value is presented as INP.

## Baseline measured 2026-10-13

[CI run 38386767442](https://github.com/Iman-gholami/kasra/actions/runs/38386767442), source `1a2ad58056880798e03cf1f52bb3e419ba68a3e8`. Ubuntu runner, Node 22.23.3, Headless Chrome 156, Intel Xeon Platinum 8573C, 4 logical CPUs, approximately 16 GB RAM. Medians of three samples:

| Page | Performance | Accessibility | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|
| Home | 99 | 100 | 2.060s | 0.000 | 80ms |
| Shop | 95 | 98 | 2.802s | 0.036 | 78ms |
| Product | 96 | 100 | 2.725s | 0.036 | 91ms |

Raw sample metrics and environment are preserved in `docs/performance/baseline-2026-10-13.json` and `baseline-environment.json`.

## Findings addressed

- Lighthouse identified lazy loading and missing priority on the catalog LCP image. Only the first catalog image is now preloaded at high priority; below-the-fold cards stay lazy. The main product image also has explicit high fetch priority.
- The catalog/wishlist headings now have an accessible section heading between the page title and product headings.
- The logo's accessible name includes its visible brand text.
- Screenshot review found that mobile sticky purchase controls could cover product information. They now follow the variant controls in normal document flow, with a geometry regression test.
- Checkout line quantities now use Persian numerals.

## Verification history and limits

The original storefront passed strict TypeScript, ESLint, nine unit tests, production build and sixteen Chromium Playwright tests. Checks include search/filter/sort URLs, variant inventory, cart totals/persistence, wishlist, checkout validation/confirmation, keyboard/modal focus, supporting routes and seven overflow widths (320/375/390/430/768/1024/1440). The follow-up adds a seventeenth test for mobile purchase placement.

Automated axe and Lighthouse checks cover selected states; passing them is not a full WCAG 2.2 certification. Desktop/mobile screenshots of the home, catalog, product, cart and checkout are reviewed, but real-device and assistive-technology testing remains outstanding. Rerun performance after replacing the inexpensive SVG placeholders with real photography.

Local production builds were blocked by the execution sandbox's `uv_resident_set_memory` limitation; production compilation and browser execution were verified on GitHub-hosted runners. The 2026-10-13 runtime-only dependency audit reported zero vulnerabilities. Its full audit reported a development-only braces advisory through the Next ESLint plugin; recheck dependencies before release. No payment, real inventory or order backend has been tested because those integrations do not exist in this prototype.

## Follow-up results

[CI run 39199228829](https://github.com/Iman-gholami/kasra/actions/runs/39199228829) completed successfully on 2026-10-19 for source branch revision `40dbd914a3844e520bab0c119246d5523609c7a8` (GitHub PR test merge `21167f14c325a9d9bac8d9cb39680a03959c1ddc`). TypeScript, ESLint, nine unit tests, production build and all seventeen Playwright tests passed.

| Page | Performance | Accessibility | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|
| Home | 96 | 100 | 2.682s | 0.000 | 95ms |
| Shop | 96 | 100 | 2.601s | 0.036 | 95ms |
| Product | 96 | 100 | 2.668s | 0.036 | 93ms |

Medians of three samples. The follow-up runner used an AMD EPYC 9V74 CPU (4 logical CPUs, approximately 16 GB RAM); Node, Chrome, Lighthouse and throttling settings match the baseline. Different runner hardware and sample variability prevent attributing metric differences solely to the code changes. All three pages meet the >=90 Lighthouse performance target; median lab LCP remains above 2.5s and does not demonstrate the field LCP target. Catalog accessibility increased from 98 to 100.

The final mobile product screenshot was reviewed: title, variants and purchase controls are visible in normal document order with no overlapping sticky bar. Raw metrics are preserved in `docs/performance/final-2026-10-19.json`, with execution details in `final-environment.json`. Full HTML reports and screenshots are in the run's `storefront-audit` artifact (expires 2026-11-02). Subsequent documentation-only commits do not change the measured application source.
