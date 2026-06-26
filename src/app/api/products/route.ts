import { NextResponse } from "next/server";
import { getProductsPage } from "@/server/queries";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const offset = Number(searchParams.get("offset") || 0) || 0;
  const take = Number(searchParams.get("take") || 9) || 9;

  const page = await getProductsPage({ q, category, offset, take });

  const res = NextResponse.json(page);
  // Cache the plain (non-search) browse pages at the edge; keep searches fresh.
  if (!q) res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return res;
}
