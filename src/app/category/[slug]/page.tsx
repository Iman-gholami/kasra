import { notFound } from "next/navigation";
import { categories } from "@/data/categories";
import { CatalogView } from "@/components/catalog-view";
import { queryFrom } from "@/lib/catalog";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = categories.find((c) => c.slug === slug);
  return { title: c?.name || "دسته پیدا نشد", description: c?.subtitle };
}
export default async function Category({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const c = categories.find((c) => c.slug === slug);
  if (!c) notFound();
  return (
    <CatalogView
      title={c.name}
      subtitle={c.subtitle}
      base={`/category/${slug}`}
      lockedCategory={slug}
      query={queryFrom(await searchParams)}
    />
  );
}
