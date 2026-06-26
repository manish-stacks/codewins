"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag } from "lucide-react";
import { navItems } from "@/data/navigation";
import { useScrolled } from "@/hooks/useScrolled";
import { useLockBody } from "@/hooks/useLockBody";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types";
import type { SessionPayload } from "@/lib/jwt";
import { useCart } from "@/components/cart/CartProvider";
import Image from "next/image";

export function Header({ contact, session, logo }: { contact: Contact; session: SessionPayload | null; logo?: string }) {
  const { count } = useCart();
  const pathname = usePathname();
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);
  useLockBody(open);
  useEffect(() => setOpen(false), [pathname]);

  const overHero = pathname === "/" && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-[90px] transition-all duration-500 ease-smooth",
          scrolled ? "border-b border-line bg-white/85 shadow-[0_8px_30px_-16px_rgba(0,0,0,0.18)] backdrop-blur-xl" : "border-b border-transparent"
        )}
      >
        <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/45 via-black/15 to-transparent transition-opacity duration-500", overHero ? "opacity-100" : "opacity-0")} />

        <div className="mx-auto flex h-full max-w-frame items-center justify-between px-6 sm:px-8 lg:px-12">
          <Link href="/" className={cn("flex items-center gap-1 font-display text-2xl font-extrabold tracking-tight transition-colors duration-300", overHero ? "text-white" : "text-ink")}>
            <Image src={logo || "https://codewins.in/assets/uploads/media-uploader/logo11701255144.png"} alt={SITE.name} width={200} height={32} priority />
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={cn("group relative py-1 text-[15px] font-medium transition-colors duration-300", overHero ? "text-white/90 hover:text-white" : "text-ink")}>
                  {item.label}
                  <span className={cn("absolute -bottom-0.5 left-0 h-0.5 bg-accent transition-all duration-300 ease-smooth", active ? "w-full" : "w-0 group-hover:w-full")} />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/checkout" aria-label="Cart" className={cn("relative inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300", overHero ? "border-white/30 text-white hover:bg-white hover:text-ink" : "border-ink/15 text-ink hover:bg-ink hover:text-white")}>
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.7} />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-white">{count}</span>
              )}
            </Link>
            {session ? (
              <Link href={session.role === "ADMIN" ? "/admin" : "/dashboard"} className={cn("hidden rounded-full border px-5 py-3 text-[15px] font-medium transition-colors duration-300 lg:inline-flex", overHero ? "border-white/30 text-white hover:bg-white hover:text-ink" : "border-ink/15 text-ink hover:bg-ink hover:text-white")}>
                {session.role === "ADMIN" ? "Admin" : "Dashboard"}
              </Link>
            ) : (
              <Link href="/login" className={cn("hidden rounded-full border px-5 py-3 text-[15px] font-medium transition-colors duration-300 lg:inline-flex", overHero ? "border-white/30 text-white hover:bg-white hover:text-ink" : "border-ink/15 text-ink hover:bg-ink hover:text-white")}>
                Login
              </Link>
            )}
            <Link href="/contact" className="hidden rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-accent-dark lg:inline-flex">
              Get a Quote
            </Link>
            <button onClick={() => setOpen(true)} aria-label="Open menu" className={cn("flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 lg:hidden", overHero ? "border-white/30 text-white" : "border-ink/15 text-ink")}>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} contact={contact} />
    </>
  );
}
