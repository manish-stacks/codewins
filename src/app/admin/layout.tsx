import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SideNav } from "@/components/layout/SideNav";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { SITE } from "@/lib/seo";

const nav = [
  { label: "Overview", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Services", href: "/admin/services" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Blog", href: "/admin/blog" },
  { label: "Coupons", href: "/admin/coupons" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Messages", href: "/admin/messages" },
  { label: "Settings", href: "/admin/settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  if (session.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-line bg-carbon text-white">
        <div className="mx-auto flex h-16 max-w-frame items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-display text-xl font-extrabold tracking-tight">{SITE.name}</Link>
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-white/70 sm:block">{session.name}</span>
            <LogoutButton className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition-colors hover:border-white hover:text-white" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-frame gap-10 px-6 py-10 lg:px-10">
        <aside className="hidden w-56 shrink-0 lg:block">
          <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Manage</p>
          <SideNav items={nav} />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
