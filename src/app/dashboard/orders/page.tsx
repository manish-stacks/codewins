import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getUserOrders } from "@/server/queries";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getSession();
  const orders = session ? await getUserOrders(session.id) : [];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-ink">My orders</h1>
      <p className="mt-2 text-secondary">All your purchases and their status.</p>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-card-lg border border-dashed border-line bg-surface p-12 text-center">
          <p className="text-secondary">You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="mt-4 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark">Browse the marketplace</Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-card-lg border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-secondary">
              <tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Items</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-5 py-3 font-medium"><Link href={`/dashboard/orders/${o.id}`} className="text-ink hover:text-accent">{o.orderNumber}</Link></td>
                  <td className="px-5 py-3 text-secondary">{o.createdAt}</td>
                  <td className="px-5 py-3 text-secondary">{o.itemCount}</td>
                  <td className="px-5 py-3 text-ink">₹{o.total}</td>
                  <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
