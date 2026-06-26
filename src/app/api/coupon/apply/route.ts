import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/coupon";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();
    const session = await getSession();
    const result = await validateCoupon(String(code || ""), Number(subtotal || 0), session?.id);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true, discount: result.discount, code: result.code });
  } catch (e) {
    console.error("[api/coupon/apply]", e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
