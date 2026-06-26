import Link from "next/link";
import { Plus } from "lucide-react";

export function AdminHeader({ title, subtitle, newHref, newLabel = "New" }: { title: string; subtitle?: string; newHref?: string; newLabel?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-secondary">{subtitle}</p>}
      </div>
      {newHref && (
        <Link href={newHref} className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark">
          <Plus className="h-4 w-4" /> {newLabel}
        </Link>
      )}
    </div>
  );
}

export const adminCard = "rounded-card-lg border border-line";
export const adminTable = "w-full text-left text-sm";
export const adminTh = "bg-surface text-xs uppercase tracking-wider text-secondary";
