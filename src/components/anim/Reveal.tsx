"use client";

import { useRef, type ReactNode, type ElementType } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  y?: number;
  delay?: number;
  duration?: number;
}

export function Reveal({
  children,
  className,
  as: Tag = "div",
  y = 40,
  delay = 0,
  duration = 0.9,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(ref.current, { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        ref.current,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: EASE,
          scrollTrigger: { trigger: ref.current, start: "top 88%" },
        }
      );
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </Tag>
  );
}
