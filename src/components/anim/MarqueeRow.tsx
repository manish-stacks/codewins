"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export function MarqueeRow({
  children,
  className,
  speed = 28,
  reverse = false,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
  reverse?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const total = el.scrollWidth / 2;
      gsap.to(el, {
        x: reverse ? total : -total,
        duration: speed,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (x) => {
            const v = parseFloat(x);
            return `${reverse ? v % total : v % -total}px`;
          },
        },
      });
    },
    { scope: track }
  );

  return (
    <div className={cn("overflow-hidden", className)}>
      <div ref={track} className="flex w-max">
        {children}
        {children}
      </div>
    </div>
  );
}
