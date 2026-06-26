import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";

const arr = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);
const num = (v: unknown, d = 0): number => (v == null || v === "" ? d : Number(v));
const desc = (v: unknown): string | string[] => (typeof v === "string" ? v : Array.isArray(v) ? v.map(String) : []);



function buildData(b: Record<string, unknown>) {
  return {
    name: String(b.name || "").trim(),
    client: String(b.client || ""),
    category: String(b.category || ""),
    year: String(b.year || ""),
    location: String(b.location || ""),
    industry: String(b.industry || ""),
    scope: String(b.scope || ""),
    url: String(b.url || ""),
    summary: String(b.summary || ""),
    description: desc(b.description),
    cover: String(b.cover || ""),
    gallery: arr(b.gallery),
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
    if (!b.name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
    const slug = b.slug ? slugify(String(b.slug)) : slugify(String(b.name));
    const created = await prisma.project.create({ data: { slug, ...buildData(b) } });
    revalidatePath("/portfolio");
    revalidatePath("/admin/projects");
    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    const msg = (e as { code?: string }).code === "P2002" ? "A project with this slug already exists." : "Could not create project.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
