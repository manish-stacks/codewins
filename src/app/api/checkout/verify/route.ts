import { NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { finalizePaidOrder } from "@/lib/orders";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
      return NextResponse.json({ error: "Missing payment details." }, { status: 400 });

    if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature))
      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });

    await finalizePaidOrder(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/checkout/verify]", e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
