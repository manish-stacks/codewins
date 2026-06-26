import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";

const arr = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);
const num = (v: unknown, d = 0): number => (v == null || v === "" ? d : Number(v));
const desc = (v: unknown): string | string[] => (typeof v === "string" ? v : Array.isArray(v) ? v.map(String) : []);



export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { id } = await params;
    const b = await req.json();
    const data = {
      ...(b.slug ? { slug: slugify(String(b.slug)) } : {}),
      name: String(b.name || ""),
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
      published: Boolean(b.published),
      order: num(b.order),
    };
    await prisma.project.update({ where: { id }, data });
    revalidatePath("/portfolio");
    revalidatePath("/admin/projects");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not update project." }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    revalidatePath("/portfolio");
    revalidatePath("/admin/projects");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete project." }, { status: 400 });
  }
}
