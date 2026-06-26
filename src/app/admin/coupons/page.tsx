import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader, adminCard, adminTable, adminTh } from "@/components/admin/AdminHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Pill } from "@/components/admin/Pill";

export const dynamic = "force-dynamic";

export default async function AdminCoupons() {
  const rows = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []);
  return (
    <div>
      <AdminHeader title="Coupons" subtitle={`${rows.length} total`} newHref="/admin/coupons/new" newLabel="New coupon" />
      <div className={`overflow-x-auto ${adminCard}`}>
        <table className={adminTable}>
          <thead className={adminTh}><tr><th className="px-5 py-3">Code</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Value</th><th className="px-5 py-3">Used</th><th className="px-5 py-3">Active</th><th className="px-5 py-3"></th></tr></thead>
          <tbody className="divide-y divide-line">
            {rows.map((c) => (
              <tr key={c.id}>
                <td className="px-5 py-3"><Link href={`/admin/coupons/${c.id}`} className="font-medium text-ink hover:text-accent">{c.code}</Link></td>
                <td className="px-5 py-3 text-secondary">{c.type}</td>
                <td className="px-5 py-3 text-ink">{c.type === "PERCENT" ? `${c.value}%` : `₹${c.value}`}</td>
                <td className="px-5 py-3 text-secondary">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                <td className="px-5 py-3"><Pill on={c.active} /></td>
                <td className="px-5 py-3 text-right"><div className="flex justify-end gap-2"><Link href={`/admin/coupons/${c.id}`} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-secondary hover:border-ink hover:text-ink">Edit</Link><DeleteButton endpoint={`/api/admin/coupons/${c.id}`} label={c.code} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-10 text-center text-secondary">No coupons yet.</p>}
      </div>
    </div>
  );
}
