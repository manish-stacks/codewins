import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { id } = await params;
    const b = await req.json();
    const status = String(b.status || "");
    if (!STATUSES.includes(status)) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    await prisma.order.update({
      where: { id },
      data: { status: status as "PENDING" | "PAID" | "FAILED" | "REFUNDED", paidAt: status === "PAID" ? new Date() : undefined },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not update order." }, { status: 400 });
  }
}
