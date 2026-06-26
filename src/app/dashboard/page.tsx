import Link from "next/link";
import { ArrowUpRight, Package, Clock } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getUserOrders } from "@/server/queries";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const session = await getSession();
  const orders = session ? await getUserOrders(session.id) : [];
  const paid = orders.filter((o) => o.status === "PAID").length;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-ink">Welcome back, {session?.name.split(" ")[0]}</h1>
      <p className="mt-2 text-secondary">Here&apos;s a quick look at your account.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <Stat label="Total orders" value={orders.length} icon={<Package className="h-5 w-5" />} />
        <Stat label="Completed" value={paid} icon={<Clock className="h-5 w-5" />} />
        <Link href="/products" className="group flex flex-col justify-between rounded-card-lg border border-line bg-surface p-6 transition-colors hover:border-accent/40">
          <span className="text-sm text-secondary">Browse marketplace</span>
          <span className="mt-6 inline-flex items-center gap-2 font-display text-lg font-semibold text-ink">
            Shop templates <ArrowUpRight className="h-5 w-5 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </Link>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">Recent orders</h2>
          <Link href="/dashboard/orders" className="text-sm font-medium text-accent hover:underline">View all</Link>
        </div>
        {orders.length === 0 ? (
          <div className="mt-5 rounded-card-lg border border-dashed border-line bg-surface p-10 text-center">
            <p className="text-secondary">No orders yet.</p>
            <Link href="/products" className="mt-4 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark">Browse products</Link>
          </div>
        ) : (
          <div className="mt-5 overflow-hidden rounded-card-lg border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-xs uppercase tracking-wider text-secondary">
                <tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Items</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.slice(0, 5).map((o) => (
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
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-card-lg border border-line bg-surface p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">{icon}</span>
      <div className="mt-4 font-display text-3xl font-bold text-ink">{value}</div>
      <div className="mt-1 text-sm text-secondary">{label}</div>
    </div>
  );
}
