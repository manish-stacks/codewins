import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

function SuccessInner({ order }: { order?: string }) {
  return (
    <section className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 pt-[120px] text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
        <CheckCircle2 className="h-8 w-8" />
      </span>
      <h1 className="mt-6 font-display text-4xl font-extrabold text-ink">Payment successful</h1>
      <p className="mt-4 text-lg text-secondary">
        Thank you! Your order{order ? <> <span className="font-medium text-ink">{order}</span></> : ""} is confirmed.
        You can download your purchases from your orders.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/dashboard/orders" className="rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent-dark">View my orders</Link>
        <Link href="/products" className="rounded-full border border-line px-6 py-3 text-[15px] font-medium text-ink hover:border-ink">Continue shopping</Link>
      </div>
    </section>
  );
}

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  return (
    <Suspense fallback={null}>
      <SuccessInner order={order} />
    </Suspense>
  );
}
