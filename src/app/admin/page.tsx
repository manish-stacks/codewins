import Link from "next/link";
import { IndianRupee, ShoppingBag, CheckCircle2, Users, Mail, Package, Wrench, FolderKanban, FileText, Ticket } from "lucide-react";
import { getAdminCounts } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const c = await getAdminCounts();

  const metrics = [
    { label: "Revenue (paid)", value: `₹${c.revenue.toLocaleString("en-IN")}`, icon: <IndianRupee className="h-5 w-5" /> },
    { label: "Total orders", value: c.orders, icon: <ShoppingBag className="h-5 w-5" /> },
    { label: "Paid orders", value: c.paidOrders, icon: <CheckCircle2 className="h-5 w-5" /> },
    { label: "Users", value: c.users, icon: <Users className="h-5 w-5" /> },
  ];

  const catalog = [
    { label: "Products", value: c.products, href: "/admin/products", icon: <Package className="h-5 w-5" /> },
    { label: "Services", value: c.services, href: "/admin/services", icon: <Wrench className="h-5 w-5" /> },
    { label: "Projects", value: c.projects, href: "/admin/projects", icon: <FolderKanban className="h-5 w-5" /> },
    { label: "Blog posts", value: c.posts, href: "/admin/blog", icon: <FileText className="h-5 w-5" /> },
    { label: "Coupons", value: c.coupons, href: "/admin/coupons", icon: <Ticket className="h-5 w-5" /> },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-ink">Dashboard</h1>
      <p className="mt-2 text-secondary">Overview of your store and content.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-card-lg border border-line bg-surface p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">{m.icon}</span>
            <div className="mt-4 font-display text-3xl font-bold text-ink">{m.value}</div>
            <div className="mt-1 text-sm text-secondary">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/admin/orders" className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark">
          <ShoppingBag className="h-4 w-4" /> View orders
        </Link>
        <Link href="/admin/messages" className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink hover:border-ink">
          <Mail className="h-4 w-4" /> Messages {c.unreadMessages > 0 && <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-white">{c.unreadMessages}</span>}
        </Link>
      </div>

      <h2 className="mt-12 font-display text-xl font-semibold text-ink">Catalog</h2>
      <p className="mt-1 text-sm text-secondary">Create, edit and delete content — click any card to manage.</p>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {catalog.map((m) => (
          <Link key={m.label} href={m.href} className="group rounded-card-lg border border-line bg-white p-6 transition-colors hover:border-accent/40">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 text-ink transition-colors group-hover:bg-accent/10 group-hover:text-accent">{m.icon}</span>
            <div className="mt-4 font-display text-2xl font-bold text-ink">{m.value}</div>
            <div className="mt-1 text-sm text-secondary">Manage {m.label.toLowerCase()}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
