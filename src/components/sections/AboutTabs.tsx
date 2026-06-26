"use client";

import { useState } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/anim/SplitHeading";
import { Reveal } from "@/components/anim/Reveal";
import { MaskReveal } from "@/components/anim/MaskReveal";
import { Counter } from "@/components/anim/Counter";
import { aboutTabs, teamDisciplines } from "@/data/about";
import type { Stat, ValueItem, Founder } from "@/types";
import { cn } from "@/lib/utils";

const TEAM_IMG =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80";

export function AboutTabs({
  stats,
  values,
  founders,
}: {
  stats: Stat[];
  values: ValueItem[];
  founders: Founder[];
}) {
  const [tab, setTab] = useState(aboutTabs[0].id);

  return (
    <Section className="bg-white">
      <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>About Us</Eyebrow>
            <SplitHeading text={"A freelance studio\nthat ships great work."} as="h2" className="mt-5 font-display text-heading font-semibold text-ink" />
          </div>
          <div className="flex flex-wrap gap-2">
            {aboutTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300",
                  tab === t.id ? "border-accent bg-accent text-white" : "border-ink/15 text-secondary hover:border-ink hover:text-ink"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14">
          {tab === "who" && (
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <MaskReveal className="aspect-[4/3] rounded-card-lg bg-surface">
                <Image src={TEAM_IMG} alt="CodeWins studio" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
              </MaskReveal>
              <div className="flex flex-col justify-center">
                <Reveal>
                  <p className="text-xl leading-relaxed text-secondary">
                    CodeWins Technologies is a web design, development and digital marketing studio
                    based in New Delhi. We help businesses launch captivating websites and apps,
                    grow online, and ship faster with our ready-made templates and plugins.
                  </p>
                </Reveal>
                <div className="mt-12 grid grid-cols-3 gap-6">
                  {stats.map((s,i) => (
                    <Reveal key={i}>
                      <div className="border-t border-line pt-5">
                        <div className="font-display text-4xl font-semibold text-ink lg:text-5xl">
                          <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                        </div>
                        <div className="mt-2 text-sm leading-snug text-secondary">{s.label}</div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "values" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v) => (
                <Reveal key={v.number}>
                  <div className="group h-full rounded-card-lg border border-line bg-surface p-7 transition-colors duration-500 hover:border-accent/40">
                    <span className="font-display text-sm font-semibold text-accent">{v.number}</span>
                    <h3 className="mt-5 font-display text-2xl font-semibold text-ink">{v.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-secondary">{v.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          {tab === "team" && (
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center">
                <Reveal>
                  <p className="text-xl leading-relaxed text-secondary">
                    A lean, multi-disciplinary team takes every project from first call to launch —
                    designers, developers and marketers working side by side.
                  </p>
                </Reveal>
                <div className="mt-10 flex flex-wrap gap-2.5">
                  {teamDisciplines.map((d) => (
                    <span key={d} className="rounded-full border border-line px-4 py-2 text-sm text-secondary">{d}</span>
                  ))}
                </div>
              </div>
              <MaskReveal className="aspect-[4/3] rounded-card-lg bg-surface">
                <Image src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1400&q=80" alt="Our team" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
              </MaskReveal>
            </div>
          )}

          {tab === "founders" && (
            <div className="grid gap-6 sm:grid-cols-3">
              {founders.map((f) => (
                <Reveal key={f.name}>
                  <div className="group">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-card-lg bg-surface">
                      <Image src={f.image} alt={f.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold text-ink">{f.name}</h3>
                    <p className="mt-1 text-sm text-accent">{f.role}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
