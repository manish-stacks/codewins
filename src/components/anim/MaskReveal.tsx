"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left";

const hiddenClip: Record<Direction, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
};

export function MaskReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  scale = 1.3,
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrap = ref.current;
      const inner = wrap?.querySelector<HTMLElement>("[data-mask-inner]");
      if (!wrap || !inner) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(wrap, { clipPath: "inset(0%)" });
        gsap.set(inner, { scale: 1 });
        return;
      }

      gsap.set(wrap, { clipPath: hiddenClip[direction] });
      gsap.set(inner, { scale });

      gsap
        .timeline({ scrollTrigger: { trigger: wrap, start: "top 82%" }, delay })
        .to(wrap, { clipPath: "inset(0%)", duration: 1.2, ease: EASE }, 0)
        .to(inner, { scale: 1, duration: 1.4, ease: EASE }, 0);
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <div data-mask-inner className="absolute inset-0 h-full w-full">
        {children}
      </div>
    </div>
  );
}
