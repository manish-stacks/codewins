"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/anim/SplitHeading";
import type { Testimonial } from "@/types";
import { cn } from "@/lib/utils";

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const t = items[i];
  const go = (d: number) => setI((p) => (p + d + items.length) % items.length);

  return (
    <Section className="bg-surface">
      <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow>Trusted Partnership</Eyebrow>
            <SplitHeading text={"What our\nclients say."} as="h2" className="mt-5 font-display text-heading font-semibold text-ink" />
            <div className="mt-10 flex gap-3">
              <button onClick={() => go(-1)} aria-label="Previous" className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 transition-colors hover:bg-accent hover:text-white hover:border-accent">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button onClick={() => go(1)} aria-label="Next" className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 transition-colors hover:bg-accent hover:text-white hover:border-accent">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div key={t.id} className="rounded-card-lg border border-line bg-white p-8 lg:p-12">
              <Quote className="h-10 w-10 text-accent" strokeWidth={1.4} />
              <blockquote className="mt-7 font-display text-2xl font-medium leading-[1.45] text-ink sm:text-[1.75rem]">
                {t.quote}
              </blockquote>
              <div className="mt-9 border-t border-line pt-6">
                <div className="font-display text-lg font-semibold text-ink">{t.client}</div>
                <div className="mt-1 text-sm uppercase tracking-wider text-accent">{t.scope}</div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              {items.map((x, idx) => (
                <button key={x.id} onClick={() => setI(idx)} aria-label={`Testimonial ${idx + 1}`} className={cn("h-1 rounded-full transition-all duration-500", idx === i ? "w-10 bg-accent" : "w-5 bg-ink/15 hover:bg-ink/30")} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
