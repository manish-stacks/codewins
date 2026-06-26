import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";

const arr = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);
const num = (v: unknown, d = 0): number => (v == null || v === "" ? d : Number(v));

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { id } = await params;
    const b = await req.json();
    const data = {
      ...(b.slug ? { slug: slugify(String(b.slug)) } : {}),
      title: String(b.title || ""),
      category: String(b.category || ""),
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
      published: Boolean(b.published),
      order: num(b.order),
    };
    await prisma.product.update({ where: { id }, data });
    revalidatePath("/products");
    revalidatePath(`/products/${data.slug || ""}`);
    revalidatePath("/admin/products");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not update product." }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete (it may be referenced by an order)." }, { status: 400 });
  }
}
