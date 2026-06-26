import { prisma } from "@/lib/prisma";

export interface CouponResult {
  ok: boolean;
  error?: string;
  discount: number;
  code?: string;
  couponId?: string;
}

/** Validates a coupon against a subtotal (INR). Pass userId to enforce per-user limit. */
export async function validateCoupon(rawCode: string, subtotal: number, userId?: string): Promise<CouponResult> {
  const code = (rawCode || "").trim().toUpperCase();
  if (!code) return { ok: false, error: "Enter a coupon code.", discount: 0 };

  const c = await prisma.coupon.findUnique({ where: { code } });
  if (!c || !c.active) return { ok: false, error: "Invalid or inactive coupon.", discount: 0 };

  const now = new Date();
  if (c.startsAt && c.startsAt > now) return { ok: false, error: "This coupon isn't active yet.", discount: 0 };
  if (c.expiresAt && c.expiresAt < now) return { ok: false, error: "This coupon has expired.", discount: 0 };
  if (subtotal < c.minSubtotal) return { ok: false, error: `Minimum order of ₹${c.minSubtotal} required.`, discount: 0 };
  if (c.usageLimit != null && c.usedCount >= c.usageLimit) return { ok: false, error: "This coupon has reached its usage limit.", discount: 0 };

  if (userId) {
    const used = await prisma.couponRedemption.count({ where: { couponId: c.id, userId } });
    if (used >= c.perUserLimit) return { ok: false, error: "You've already used this coupon.", discount: 0 };
  }

  let discount = c.type === "PERCENT" ? Math.round((subtotal * c.value) / 100) : c.value;
  if (c.maxDiscount != null) discount = Math.min(discount, c.maxDiscount);
  discount = Math.min(discount, subtotal);

  return { ok: true, discount, code: c.code, couponId: c.id };
}
