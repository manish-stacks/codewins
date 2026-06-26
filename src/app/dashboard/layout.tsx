import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SideNav } from "@/components/layout/SideNav";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { SITE } from "@/lib/seo";

const nav = [
  { label: "Overview", href: "/dashboard" },
  { label: "Orders", href: "/dashboard/orders" },
  { label: "Profile", href: "/dashboard/profile" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard");

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-frame items-center justify-between px-6 lg:px-10">
          <Link href="/" className="font-display text-xl font-extrabold tracking-tight text-ink">{SITE.name}</Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-secondary sm:block">Hi, {session.name.split(" ")[0]}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-frame gap-10 px-6 py-10 lg:px-10">
        <aside className="hidden w-56 shrink-0 lg:block">
          <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">My Account</p>
          <SideNav items={nav} />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
