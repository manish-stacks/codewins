import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const source = body.source ? String(body.source) : "footer";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    // Idempotent — subscribing twice just re-activates, never errors.
    await prisma.subscriber.upsert({
      where: { email },
      create: { email, source },
      update: { active: true },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/subscribe]", e);
    return NextResponse.json({ error: "Could not subscribe. Please try again." }, { status: 500 });
  }
}
