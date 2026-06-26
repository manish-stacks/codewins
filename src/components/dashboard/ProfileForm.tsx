"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";

export function ProfileForm({ name, email, phone, role }: { name: string; email: string; phone: string; role: string }) {
  const router = useRouter();
  const [n, setN] = useState(name);
  const [p, setP] = useState(phone);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const field = "w-full rounded-2xl border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-accent disabled:bg-surface disabled:text-secondary";
  const label = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-secondary";

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true); setError(""); setDone(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: n, phone: p }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
      setDone(true);
      router.refresh();
      setTimeout(() => setDone(false), 2000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="mt-8 max-w-xl space-y-5">
      <div><label className={label}>Name</label><input value={n} onChange={(e) => setN(e.target.value)} required className={field} /></div>
      <div><label className={label}>Email</label><input value={email} disabled className={field} /></div>
      <div><label className={label}>Phone</label><input value={p} onChange={(e) => setP(e.target.value)} placeholder="+91 ..." className={field} /></div>
      <div><label className={label}>Account type</label><input value={role} disabled className={field} /></div>
      {error && <p className="text-sm text-accent">{error}</p>}
      <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent-dark disabled:opacity-60">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : done ? <Check className="h-4 w-4" /> : null} Save changes
      </button>
    </form>
  );
}
