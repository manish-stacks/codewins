"use client";

import { useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { navItems } from "@/data/navigation";
import { SITE } from "@/lib/seo";
import type { Contact } from "@/types";

export function MobileMenu({ open, onClose, contact }: { open: boolean; onClose: () => void; contact: Contact }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (open) {
        gsap.set(ref.current, { display: "flex" });
        gsap.fromTo(ref.current, { yPercent: -100 }, { yPercent: 0, duration: 0.6, ease: "power3.inOut" });
        gsap.fromTo(
          ref.current.querySelectorAll("[data-mlink]"),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, delay: 0.25, ease: "power3.out" }
        );
      } else {
        gsap.to(ref.current, {
          yPercent: -100,
          duration: 0.5,
          ease: "power3.inOut",
          onComplete: () => gsap.set(ref.current, { display: "none" }),
        });
      }
    },
    { dependencies: [open] }
  );

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[60] hidden flex-col bg-carbon px-6 pb-10 pt-6 text-white lg:hidden"
      style={{ display: "none" }}
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-xl font-bold tracking-tight">{SITE.name}</span>
        <button onClick={onClose} aria-label="Close menu" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-10 flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            data-mlink
            className="border-b border-white/10 py-4 font-display text-3xl font-semibold"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div data-mlink className="mt-auto space-y-2 text-sm text-white/60">
        <a href={`mailto:${contact.email}`} className="block text-white">{contact.email}</a>
        <p>{contact.address}</p>
        <p>{contact.hours}</p>
      </div>
    </div>
  );
}
