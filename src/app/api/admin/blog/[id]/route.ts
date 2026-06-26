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
      excerpt: String(b.excerpt || ""),
      content: String(b.content || ""),
      cover: String(b.cover || ""),
      author: b.author ? String(b.author) : "CodeWins",
      tags: arr(b.tags),
      readTime: num(b.readTime, 4),
      seoTitle: b.seoTitle ? String(b.seoTitle) : null,
      seoDesc: b.seoDesc ? String(b.seoDesc) : null,
      published: Boolean(b.published),
    };
    await prisma.blogPost.update({ where: { id }, data });
    revalidatePath("/news");
    revalidatePath("/admin/blog");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not update post." }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { id } = await params;
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/news");
    revalidatePath("/admin/blog");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete post." }, { status: 400 });
  }
}
