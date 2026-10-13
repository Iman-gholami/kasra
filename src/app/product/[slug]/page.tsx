import { notFound } from "next/navigation";
import Link from "next/link";
import { catalog } from "@/lib/catalog";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { ProductDetail } from "@/components/product-detail";
import { ProductGrid } from "@/components/product-card";
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await catalog.get((await params).slug);
  return { title: p?.name || "محصول پیدا نشد", description: p?.description };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await catalog.get((await params).slug);
  if (!p) notFound();
  const related = await catalog.list({ category: p.category });
  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="مسیر صفحه">
        <Link href="/">خانه</Link>
        <span>/</span>
        <Link href={`/category/${p.category}`}>
          {categories.find((c) => c.slug === p.category)?.name}
        </Link>
        <span>/</span>
        <span>{p.name}</span>
      </nav>
      <ProductDetail product={p} />
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">YOU MIGHT ALSO LOVE</span>
            <h2>شاید این‌ها هم سلیقه تو باشن</h2>
          </div>
        </div>
        <ProductGrid
          products={related.products.filter((r) => r.id !== p.id).slice(0, 4)}
        />
      </section>
    </div>
  );
}
