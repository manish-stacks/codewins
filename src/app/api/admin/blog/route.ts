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
    category: String(b.category || "Insights"),
    excerpt: String(b.excerpt || ""),
    content: String(b.content || ""),
    cover: String(b.cover || ""),
    author: b.author ? String(b.author) : "CodeWins",
    tags: arr(b.tags),
    readTime: num(b.readTime, 4),
    seoTitle: b.seoTitle ? String(b.seoTitle) : null,
    seoDesc: b.seoDesc ? String(b.seoDesc) : null,
    published: b.published === undefined ? true : Boolean(b.published),
  };
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const b = await req.json();
    if (!b.title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
    const slug = b.slug ? slugify(String(b.slug)) : slugify(String(b.title));
    const created = await prisma.blogPost.create({ data: { slug, ...buildData(b) } });
    revalidatePath("/news");
    revalidatePath("/admin/blog");
    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    const msg = (e as { code?: string }).code === "P2002" ? "A post with this slug already exists." : "Could not create post.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
