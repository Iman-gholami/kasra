import { CatalogView } from "@/components/catalog-view";
import { queryFrom } from "@/lib/catalog";
export const metadata = {
  title: "جست‌وجو",
  robots: { index: false, follow: false },
};
export default async function Search({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = queryFrom(await searchParams);
  return (
    <CatalogView
      title={q.q ? `نتیجه جست‌وجوی «${q.q}»` : "دنبال چی می‌گردی؟"}
      subtitle="با نام لباس، جنس یا سبک دلخواهت جست‌وجو کن."
      base="/search"
      query={q}
    />
  );
}
