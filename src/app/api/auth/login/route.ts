import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password)
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.passwordHash)))
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

    await setSession({ id: user.id, email: user.email, name: user.name, role: user.role });
    return NextResponse.json({ ok: true, role: user.role });
  } catch (e) {
    console.error("[api/auth/login]", e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
