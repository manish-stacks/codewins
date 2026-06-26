import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader, adminCard, adminTable, adminTh } from "@/components/admin/AdminHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Pill } from "@/components/admin/Pill";

export const dynamic = "force-dynamic";

export default async function AdminProjects() {
  const rows = await prisma.project.findMany({ orderBy: { order: "asc" } }).catch(() => []);
  return (
    <div>
      <AdminHeader title="Projects" subtitle={`${rows.length} total`} newHref="/admin/projects/new" newLabel="New project" />
      <div className={`overflow-x-auto ${adminCard}`}>
        <table className={adminTable}>
          <thead className={adminTh}><tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Year</th><th className="px-5 py-3">Featured</th><th className="px-5 py-3">Published</th><th className="px-5 py-3"></th></tr></thead>
          <tbody className="divide-y divide-line">
            {rows.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-3"><Link href={`/admin/projects/${p.id}`} className="font-medium text-ink hover:text-accent">{p.name}</Link></td>
                <td className="px-5 py-3 text-secondary">{p.category}</td>
                <td className="px-5 py-3 text-secondary">{p.year}</td>
                <td className="px-5 py-3"><Pill on={p.featured} /></td>
                <td className="px-5 py-3"><Pill on={p.published} /></td>
                <td className="px-5 py-3 text-right"><div className="flex justify-end gap-2"><Link href={`/admin/projects/${p.id}`} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-secondary hover:border-ink hover:text-ink">Edit</Link><DeleteButton endpoint={`/api/admin/projects/${p.id}`} label={p.name} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-10 text-center text-secondary">No projects yet.</p>}
      </div>
    </div>
  );
}
