import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const phone = body.phone ? String(body.phone).trim() : null;

    if (!name || !email || !password)
      return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    if (password.length < 6)
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });

    const user = await prisma.user.create({
      data: { name, email, phone, passwordHash: await hashPassword(password), role: "USER" },
    });

    await setSession({ id: user.id, email: user.email, name: user.name, role: user.role });
    return NextResponse.json({ ok: true, role: user.role });
  } catch (e) {
    console.error("[api/auth/register]", e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
