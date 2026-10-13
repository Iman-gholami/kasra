# Kasra Boutique · کسرا بوتیک

A Persian, RTL, frontend-only Next.js storefront prototype. No payments, SMS, authentication, order submissions, analytics, or production backend are connected.

## Run

Node.js 20.9+ is required (Node 22 is used in CI).

```bash
npm ci
npm run dev
# http://localhost:3000
```

```bash
npm run typecheck
npm run lint
npm run test:unit
npm run build
npm start
```

Browser tests target a production build:

```bash
npm run build
npx playwright install chromium
npm test
```

The Playwright configuration starts the production server. `npx playwright show-report` opens its report. CI installs browser system dependencies as well.

## Experience

- Editorial home, 36 mock products across شومیز / مانتو / تیشرت.
- Shared catalog/category/search implementation with server-side filtering, sorting, pagination and shareable query strings.
- Product variants with color/size stock, gallery enlargement, size guide, related products and wishlist controls.
- Persistent local cart and wishlist, variant-specific quantities and stock limits, subtotal/discount calculations, mini-cart.
- Iranian demo checkout with Persian/Arabic digit normalization, phone/postal validation, and session-only confirmation.
- About, contact, FAQ, provisional shipping/returns, size guide, demo account, loading/error/404 pages.
- Semantic RTL markup, native modal dialogs with Escape/focus handling, reduced-motion CSS, local font and images.

Prominent controls perform a local demo action or explicitly explain an unconnected integration. No real contact details, ratings, delivery guarantees or merchant policies are invented. Use sample personal information in checkout. Address fields stay in component memory; only a non-personal demo ID, total and item count enter sessionStorage. The cart and wishlist remain in localStorage until removed or browser data is cleared. When localStorage is unavailable, selections work in memory for that page session.

## Architecture

```
src/app/              App Router pages, metadata, mock read-only product endpoint
src/components/       UI and narrowly scoped client interactions
src/data/             Shared category configuration and deterministic 36-product fixtures
src/lib/catalog.ts    Server-side CatalogAdapter implementation
src/lib/store.ts      useSyncExternalStore cart/wishlist with stable SSR snapshot
src/lib/checkout.ts   Validation, independent from rendering
src/types/            Product, variant, query and adapter contracts
public/images/        Local hero photo and garment illustrations
tests/                Unit and production-browser tests
```

Pages and product grids are Server Components. Interactive islands receive only their necessary product data. The entire fixture catalog is not imported by browser components. `/api/products` is a mock catalog read adapter, not a production backend: search returns at most six suggestions; selected-ID retrieval is bounded to 100 IDs. Catalog pages render 12 products at a time on the server. There is no large client search index.

### Replace mock data

Implement `CatalogAdapter.list`, `.get`, and `.byIds` with production HTTP APIs. Translate existing query fields into backend filters and pagination; preserve variant-level availability matching. Add categories through configuration and the `CategorySlug` domain type. Use real per-product galleries, measurements and verified inventory before selling.

The demo cart stores a product snapshot for immediate offline display. A production checkout **must reprice and revalidate every line against authoritative inventory**, rather than trusting localStorage, and use idempotent server-side order creation. Prices here are integer Iranian Toman, not Rial. Format conversion belongs at the payment integration boundary.

### Design and assets

Warm neutral tokens, restrained rose accents, editorial spacing, native Persian typography, and responsive two-to-four-column product grids. Vazirmatn is self-hosted via `next/font/local` from the pinned npm dependency. Garment SVGs are original local **illustrative placeholders**, explicitly labeled on product pages; colors/gallery views are not accurate product photography. The hero is an inspirational stock image, not a Kasra product or endorsement. See [ASSETS.md](ASSETS.md).

### SEO and environment

All demo pages are `noindex, nofollow`, robots disallows all crawling, and the demo sitemap is intentionally empty. No invented canonical origin or commerce structured data is emitted. Before launch, configure a verified production origin with `metadataBase`, canonical product/category URLs and sitemap entries. Keep search/filter combinations and checkout/account out of the index unless an intentional indexation policy says otherwise. Emit product structured data only from verified product, price and inventory data.

## Verification

See [PERFORMANCE.md](PERFORMANCE.md) for executed checks, environment limitations and performance targets. The included GitHub Actions workflow runs type checking, lint, unit tests, production build and Playwright including axe checks and seven responsive widths. Included tests are not a claim that every browser or accessibility criterion has passed.

## Required before production

1. Product/category/search APIs, authoritative variant inventory, real images and sizing.
2. Pricing, promotions, shipping quotes, delivery coverage and confirmed merchant policies.
3. Secure order creation, payment provider integration and reconciliation (no card handling in this demo).
4. Authentication/OTP and customer account services if the business needs them.
5. Approved contact details, transactional notifications and consent-based newsletter service.
6. Verified metadata, security review, privacy/retention controls, real-device accessibility QA, deployment monitoring and real-user performance instrumentation.

The frontend alone does not guarantee any traffic capacity. Hosting, cache strategy, APIs, inventory and order services need independent load testing.
