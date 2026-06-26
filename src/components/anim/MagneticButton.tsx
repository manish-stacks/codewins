"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Variant = "primary" | "light" | "outline";

function cls(variant: Variant) {
  const base =
    "relative inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-[15px] font-medium tracking-tight transition-colors duration-300";
  const map: Record<Variant, string> = {
    primary: "bg-accent text-white hover:bg-accent-dark",
    light: "bg-white text-ink hover:bg-white/90",
    outline: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-white",
  };
  return cn(base, map[variant]);
}

export function MagneticButton({
  children,
  href,
  variant = "primary",
  className,
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const inner = label.current;
      if (!el || !inner) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
      const lxTo = gsap.quickTo(inner, "x", { duration: 0.6, ease: "power3" });
      const lyTo = gsap.quickTo(inner, "y", { duration: 0.6, ease: "power3" });

      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        xTo(x * 0.35);
        yTo(y * 0.35);
        lxTo(x * 0.15);
        lyTo(y * 0.15);
      };
      const reset = () => {
        xTo(0); yTo(0); lxTo(0); lyTo(0);
      };
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", reset);
      return () => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", reset);
      };
    },
    { scope: ref }
  );

  return (
    <Link ref={ref} href={href} className={cn(cls(variant), className)}>
      <span ref={label} className="inline-flex items-center gap-2.5">
        {children}
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
