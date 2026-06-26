import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";

const arr = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);
const num = (v: unknown, d = 0): number => (v == null || v === "" ? d : Number(v));



function buildData(b: Record<string, unknown>) {
  return {
    number: String(b.number || "01"),
    title: String(b.title || "").trim(),
    description: String(b.description || ""),
    icon: String(b.icon || "code"),
    features: arr(b.features),
    longDescription: b.longDescription ? String(b.longDescription) : null,
    image: b.image ? String(b.image) : null,
    seoTitle: b.seoTitle ? String(b.seoTitle) : null,
    seoDesc: b.seoDesc ? String(b.seoDesc) : null,
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
    const created = await prisma.service.create({ data: { slug, ...buildData(b) } });
    revalidatePath("/services");
    revalidatePath("/admin/services");
    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    const msg = (e as { code?: string }).code === "P2002" ? "A service with this slug already exists." : "Could not create service.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
