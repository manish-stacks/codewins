import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";

const arr = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);
const num = (v: unknown, d = 0): number => (v == null || v === "" ? d : Number(v));

function buildData(b: Record<string, unknown>) {
  return {
    title: String(b.title || "").trim(),
    category: String(b.category || "Admin Template"),
    price: num(b.price),
    original: num(b.original),
    image: String(b.image || ""),
    gallery: arr(b.gallery),
    rating: num(b.rating, 5),
    sales: num(b.sales),
    tags: arr(b.tags),
    summary: String(b.summary || ""),
    features: arr(b.features),
    includes: arr(b.includes),
    demoUrl: b.demoUrl ? String(b.demoUrl) : null,
    downloadUrl: b.downloadUrl ? String(b.downloadUrl) : null,
    version: b.version ? String(b.version) : "v1",
    changelog: arr(b.changelog),
    seoTitle: b.seoTitle ? String(b.seoTitle) : null,
    seoDesc: b.seoDesc ? String(b.seoDesc) : null,
    featured: Boolean(b.featured),
    published: b.published === undefined ? true : Boolean(b.published),
    order: num(b.order),
  };
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const b = await req.json();
    if (!b.title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
    const slug = b.slug ? slugify(String(b.slug)) : slugify(String(b.title));
    const created = await prisma.product.create({ data: { slug, ...buildData(b) } });
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    const msg = (e as { code?: string }).code === "P2002" ? "A product with this slug already exists." : "Could not create product.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
