import { CatalogView } from "@/components/catalog-view";
import { queryFrom } from "@/lib/catalog";
export const metadata = { title: "همه محصولات" };
export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <CatalogView query={queryFrom(await searchParams)} />;
}
