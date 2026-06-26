"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RowAction({
  endpoint,
  body,
  children,
  className,
}: {
  endpoint: string;
  body: Record<string, unknown>;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      await fetch(endpoint, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={run} disabled={loading} className={className ?? "rounded-full border border-line px-3 py-1.5 text-xs font-medium text-secondary hover:border-ink hover:text-ink disabled:opacity-50"}>
      {children}
    </button>
  );
}
