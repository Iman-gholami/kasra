# Asset sources

- `public/images/editorial.webp`: inspirational fashion photo from https://images.unsplash.com/photo-1539109136881-3be0616acf4b ; downloaded locally at 1100px wide, quality 70, WebP. Usage basis: Unsplash License, https://unsplash.com/license (checked 2026-10-13). It illustrates an editorial mood, not actual merchandise or a brand endorsement.
- `public/images/{shomiz,manto,tshirt}-{1,2,3,4}.svg`: original garment placeholder illustrations created for this prototype. Replace with licensed photos per SKU and per color before sale; preserve aspect ratios and meaningful Persian alt text.
- Vazirmatn: self-hosted variable Arabic-subset WOFF2 supplied by `@fontsource-variable/vazirmatn`; SIL Open Font License. Package includes license text. Loaded through `next/font/local`; no browser calls to a font provider.
- Icons: `lucide-react`, ISC license, imported individually.

No remote image host is needed at runtime. Next Image handles raster responsive output; local SVG placeholders retain their native scalable form.
