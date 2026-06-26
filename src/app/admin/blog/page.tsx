import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader, adminCard, adminTable, adminTh } from "@/components/admin/AdminHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Pill } from "@/components/admin/Pill";

export const dynamic = "force-dynamic";

export default async function AdminBlog() {
  const rows = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } }).catch(() => []);
  return (
    <div>
      <AdminHeader title="Blog" subtitle={`${rows.length} posts`} newHref="/admin/blog/new" newLabel="New post" />
      <div className={`overflow-x-auto ${adminCard}`}>
        <table className={adminTable}>
          <thead className={adminTh}><tr><th className="px-5 py-3">Title</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Published</th><th className="px-5 py-3"></th></tr></thead>
          <tbody className="divide-y divide-line">
            {rows.map((b) => (
              <tr key={b.id}>
                <td className="px-5 py-3"><Link href={`/admin/blog/${b.id}`} className="font-medium text-ink hover:text-accent">{b.title}</Link></td>
                <td className="px-5 py-3 text-secondary">{b.category}</td>
                <td className="px-5 py-3"><Pill on={b.published} /></td>
                <td className="px-5 py-3 text-right"><div className="flex justify-end gap-2"><Link href={`/admin/blog/${b.id}`} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-secondary hover:border-ink hover:text-ink">Edit</Link><DeleteButton endpoint={`/api/admin/blog/${b.id}`} label={b.title} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-10 text-center text-secondary">No posts yet.</p>}
      </div>
    </div>
  );
}
