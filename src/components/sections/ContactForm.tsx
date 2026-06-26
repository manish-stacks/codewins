"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, Check } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/anim/Reveal";
import type { Contact } from "@/types";
import { cn } from "@/lib/utils";

export function ContactForm({ contact }: { contact: Contact }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const field =
    "w-full rounded-2xl border border-line bg-white px-5 py-4 text-[15px] text-ink outline-none transition-colors duration-300 placeholder:text-secondary/70 focus:border-accent";
  const label = "mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-secondary";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      subject: String(fd.get("service") || ""),
      message: String(fd.get("message") || ""),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section className="bg-white">
      <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal className="space-y-8">
              <Row icon={Mail} label="Email Us" value={contact.email} href={`mailto:${contact.email}`} />
              <Row icon={Phone} label="Call Us" value={`${contact.phone}, ${contact.phoneAlt}`} href={`tel:${contact.phone}`} />
              <Row icon={MessageCircle} label="WhatsApp" value="Chat with us" href={`https://wa.me/${contact.whatsapp}`} />
              <Row icon={MapPin} label="Office" value={contact.address} />
            </Reveal>
            <Reveal className="mt-12 flex aspect-[16/10] items-center justify-center overflow-hidden rounded-card-lg border border-line bg-[repeating-linear-gradient(45deg,#efeceb_0,#efeceb_1px,transparent_1px,transparent_14px)]">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary">Map · New Delhi</span>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            {sent ? (
              <div className="flex min-h-[24rem] flex-col items-start justify-center rounded-card-lg border border-line bg-surface p-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white"><Check className="h-5 w-5" /></span>
                <h3 className="mt-6 font-display text-3xl font-semibold text-ink">Thank you!</h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-secondary">Your message has been received. Our team will get back to you within one working day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-card-lg border border-line bg-surface p-8 lg:p-10">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div><label className={label} htmlFor="name">Name</label><input id="name" name="name" required className={field} placeholder="Your name" /></div>
                  <div><label className={label} htmlFor="email">Email</label><input id="email" name="email" type="email" required className={field} placeholder="you@company.com" /></div>
                  <div><label className={label} htmlFor="phone">Phone</label><input id="phone" name="phone" className={field} placeholder="+91 ..." /></div>
                  <div><label className={label} htmlFor="service">Service</label>
                    <select id="service" name="service" defaultValue="" className={cn(field, "appearance-none")}>
                      <option value="" disabled>Select a service</option>
                      <option>Web Design & Development</option>
                      <option>Mobile App Development</option>
                      <option>Digital Marketing</option>
                      <option>Hosting Solutions</option>
                      <option>Buy a Template / Product</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6"><label className={label} htmlFor="message">Your message</label>
                  <textarea id="message" name="message" rows={4} required className={cn(field, "resize-none")} placeholder="Tell us about your project, budget and timeline." />
                </div>
                {error && <p className="mt-4 text-sm text-accent">{error}</p>}
                <div className="mt-8"><Button type="submit" disabled={loading}>{loading ? "Sending…" : "Send Message"}</Button></div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

function Row({ icon: Icon, label, value, href }: { icon: typeof Mail; label: string; value: string; href?: string }) {
  return (
    <div className="flex gap-5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line text-accent"><Icon className="h-5 w-5" strokeWidth={1.5} /></span>
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">{label}</span>
        <div className="mt-1">
          {href ? <a href={href} className="text-lg text-ink transition-opacity hover:opacity-60">{value}</a> : <span className="text-lg text-ink">{value}</span>}
        </div>
      </div>
    </div>
  );
}
