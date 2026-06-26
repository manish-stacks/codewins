import { StatusSelect } from "@/components/admin/StatusSelect";
import { getAdminOrders } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  const orders = await getAdminOrders();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-ink">Orders</h1>
      <p className="mt-2 text-secondary">{orders.length} order{orders.length === 1 ? "" : "s"} total.</p>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-card-lg border border-dashed border-line bg-surface p-12 text-center text-secondary">
          No orders yet. They&apos;ll appear here once checkout is live.
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-card-lg border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-secondary">
              <tr>
                <th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Date</th><th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-5 py-3 font-medium text-ink">{o.orderNumber}</td>
                  <td className="px-5 py-3">
                    <div className="text-ink">{o.customerName}</div>
                    <div className="text-xs text-secondary">{o.customerEmail}</div>
                  </td>
                  <td className="px-5 py-3 text-secondary">{o.createdAt}</td>
                  <td className="px-5 py-3 text-secondary">{o.itemCount}</td>
                  <td className="px-5 py-3 text-ink">₹{o.total}</td>
                  <td className="px-5 py-3">
                    <StatusSelect orderId={o?.id} current={o?.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
