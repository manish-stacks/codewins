"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/anim/SplitHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Button } from "@/components/ui/Button";
import type { Project } from "@/types";
import { pad } from "@/lib/utils";

export function ProjectsShowcase({ featured }: { featured: Project[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: pin the section and scroll the track horizontally
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current;
        if (!el) return;
        const distance = el.scrollWidth - window.innerWidth;
        if (distance <= 0) return;

        const tween = gsap.to(el, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance + window.innerHeight * 0.4}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        // subtle parallax on each panel image while scrolling across
        gsap.utils.toArray<HTMLElement>("[data-panel-img]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: img.closest("[data-panel]"),
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section className="bg-white">
      {/* heading */}
      <div className="mx-auto max-w-frame px-6 pt-section sm:px-8 md:pt-section-md lg:px-12 lg:pt-section-lg">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>Selected Work</Eyebrow>
            <SplitHeading text={"Projects that\ndefine our craft."} as="h2" className="mt-5 font-display text-heading font-semibold text-ink" />
          </div>
          <Button href="/portfolio" variant="outline" className="hidden md:inline-flex">See All Works</Button>
        </div>
      </div>

      {/* DESKTOP: pinned horizontal track */}
      <div ref={root} className="mt-12 hidden lg:block">
        <div ref={track} className="flex w-max items-stretch gap-8 pl-[max(2rem,calc((100vw-1480px)/2+3rem))] pr-[12vw]">
          {featured.map((p, i) => (
            <Link
              key={p.slug}
              href={`/portfolio/${p.slug}`}
              data-panel
              className="group relative flex w-[52vw] max-w-[760px] shrink-0 flex-col"
            >
              <div className="relative aspect-[16/11] overflow-hidden rounded-card-lg bg-surface">
                <div data-panel-img className="absolute inset-0 scale-110">
                  <Image src={p.cover} alt={p.name} fill sizes="60vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-carbon/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-ink backdrop-blur">{p.category}</span>
                <span className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-6 flex items-end justify-between gap-6">
                <div>
                  <span className="font-display text-sm font-semibold text-accent">{pad(i + 1)}</span>
                  <h3 className="mt-1 font-display text-3xl font-semibold text-ink">{p.name}</h3>
                  <p className="mt-2 max-w-md text-[15px] leading-relaxed text-secondary">{p.summary}</p>
                </div>
                <span className="shrink-0 text-sm text-secondary">{p.year}</span>
              </div>
            </Link>
          ))}

          {/* end panel */}
          <Link href="/portfolio" data-panel className="flex w-[26vw] shrink-0 flex-col items-start justify-center rounded-card-lg bg-surface p-10">
            <span className="font-display text-3xl font-semibold text-ink">View the full portfolio</span>
            <span className="mt-6 inline-flex items-center gap-2 text-accent">
              See all works <ArrowUpRight className="h-5 w-5" />
            </span>
          </Link>
        </div>
      </div>

      {/* MOBILE/TABLET: stacked grid */}
      <div className="mx-auto mt-12 max-w-frame px-6 pb-section sm:px-8 md:pb-section-md lg:hidden">
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {featured.map((p, i) => (
            <ProjectCard key={p.slug} project={p} priority={i < 2} />
          ))}
        </div>
        <div className="mt-12">
          <Button href="/portfolio" variant="outline">See All Works</Button>
        </div>
      </div>
    </section>
  );
}
