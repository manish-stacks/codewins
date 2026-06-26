"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/anim/SplitHeading";
import type { ProcessStep } from "@/types";

export function WorkProcess({ steps }: { steps: ProcessStep[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // progress line draws as the section scrolls through
      gsap.fromTo(
        "[data-proc-line]",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 65%", end: "bottom 70%", scrub: true } }
      );

      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step, i) => {
        gsap.fromTo(
          step,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: i * 0.05, scrollTrigger: { trigger: step, start: "top 88%" } }
        );
      });
    },
    { scope: root }
  );

  return (
    <Section className="bg-carbon text-white">
      <div ref={root} className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <Eyebrow light>How It Works</Eyebrow>
          <SplitHeading text={"From idea to launch\nin five simple steps."} as="h2" className="mt-5 font-display text-heading font-semibold text-white" />
        </div>

        <div className="relative mt-16">
          {/* desktop progress rail */}
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-white/15 lg:block">
            <div data-proc-line className="h-full origin-left scale-x-0 bg-accent" />
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {steps.map((step, i) => (
              <div key={i} data-step className="relative">
                <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-carbon font-display text-lg font-semibold text-accent">
                  {step.number}
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/60">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
