"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface SideNavItem {
  label: string;
  href: string;
}

export function SideNav({ items }: { items: SideNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active =
          item.href === pathname ||
          (item.href !== "/dashboard" && item.href !== "/admin" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200",
              active ? "bg-accent text-white" : "text-secondary hover:bg-surface hover:text-ink"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
