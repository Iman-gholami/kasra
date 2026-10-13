import Link from "next/link";
import { SlidersHorizontal, ArrowLeft, ArrowRight } from "lucide-react";
import { categories, colors } from "@/data/categories";
import { catalog } from "@/lib/catalog";
import { digits } from "@/lib/format";
import type { CatalogQuery } from "@/types/catalog";
import { ProductGrid } from "./product-card";
export async function CatalogView({
  query,
  title = "همه محصولات",
  subtitle = "چیزهایی که دوست داری، برای هر روزت.",
  base = "/shop",
  lockedCategory,
}: {
  query: CatalogQuery;
  title?: string;
  subtitle?: string;
  base?: string;
  lockedCategory?: string;
}) {
  const effective = { ...query, category: lockedCategory || query.category };
  const result = await catalog.list(effective);
  const url = (patch: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    Object.entries({ ...query, ...patch }).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return `${base}?${params}`;
  };
  const active = Object.entries(query).filter(
    ([k, v]) =>
      v &&
      !["page", "sort"].includes(k) &&
      !(lockedCategory && k === "category"),
  );
  const labels: Record<string, string> = {
    category: "دسته",
    q: "جست‌وجو",
    size: "سایز",
    color: "رنگ",
    min: "از قیمت",
    max: "تا قیمت",
    available: "فقط موجود",
    sale: "تخفیف‌دار",
  };
  const display = (key: string, value: string) =>
    key === "category"
      ? categories.find((c) => c.slug === value)?.name || value
      : key === "color"
        ? colors.find((c) => c.id === value)?.name || value
        : ["sale", "available"].includes(key)
          ? ""
          : value;
  return (
    <div className="container catalog">
      <nav className="breadcrumb" aria-label="مسیر صفحه">
        <Link href="/">خانه</Link>
        <span>/</span>
        <span>{title}</span>
      </nav>
      <div className="page-heading">
        <div>
          <span className="eyebrow">THE EVERYDAY EDIT</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <span>{digits(result.total)} محصول نمونه</span>
      </div>
      <div className="category-tabs">
        <Link className={!effective.category ? "active" : ""} href="/shop">
          همه
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            className={effective.category === c.slug ? "active" : ""}
            href={`/category/${c.slug}`}
          >
            {c.name}
          </Link>
        ))}
      </div>
      <details className="filters">
        <summary>
          <SlidersHorizontal size={18} /> فیلتر و مرتب‌سازی{" "}
          <span>{active.length ? `(${digits(active.length)})` : ""}</span>
        </summary>
        <form action={base} className="filter-form">
          <label>
            جست‌وجو
            <input name="q" defaultValue={query.q} placeholder="نام لباس…" />
          </label>
          {!lockedCategory && (
            <label>
              دسته‌بندی
              <select name="category" defaultValue={query.category || ""}>
                <option value="">همه دسته‌ها</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            سایز
            <select name="size" defaultValue={query.size || ""}>
              <option value="">همه سایزها</option>
              {["S", "M", "L", "XL"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            رنگ
            <select name="color" defaultValue={query.color || ""}>
              <option value="">همه رنگ‌ها</option>
              {colors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            از قیمت (تومان)
            <input
              name="min"
              inputMode="numeric"
              defaultValue={query.min}
              placeholder="۰"
            />
          </label>
          <label>
            تا قیمت (تومان)
            <input
              name="max"
              inputMode="numeric"
              defaultValue={query.max}
              placeholder="بدون محدودیت"
            />
          </label>
          <label>
            مرتب‌سازی
            <select name="sort" defaultValue={query.sort || "newest"}>
              <option value="newest">جدیدترین</option>
              <option value="price-asc">قیمت: کم به زیاد</option>
              <option value="price-desc">قیمت: زیاد به کم</option>
              <option value="featured">منتخب کسرا</option>
            </select>
          </label>
          <div className="filter-checks">
            <label>
              <input
                type="checkbox"
                name="available"
                value="1"
                defaultChecked={!!query.available}
              />{" "}
              فقط موجود
            </label>
            <label>
              <input
                type="checkbox"
                name="sale"
                value="1"
                defaultChecked={!!query.sale}
              />{" "}
              تخفیف‌دار
            </label>
          </div>
          <button className="button">اعمال فیلترها</button>
          <Link className="text-link" href={base}>
            پاک کردن همه
          </Link>
        </form>
      </details>
      {active.length > 0 && (
        <div className="chips active-filters">
          {active.map(([key, value]) => (
            <Link
              className="chip"
              aria-label={`حذف فیلتر ${labels[key] || key}`}
              key={key}
              href={url({ [key]: undefined, page: undefined })}
            >
              {labels[key] || key} {display(key, value!)} ×
            </Link>
          ))}
        </div>
      )}
      {result.total ? (
        <ProductGrid products={result.products} />
      ) : (
        <div className="empty">
          <h2>هنوز چیزی پیدا نکردیم</h2>
          <p>نام دیگری امتحان کن یا فیلترها را کمتر کن.</p>
          <Link className="button" href={base}>
            دیدن همه محصولات
          </Link>
        </div>
      )}
      <nav className="pagination" aria-label="صفحه‌بندی">
        {result.page > 1 && (
          <Link className="chip" href={url({ page: String(result.page - 1) })}>
            <ArrowRight size={16} /> قبلی
          </Link>
        )}
        <span>
          صفحه {digits(result.page)} از {digits(result.pages)}
        </span>
        {result.page < result.pages && (
          <Link className="chip" href={url({ page: String(result.page + 1) })}>
            بعدی <ArrowLeft size={16} />
          </Link>
        )}
      </nav>
    </div>
  );
}
