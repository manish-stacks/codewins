"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, Tag, Loader2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function CheckoutPage() {
  const { items, remove, setQty, subtotal, clear, ready } = useCart();
  const router = useRouter();

  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [couponErr, setCouponErr] = useState("");
  const [applying, setApplying] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const total = Math.max(0, subtotal - discount);

  async function applyCoupon() {
    setApplying(true);
    setCouponErr("");
    setCouponMsg("");
    try {
      const res = await fetch("/api/coupon/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDiscount(0);
        setAppliedCode("");
        throw new Error(data.error || "Invalid coupon");
      }
      setDiscount(data.discount);
      setAppliedCode(data.code);
      setCouponMsg(`Coupon ${data.code} applied — you save ₹${data.discount}.`);
    } catch (err) {
      setCouponErr((err as Error).message);
    } finally {
      setApplying(false);
    }
  }

  function removeCoupon() {
    setDiscount(0);
    setAppliedCode("");
    setCode("");
    setCouponMsg("");
    setCouponErr("");
  }

  async function pay() {
    setPaying(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map((i) => ({ productId: i.productId, qty: i.qty })), couponCode: appliedCode || undefined }),
      });

      if (res.status === 401) {
        router.push("/login?next=/checkout");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      if (data.code === "FREE") {
        clear();
        router.push(`/checkout/success?order=${data.orderNumber}`);
        return;
      }

      const ok = await loadRazorpayScript();
      if (!ok) {
        setError("Could not load the payment window. Check your connection.");
        return;
      }

      const rzp = new window.Razorpay({
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "CodeWins Technologies",
        description: `Order ${data.orderNumber}`,
        order_id: data.razorpayOrderId,
        prefill: data.prefill,
        theme: { color: "#d1312e" },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const v = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resp),
          });
          if (v.ok) {
            clear();
            router.push(`/checkout/success?order=${data.orderNumber}`);
          } else {
            setError("Payment captured but verification failed. We'll sort it out — check your orders shortly.");
          }
        },
      });
      rzp.open();
    } catch {
      setError("Could not start payment. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center pt-[120px]"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>;
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto flex min-h-screen max-w-frame flex-col items-center justify-center px-6 pt-[120px] text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Your cart is empty</h1>
        <p className="mt-3 text-secondary">Browse the marketplace and add a template to get started.</p>
        <Link href="/products" className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent-dark">Browse products</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-frame px-6 pb-section pt-[140px] md:pt-[170px] lg:px-12">
      <h1 className="font-display text-display font-extrabold text-ink">Checkout</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        {/* Items */}
        <div className="lg:col-span-7">
          <div className="divide-y divide-line rounded-card-lg border border-line">
            {items.map((it) => (
              <div key={it.productId} className="flex gap-4 p-5">
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-surface">
                  <Image src={it.image} alt={it.title} fill sizes="112px" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/products/${it.slug}`} className="font-display text-[15px] font-semibold text-ink hover:text-accent">{it.title}</Link>
                    <button onClick={() => remove(it.productId)} className="text-secondary transition-colors hover:text-accent"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-line">
                      <button onClick={() => setQty(it.productId, it.qty - 1)} className="px-3 py-1.5 text-secondary hover:text-ink"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="min-w-8 text-center text-sm font-medium text-ink">{it.qty}</span>
                      <button onClick={() => setQty(it.productId, it.qty + 1)} className="px-3 py-1.5 text-secondary hover:text-ink"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <span className="font-display text-lg font-semibold text-ink">₹{it.price * it.qty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-5">
          <div className="rounded-card-lg border border-line bg-surface p-6 lg:p-8">
            <h2 className="font-display text-xl font-semibold text-ink">Order summary</h2>

            {/* Coupon */}
            <div className="mt-6">
              {appliedCode ? (
                <div className="flex items-center justify-between rounded-2xl border border-accent/30 bg-accent/[0.04] px-4 py-3">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-ink"><Tag className="h-4 w-4 text-accent" /> {appliedCode}</span>
                  <button onClick={removeCoupon} className="text-xs text-secondary hover:text-accent">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Coupon code"
                    className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent"
                  />
                  <button onClick={applyCoupon} disabled={applying || !code} className="shrink-0 rounded-2xl bg-ink px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-carbon disabled:opacity-50">
                    {applying ? "…" : "Apply"}
                  </button>
                </div>
              )}
              {couponMsg && <p className="mt-2 text-xs text-green-600">{couponMsg}</p>}
              {couponErr && <p className="mt-2 text-xs text-accent">{couponErr}</p>}
            </div>

            {/* Totals */}
            <div className="mt-6 space-y-3 border-t border-line pt-6 text-[15px]">
              <Row label="Subtotal" value={`₹${subtotal}`} />
              {discount > 0 && <Row label="Discount" value={`−₹${discount}`} accent />}
              <div className="flex items-center justify-between border-t border-line pt-3 font-display text-lg font-semibold text-ink">
                <span>Total</span><span>₹{total}</span>
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-accent">{error}</p>}

            <button onClick={pay} disabled={paying} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-[15px] font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-60">
              {paying ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</> : `Pay ₹${total}`}
            </button>
            <p className="mt-3 text-center text-xs text-secondary">Secure payment via Razorpay</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-secondary">{label}</span>
      <span className={accent ? "text-accent" : "text-ink"}>{value}</span>
    </div>
  );
}
