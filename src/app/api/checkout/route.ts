import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { validateCoupon } from "@/lib/coupon";
import { getRazorpay, genOrderNumber } from "@/lib/razorpay";

interface IncomingItem { productId: string; qty: number }

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Please log in to continue." }, { status: 401 });

    const body = await req.json();
    const incoming: IncomingItem[] = Array.isArray(body.items) ? body.items : [];
    if (incoming.length === 0) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });

    // Authoritative pricing from DB — never trust client prices.
    const ids = incoming.map((i) => String(i.productId));
    const products = await prisma.product.findMany({ where: { id: { in: ids }, published: true } });
    if (products.length === 0) return NextResponse.json({ error: "Products not available." }, { status: 400 });

    const lineItems = products.map((p) => {
      const qty = Math.max(1, Number(incoming.find((i) => i.productId === p.id)?.qty || 1));
      return { product: p, qty };
    });
    const subtotal = lineItems.reduce((s, li) => s + li.product.price * li.qty, 0);

    // Coupon (server-side, authoritative)
    let discount = 0;
    let couponId: string | undefined;
    let couponCode: string | undefined;
    if (body.couponCode) {
      const c = await validateCoupon(String(body.couponCode), subtotal, session.id);
      if (!c.ok) return NextResponse.json({ error: c.error }, { status: 400 });
      discount = c.discount;
      couponId = c.couponId;
      couponCode = c.code;
    }

    const total = Math.max(0, subtotal - discount);
    const user = await prisma.user.findUnique({ where: { id: session.id } });
    const orderNumber = genOrderNumber();

    // Free order (100% off) — no gateway needed, mark paid immediately.
    if (total <= 0) {
      const order = await prisma.order.create({
        data: {
          orderNumber, userId: session.id, status: "PAID", confirmationSent: true, paidAt: new Date(),
          customerName: user?.name || session.name, customerEmail: user?.email || session.email, customerPhone: user?.phone ?? null,
          subtotal, discount, total, couponId, couponCode,
          items: { create: lineItems.map((li) => ({ productId: li.product.id, title: li.product.title, image: li.product.image, price: li.product.price, qty: li.qty, purchasedVersion: li.product.version })) },
        },
      });
      if (couponId) {
        await prisma.$transaction([
          prisma.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } }),
          prisma.couponRedemption.create({ data: { couponId, userId: session.id, orderId: order.id } }),
        ]);
      }
      return NextResponse.json({ ok: true, code: "FREE", orderNumber });
    }

    // Razorpay
    const rzp = getRazorpay();
    if (!rzp) return NextResponse.json({ code: "NO_GATEWAY", error: "Payment gateway not configured." }, { status: 503 });

    const rzpOrder = await rzp.orders.create({
      amount: total * 100, // paise
      currency: "INR",
      receipt: orderNumber,
      notes: { orderNumber, userId: session.id },
    });

    await prisma.order.create({
      data: {
        orderNumber, userId: session.id, status: "PENDING",
        customerName: user?.name || session.name, customerEmail: user?.email || session.email, customerPhone: user?.phone ?? null,
        subtotal, discount, total, couponId, couponCode,
        razorpayOrderId: rzpOrder.id,
        items: { create: lineItems.map((li) => ({ productId: li.product.id, title: li.product.title, image: li.product.image, price: li.product.price, qty: li.qty, purchasedVersion: li.product.version })) },
      },
    });

    return NextResponse.json({
      ok: true,
      key: process.env.RAZORPAY_KEY_ID,
      amount: total * 100,
      currency: "INR",
      razorpayOrderId: rzpOrder.id,
      orderNumber,
      prefill: { name: user?.name, email: user?.email, contact: user?.phone ?? "" },
    });
  } catch (e) {
    console.error("[api/checkout]", e);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
