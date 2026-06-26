import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader, adminCard, adminTable, adminTh } from "@/components/admin/AdminHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Pill } from "@/components/admin/Pill";

export const dynamic = "force-dynamic";

export default async function AdminServices() {
  const rows = await prisma.service.findMany({ orderBy: { order: "asc" } }).catch(() => []);
  return (
    <div>
      <AdminHeader title="Services" subtitle={`${rows.length} total`} newHref="/admin/services/new" newLabel="New service" />
      <div className={`overflow-x-auto ${adminCard}`}>
        <table className={adminTable}>
          <thead className={adminTh}><tr><th className="px-5 py-3">Title</th><th className="px-5 py-3">Icon</th><th className="px-5 py-3">Published</th><th className="px-5 py-3"></th></tr></thead>
          <tbody className="divide-y divide-line">
            {rows.map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-3"><Link href={`/admin/services/${s.id}`} className="font-medium text-ink hover:text-accent">{s.title}</Link></td>
                <td className="px-5 py-3 text-secondary">{s.icon}</td>
                <td className="px-5 py-3"><Pill on={s.published} /></td>
                <td className="px-5 py-3 text-right"><div className="flex justify-end gap-2"><Link href={`/admin/services/${s.id}`} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-secondary hover:border-ink hover:text-ink">Edit</Link><DeleteButton endpoint={`/api/admin/services/${s.id}`} label={s.title} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-10 text-center text-secondary">No services yet.</p>}
      </div>
    </div>
  );
}
