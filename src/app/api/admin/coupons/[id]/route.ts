import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const num = (v: unknown, d = 0): number => (v == null || v === "" ? d : Number(v));
const numOrNull = (v: unknown): number | null => (v == null || v === "" ? null : Number(v));

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { id } = await params;
    const b = await req.json();
    const data = {
      ...(b.code ? { code: String(b.code).trim().toUpperCase() } : {}),
      type: (String(b.type) === "FLAT" ? "FLAT" : "PERCENT") as "PERCENT" | "FLAT",
      value: num(b.value),
      minSubtotal: num(b.minSubtotal),
      maxDiscount: numOrNull(b.maxDiscount),
      usageLimit: numOrNull(b.usageLimit),
      perUserLimit: num(b.perUserLimit, 1),
      active: Boolean(b.active),
    };
    await prisma.coupon.update({ where: { id }, data });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not update coupon." }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { id } = await params;
    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete coupon." }, { status: 400 });
  }
}
