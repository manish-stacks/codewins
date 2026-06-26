"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

export type FieldType = "text" | "url" | "number" | "textarea" | "lines" | "richtext" | "select" | "checkbox";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  help?: string;
  full?: boolean; // span both columns
}

type Values = Record<string, string | boolean>;

function toInitial(fields: FieldDef[], initial?: Record<string, unknown>): Values {
  const v: Values = {};
  for (const f of fields) {
    const raw = initial?.[f.name];
    if (f.type === "checkbox") v[f.name] = Boolean(raw);
    else if (f.type === "lines") v[f.name] = Array.isArray(raw) ? (raw as string[]).join("\n") : "";
    else if (f.type === "richtext") v[f.name] = typeof raw === "string" ? raw : Array.isArray(raw) ? (raw as string[]).map((x) => `<p>${x}</p>`).join("") : "";
    else v[f.name] = raw === undefined || raw === null ? "" : String(raw);
  }
  return v;
}

export function AdminForm({
  fields,
  endpoint,
  method,
  initial,
  redirect,
  submitLabel = "Save",
}: {
  fields: FieldDef[];
  endpoint: string;
  method: "POST" | "PATCH";
  initial?: Record<string, unknown>;
  redirect: string;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(() => toInitial(fields, initial));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (name: string, val: string | boolean) => setValues((p) => ({ ...p, [name]: val }));

  function buildPayload() {
    const out: Record<string, unknown> = {};
    for (const f of fields) {
      const val = values[f.name];
      if (f.type === "number") out[f.name] = val === "" ? null : Number(val);
      else if (f.type === "checkbox") out[f.name] = Boolean(val);
      else if (f.type === "lines")
        out[f.name] = String(val).split("\n").map((s) => s.trim()).filter(Boolean);
      else if (f.type === "richtext") out[f.name] = String(val || "");
      else out[f.name] = val === "" ? null : val;
    }
    return out;
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  const field = "w-full rounded-2xl border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-accent";
  const label = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-secondary";

  return (
    <form onSubmit={submit} className="max-w-3xl">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.full || f.type === "textarea" || f.type === "lines" || f.type === "richtext" ? "sm:col-span-2" : ""}>
            {f.type === "checkbox" ? (
              <label className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3">
                <input type="checkbox" checked={Boolean(values[f.name])} onChange={(e) => set(f.name, e.target.checked)} className="h-4 w-4 accent-accent" />
                <span className="text-[15px] text-ink">{f.label}</span>
              </label>
            ) : (
              <>
                <label className={label} htmlFor={f.name}>{f.label}{f.required && " *"}</label>
                {f.type === "richtext" ? (
                  <RichTextEditor value={String(values[f.name])} onChange={(html) => set(f.name, html)} placeholder={f.placeholder} />
                ) : f.type === "select" ? (
                  <select id={f.name} value={String(values[f.name])} onChange={(e) => set(f.name, e.target.value)} className={field}>
                    <option value="">Select…</option>
                    {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : f.type === "textarea" || f.type === "lines" ? (
                  <textarea id={f.name} value={String(values[f.name])} onChange={(e) => set(f.name, e.target.value)} rows={f.type === "lines" ? 5 : 4} placeholder={f.placeholder} className={`${field} resize-y`} />
                ) : (
                  <input id={f.name} type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"} value={String(values[f.name])} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} required={f.required} className={field} />
                )}
                {f.help && <p className="mt-1 text-xs text-secondary">{f.help}</p>}
              </>
            )}
          </div>
        ))}
      </div>

      {error && <p className="mt-5 text-sm text-accent">{error}</p>}

      <div className="mt-8 flex items-center gap-3">
        <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} {submitLabel}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-full border border-line px-6 py-3 text-[15px] font-medium text-ink hover:border-ink">Cancel</button>
      </div>
    </form>
  );
}
