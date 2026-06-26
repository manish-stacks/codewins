"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface SplitHeadingProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  immediate?: boolean;
}

/** Splits each line into words, reveals them rising out of a mask with a slight skew. */
export function SplitHeading({ text, className, as: Tag = "h2", delay = 0, immediate = false }: SplitHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lines = text.split("\n");

  useGSAP(
    () => {
      const words = ref.current?.querySelectorAll<HTMLElement>("[data-word]");
      if (!words || !words.length) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(words, { yPercent: 0, rotate: 0, opacity: 1 });
        return;
      }

      gsap.fromTo(
        words,
        { yPercent: 120, rotate: 4, opacity: 0 },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          duration: 1,
          ease: EASE,
          stagger: 0.055,
          delay,
          scrollTrigger: immediate ? undefined : { trigger: ref.current, start: "top 85%" },
        }
      );
    },
    { scope: ref }
  );

  return (
    <Tag className={cn(className)}>
      <span ref={ref} className="block">
        {lines.map((line, li) => (
          <span key={li} className="block overflow-hidden pb-[0.08em]">
            {line.split(" ").map((word, wi) => (
              <span key={wi} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
                <span data-word className="inline-block will-change-transform">{word}</span>
              </span>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  );
}
