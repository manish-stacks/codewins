"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { serviceIcons } from "@/lib/icons";
import type { Service } from "@/types";

export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const Icon = serviceIcons[service.icon];

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // entrance
      gsap.fromTo(
        el,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: (index % 3) * 0.08, scrollTrigger: { trigger: el, start: "top 88%" } }
      );

      if (window.matchMedia("(pointer: coarse)").matches) return;
      // hover tilt
      const rxTo = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" });
      const ryTo = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" });
      gsap.set(el, { transformPerspective: 800, transformOrigin: "center" });

      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rxTo(-py * 8);
        ryTo(px * 8);
      };
      const reset = () => { rxTo(0); ryTo(0); };
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", reset);
      return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", reset); };
    },
    { scope: ref }
  );

  return (
    <Link
      ref={ref}
      href={`/services/${service.id}`}
      className="group relative flex h-full flex-col rounded-card-lg border border-line bg-white p-8 transition-colors duration-500 hover:border-accent/40 hover:shadow-[0_30px_60px_-30px_rgba(209,49,46,0.25)] lg:p-10"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-white">
          <Icon className="h-6 w-6" strokeWidth={1.7} />
        </span>
        <span className="font-display text-sm font-semibold text-secondary">{service.number}</span>
      </div>
      <h3 className="mt-8 font-display text-2xl font-semibold text-ink lg:text-[26px]">{service.title}</h3>
      <p className="mt-4 flex-1 text-[15px] leading-relaxed text-secondary">{service.description}</p>
      <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent">
        Explore
        <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </span>
    </Link>
  );
}
