import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const num = (v: unknown, d = 0): number => (v == null || v === "" ? d : Number(v));
const numOrNull = (v: unknown): number | null => (v == null || v === "" ? null : Number(v));

function buildData(b: Record<string, unknown>) {
  return {
    type: (String(b.type) === "FLAT" ? "FLAT" : "PERCENT") as "PERCENT" | "FLAT",
    value: num(b.value),
    minSubtotal: num(b.minSubtotal),
    maxDiscount: numOrNull(b.maxDiscount),
    usageLimit: numOrNull(b.usageLimit),
    perUserLimit: num(b.perUserLimit, 1),
    active: b.active === undefined ? true : Boolean(b.active),
  };
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const b = await req.json();
    const code = String(b.code || "").trim().toUpperCase();
    if (!code) return NextResponse.json({ error: "Code is required." }, { status: 400 });
    const created = await prisma.coupon.create({ data: { code, ...buildData(b) } });
    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    const msg = (e as { code?: string }).code === "P2002" ? "This coupon code already exists." : "Could not create coupon.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
