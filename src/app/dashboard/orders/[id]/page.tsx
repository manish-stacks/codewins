import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpCircle } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getUserOrderDetail } from "@/server/queries";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DownloadButton } from "@/components/dashboard/DownloadButton";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const order = session ? await getUserOrderDetail(session.id, id) : null;
  if (!order) notFound();

  return (
    <div>
      <Link href="/dashboard/orders" className="inline-flex items-center gap-2 text-sm text-secondary transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-secondary">{order.createdAt}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-8 divide-y divide-line rounded-card-lg border border-line">
        {order.items.map((it) => (
          <div key={it.id} className="flex items-center gap-4 p-5">
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-surface">
              <Image src={it.image} alt={it.title} fill sizes="96px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display text-[15px] font-semibold text-ink">{it.title}</div>
              <div className="text-sm text-secondary">
                Qty {it.qty} · ₹{it.price}
                {it.currentVersion && <span className="ml-2 text-secondary/80">· {it.currentVersion}</span>}
              </div>
              {it.updateAvailable && (
                <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                  <ArrowUpCircle className="h-3.5 w-3.5" />
                  Update available: {it.purchasedVersion || "—"} → {it.currentVersion}. Re-download for the latest files.
                </div>
              )}
            </div>
            {it.downloadable ? (
              <DownloadButton itemId={it.id} />
            ) : (
              <span className="text-xs text-secondary">{order.status === "PAID" ? "Link soon" : "Locked"}</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 ml-auto max-w-xs space-y-2 text-[15px]">
        <div className="flex justify-between text-secondary"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
        {order.discount > 0 && <div className="flex justify-between text-accent"><span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span><span>−₹{order.discount}</span></div>}
        <div className="flex justify-between border-t border-line pt-2 font-display text-lg font-semibold text-ink"><span>Total</span><span>₹{order.total}</span></div>
      </div>
    </div>
  );
}
