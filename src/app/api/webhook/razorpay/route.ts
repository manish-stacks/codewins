import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { finalizePaidOrder } from "@/lib/orders";

export async function POST(req: Request) {
  try {
    const raw = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";
    if (!verifyWebhookSignature(raw, signature))
      return NextResponse.json({ error: "Invalid signature." }, { status: 400 });

    const event = JSON.parse(raw);
    const type = event?.event as string | undefined;

    if (type === "payment.captured" || type === "order.paid") {
      const payment = event?.payload?.payment?.entity;
      const order = event?.payload?.order?.entity;
      const rzpOrderId = payment?.order_id || order?.id;
      const paymentId = payment?.id || "webhook";
      if (rzpOrderId) await finalizePaidOrder(rzpOrderId, paymentId);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/webhook/razorpay]", e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
