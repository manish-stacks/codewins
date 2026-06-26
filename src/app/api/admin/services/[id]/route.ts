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
      number: String(b.number || "01"),
      title: String(b.title || ""),
      description: String(b.description || ""),
      icon: String(b.icon || "code"),
      features: arr(b.features),
      longDescription: b.longDescription ? String(b.longDescription) : null,
      image: b.image ? String(b.image) : null,
      seoTitle: b.seoTitle ? String(b.seoTitle) : null,
      seoDesc: b.seoDesc ? String(b.seoDesc) : null,
      published: Boolean(b.published),
      order: num(b.order),
    };
    await prisma.service.update({ where: { id }, data });
    revalidatePath("/services");
    revalidatePath("/admin/services");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not update service." }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { id } = await params;
    await prisma.service.delete({ where: { id } });
    revalidatePath("/services");
    revalidatePath("/admin/services");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete service." }, { status: 400 });
  }
}
