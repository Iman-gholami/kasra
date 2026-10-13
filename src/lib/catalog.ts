import { products } from "@/data/products";
import { normalize, latinDigits } from "./format";
import type { CatalogAdapter, CatalogQuery } from "@/types/catalog";
export const PAGE_SIZE = 12;
const amount = (value: string | undefined, fallback: number) => {
  const n = Number(latinDigits(value || ""));
  return value && Number.isFinite(n) ? Math.max(0, n) : fallback;
};
// Server-side adapter. Replace these methods with an HTTP client when a backend exists.
export const catalog: CatalogAdapter = {
  async list(query: CatalogQuery) {
    let items = products.filter(
      (p) =>
        (!query.category || p.category === query.category) &&
        (!query.q ||
          normalize(p.name + " " + p.description).includes(
            normalize(query.q),
          )) &&
        p.price >= amount(query.min, 0) &&
        p.price <= amount(query.max, Infinity) &&
        (!query.sale || !!p.compareAt) &&
        p.variants.some(
          (v) =>
            (!query.size || v.size === query.size) &&
            (!query.color || v.color === query.color) &&
            (!query.available || v.stock > 0),
        ),
    );
    items = [...items].sort((a, b) =>
      query.sort === "price-asc"
        ? a.price - b.price
        : query.sort === "price-desc"
          ? b.price - a.price
          : query.sort === "featured"
            ? Number(b.featured) - Number(a.featured) ||
              b.createdAt.localeCompare(a.createdAt)
            : b.createdAt.localeCompare(a.createdAt),
    );
    const total = items.length,
      pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const page = Math.min(
      pages,
      Math.max(1, Math.floor(amount(query.page, 1))),
    );
    return {
      products: items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      total,
      page,
      pages,
    };
  },
  async get(slug) {
    return products.find((p) => p.slug === slug);
  },
  async byIds(ids) {
    return products.filter((p) => ids.slice(0, 100).includes(p.id));
  },
};
export function queryFrom(
  params: Record<string, string | string[] | undefined>,
): CatalogQuery {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => typeof v === "string"),
  ) as CatalogQuery;
}
