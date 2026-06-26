import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, setSession } from "@/lib/auth";

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const b = await req.json();
    const name = String(b.name || "").trim();
    const phone = b.phone ? String(b.phone).trim() : null;
    if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
    const user = await prisma.user.update({ where: { id: session.id }, data: { name, phone } });
    // refresh session cookie so the header/name stays in sync
    await setSession({ id: user.id, email: user.email, name: user.name, role: user.role });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not update profile." }, { status: 400 });
  }
}
