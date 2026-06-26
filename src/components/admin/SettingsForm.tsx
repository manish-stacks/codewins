"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import type { SiteSettings, RobotsSettings } from "@/lib/seo";

interface Social { label: string; href: string }
interface Contact {
  email: string; phone: string; phoneAlt: string; whatsapp: string;
  address: string; hours: string; socials: Social[];
}

export function SettingsForm({
  contact,
  footerLinks,
  seo,
  robots,
}: {
  contact: Contact;
  footerLinks: Record<string, unknown>;
  seo: SiteSettings;
  robots: RobotsSettings;
}) {
  const router = useRouter();
  const [c, setC] = useState<Contact>(contact);
  const [s, setS] = useState<SiteSettings>(seo);
  const [r, setR] = useState<RobotsSettings>(robots);
  const [socialsText, setSocialsText] = useState((contact.socials || []).map((x) => `${x.label} | ${x.href}`).join("\n"));
  const [footerText, setFooterText] = useState(JSON.stringify(footerLinks, null, 2));
  const [saving, setSaving] = useState<string>("");
  const [done, setDone] = useState<string>("");
  const [error, setError] = useState("");

  const field = "w-full rounded-2xl border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-accent";
  const label = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-secondary";
  const btn = "mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent-dark disabled:opacity-60";

  function setContact<K extends keyof Contact>(k: K, v: Contact[K]) { setC((p) => ({ ...p, [k]: v })); }
  function setSeo<K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) { setS((p) => ({ ...p, [k]: v })); }
  function setRob<K extends keyof RobotsSettings>(k: K, v: RobotsSettings[K]) { setR((p) => ({ ...p, [k]: v })); }

  async function save(key: string, value: unknown) {
    setSaving(key); setError(""); setDone("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
      setDone(key);
      router.refresh();
      setTimeout(() => setDone(""), 2000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving("");
    }
  }

  function saveContact() {
    const socials = socialsText.split("\n").map((l) => l.split("|").map((x) => x.trim())).filter((p) => p[0] && p[1]).map(([label, href]) => ({ label, href }));
    save("contact", { ...c, socials });
  }
  function saveFooter() {
    try { save("footerLinks", JSON.parse(footerText)); }
    catch { setError("Footer links: invalid JSON."); }
  }

  const Btn = ({ k, children }: { k: string; children: React.ReactNode }) => (
    <button onClick={() => {
      if (k === "contact") return saveContact();
      if (k === "footerLinks") return saveFooter();
      if (k === "seo") return save("seo", s);
      if (k === "robots") return save("robots", r);
    }} disabled={saving === k} className={btn}>
      {saving === k ? <Loader2 className="h-4 w-4 animate-spin" /> : done === k ? <Check className="h-4 w-4" /> : null} {children}
    </button>
  );

  return (
    <div className="max-w-3xl space-y-10">
      {/* Branding + global SEO */}
      <section className="rounded-card-lg border border-line p-6 lg:p-8">
        <h2 className="font-display text-xl font-semibold text-ink">Branding &amp; SEO</h2>
        <p className="mt-1 text-sm text-secondary">Logo, favicon, site title and meta — applied site-wide.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className={label}>Site title (default title)</label><input value={s.siteTitle} onChange={(e) => setSeo("siteTitle", e.target.value)} className={field} /></div>
          <div className="sm:col-span-2"><label className={label}>Title template</label><input value={s.titleTemplate} onChange={(e) => setSeo("titleTemplate", e.target.value)} className={field} placeholder="%s — CodeWins Technologies" /><p className="mt-1 text-xs text-secondary">Use <code>%s</code> for the page name.</p></div>
          <div className="sm:col-span-2"><label className={label}>Meta description</label><textarea value={s.description} onChange={(e) => setSeo("description", e.target.value)} rows={3} className={`${field} resize-y`} /></div>
          <div className="sm:col-span-2"><label className={label}>Keywords (comma separated)</label><input value={s.keywords} onChange={(e) => setSeo("keywords", e.target.value)} className={field} /></div>
          <div><label className={label}>Logo URL</label><input value={s.logo} onChange={(e) => setSeo("logo", e.target.value)} className={field} /></div>
          <div><label className={label}>Favicon URL</label><input value={s.favicon} onChange={(e) => setSeo("favicon", e.target.value)} className={field} placeholder="/favicon.ico" /></div>
          <div><label className={label}>Default OG / share image URL</label><input value={s.ogImage} onChange={(e) => setSeo("ogImage", e.target.value)} className={field} /></div>
          <div><label className={label}>Twitter handle</label><input value={s.twitterHandle} onChange={(e) => setSeo("twitterHandle", e.target.value)} className={field} placeholder="@codewins" /></div>
          <label className="sm:col-span-2 flex items-center gap-3 text-[15px] text-ink">
            <input type="checkbox" checked={s.robotsIndex} onChange={(e) => setSeo("robotsIndex", e.target.checked)} className="h-4 w-4 accent-[#e11d2a]" />
            Allow search engines to index the site (index, follow)
          </label>
        </div>
        <Btn k="seo">Save branding &amp; SEO</Btn>
      </section>

      {/* Custom scripts */}
      <section className="rounded-card-lg border border-line p-6 lg:p-8">
        <h2 className="font-display text-xl font-semibold text-ink">Header &amp; footer scripts</h2>
        <p className="mt-1 text-sm text-secondary">Paste analytics / pixels / chat widget snippets. Header goes in head, footer before body close.</p>
        <div className="mt-6 space-y-5">
          <div><label className={label}>Header scripts</label><textarea value={s.headerScripts} onChange={(e) => setSeo("headerScripts", e.target.value)} rows={6} spellCheck={false} className={`${field} font-mono text-[13px] resize-y`} placeholder="Google Tag Manager, Meta Pixel, etc." /></div>
          <div><label className={label}>Footer scripts</label><textarea value={s.footerScripts} onChange={(e) => setSeo("footerScripts", e.target.value)} rows={6} spellCheck={false} className={`${field} font-mono text-[13px] resize-y`} placeholder="Chat widget, deferred scripts" /></div>
        </div>
        <Btn k="seo">Save scripts</Btn>
      </section>

      {/* robots.txt */}
      <section className="rounded-card-lg border border-line p-6 lg:p-8">
        <h2 className="font-display text-xl font-semibold text-ink">robots.txt</h2>
        <p className="mt-1 text-sm text-secondary">Controls <code>/robots.txt</code> output. Sitemap is added automatically.</p>
        <label className="mt-5 flex items-center gap-3 text-[15px] text-ink">
          <input type="checkbox" checked={r.index} onChange={(e) => setRob("index", e.target.checked)} className="h-4 w-4 accent-[#e11d2a]" />
          Allow crawling (uncheck to block the whole site)
        </label>
        <div className="mt-5"><label className={label}>Disallow paths (one per line)</label><textarea value={r.disallow} onChange={(e) => setRob("disallow", e.target.value)} rows={5} spellCheck={false} className={`${field} font-mono text-[13px] resize-y`} placeholder={"/admin\n/dashboard\n/api"} /></div>
        <Btn k="robots">Save robots</Btn>
      </section>

      {/* Contact */}
      <section className="rounded-card-lg border border-line p-6 lg:p-8">
        <h2 className="font-display text-xl font-semibold text-ink">Contact information</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div><label className={label}>Email</label><input value={c.email} onChange={(e) => setContact("email", e.target.value)} className={field} /></div>
          <div><label className={label}>Phone</label><input value={c.phone} onChange={(e) => setContact("phone", e.target.value)} className={field} /></div>
          <div><label className={label}>Alt phone</label><input value={c.phoneAlt} onChange={(e) => setContact("phoneAlt", e.target.value)} className={field} /></div>
          <div><label className={label}>WhatsApp number</label><input value={c.whatsapp} onChange={(e) => setContact("whatsapp", e.target.value)} className={field} /></div>
          <div className="sm:col-span-2"><label className={label}>Address</label><input value={c.address} onChange={(e) => setContact("address", e.target.value)} className={field} /></div>
          <div className="sm:col-span-2"><label className={label}>Hours</label><input value={c.hours} onChange={(e) => setContact("hours", e.target.value)} className={field} /></div>
          <div className="sm:col-span-2"><label className={label}>Socials</label>
            <textarea value={socialsText} onChange={(e) => setSocialsText(e.target.value)} rows={4} className={`${field} resize-y`} placeholder="Facebook | https://facebook.com/..." />
            <p className="mt-1 text-xs text-secondary">One per line as <code>Label | URL</code></p>
          </div>
        </div>
        <Btn k="contact">Save contact</Btn>
      </section>

      {/* Footer links */}
      <section className="rounded-card-lg border border-line p-6 lg:p-8">
        <h2 className="font-display text-xl font-semibold text-ink">Footer links</h2>
        <p className="mt-1 text-sm text-secondary">Edit the footer link columns as JSON.</p>
        <textarea value={footerText} onChange={(e) => setFooterText(e.target.value)} rows={14} className={`${field} mt-5 font-mono text-[13px] resize-y`} spellCheck={false} />
        <Btn k="footerLinks">Save footer</Btn>
      </section>

      {error && <p className="text-sm text-accent">{error}</p>}
    </div>
  );
}
