"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export function StatusSelect({ orderId, current }: { orderId: string; current: string }) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [saving, setSaving] = useState(false);

  async function change(next: string) {
    setValue(next);
    setSaving(true);
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <select value={value} onChange={(e) => change(e.target.value)} disabled={saving} className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink outline-none focus:border-accent disabled:opacity-50">
      {STATUSES.map((s, i) => <option key={i} value={s}>{s}</option>)}
    </select>
  );
}
