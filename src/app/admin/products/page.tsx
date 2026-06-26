import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader, adminCard, adminTable, adminTh } from "@/components/admin/AdminHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Pill } from "@/components/admin/Pill";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({ orderBy: { order: "asc" } }).catch(() => []);
  return (
    <div>
      <AdminHeader title="Products" subtitle={`${products.length} total`} newHref="/admin/products/new" newLabel="New product" />
      <div className={`overflow-x-auto ${adminCard}`}>
        <table className={adminTable}>
          <thead className={adminTh}><tr><th className="px-5 py-3">Title</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Published</th><th className="px-5 py-3">Featured</th><th className="px-5 py-3"></th></tr></thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-3"><Link href={`/admin/products/${p.id}`} className="font-medium text-ink hover:text-accent">{p.title}</Link></td>
                <td className="px-5 py-3 text-secondary">{p.category}</td>
                <td className="px-5 py-3 text-ink">₹{p.price}</td>
                <td className="px-5 py-3"><Pill on={p.published} /></td>
                <td className="px-5 py-3"><Pill on={p.featured} /></td>
                <td className="px-5 py-3 text-right"><div className="flex justify-end gap-2"><Link href={`/admin/products/${p.id}`} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-secondary hover:border-ink hover:text-ink">Edit</Link><DeleteButton endpoint={`/api/admin/products/${p.id}`} label={p.title} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-10 text-center text-secondary">No products yet.</p>}
      </div>
    </div>
  );
}
