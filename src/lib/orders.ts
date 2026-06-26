import { prisma } from "@/lib/prisma";

/**
 * Atomically marks an order PAID exactly once. Returns true only for the caller
 * that won the race (so coupon redemption / side-effects run a single time),
 * preventing double-processing between the frontend verify and the webhook.
 */
export async function finalizePaidOrder(
  razorpayOrderId: string,
  paymentId: string,
  signature?: string
): Promise<boolean> {
  const res = await prisma.order.updateMany({
    where: { razorpayOrderId, confirmationSent: false },
    data: {
      status: "PAID",
      confirmationSent: true,
      paidAt: new Date(),
      razorpayPaymentId: paymentId,
      razorpaySignature: signature ?? undefined,
    },
  });
  if (res.count !== 1) return false; // already finalized by the other path

  const order = await prisma.order.findFirst({ where: { razorpayOrderId } });
  if (order?.couponId) {
    await prisma.$transaction([
      prisma.coupon.update({ where: { id: order.couponId }, data: { usedCount: { increment: 1 } } }),
      prisma.couponRedemption.create({ data: { couponId: order.couponId, userId: order.userId, orderId: order.id } }),
    ]);
  }
  return true;
}
