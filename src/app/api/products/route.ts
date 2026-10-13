import { NextRequest, NextResponse } from "next/server";
import { catalog, queryFrom } from "@/lib/catalog";
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const ids = params.get("ids");
  if (ids)
    return NextResponse.json({
      products: await catalog.byIds(ids.split(",").slice(0, 100)),
    });
  const result = await catalog.list(queryFrom(Object.fromEntries(params)));
  return NextResponse.json({
    ...result,
    products: result.products.slice(0, 6),
  });
}
