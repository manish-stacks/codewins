import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const b = await req.json();
    const key = String(b.key || "");
    if (!key) return NextResponse.json({ error: "Missing key." }, { status: 400 });
    const value = b.value;
    await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save settings." }, { status: 400 });
  }
}
