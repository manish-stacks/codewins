"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MagneticButton } from "@/components/anim/MagneticButton";
import { Eyebrow } from "@/components/ui/Eyebrow";

const HERO_IMG =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2000&q=80";

const lines = [["Build", "your", "next"], ["project", "with"], ["CodeWins."]];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Calm, minimal entrance: shorter travel distances, softer eases,
      // no overshoot/bounce, slightly longer but quieter timeline.
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.set("[data-hero-mask]", { clipPath: "inset(0% 0% 100% 0%)" })
        .set("[data-hero-img]", { scale: 1.1 })
        .to(
          "[data-hero-mask]",
          { clipPath: "inset(0%)", duration: 1.5, ease: "power2.inOut" },
          0.1
        )
        .to("[data-hero-img]", { scale: 1, duration: 1.8, ease: "power1.out" }, 0.1)
        .fromTo(
          "[data-hero-eyebrow]",
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          0.6
        )
        .fromTo(
          "[data-hero-word]",
          { yPercent: 40, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power2.out" },
          0.75
        )
        .fromTo(
          "[data-hero-sub]",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          1.3
        )
        .fromTo(
          "[data-hero-cta]",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          1.42
        )
        .fromTo(
          "[data-hero-scroll]",
          { opacity: 0 },
          { opacity: 1, duration: 0.9 },
          1.6
        );

      // Subtler parallax — less travel, no opacity fade on scroll (keeps it clean/static-feeling)
      gsap.to("[data-hero-img]", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-content]", {
        yPercent: -4,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative flex min-h-screen items-end overflow-hidden">
      <div data-hero-mask className="absolute inset-0 overflow-hidden">
        <div data-hero-img className="absolute inset-0 will-change-transform">
          <Image src={HERO_IMG} alt="CodeWins team building software" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon/90 via-carbon/45 to-carbon/55" />
        </div>
      </div>

      <div data-hero-content className="relative z-10 mx-auto w-full max-w-frame px-6 pb-20 pt-[120px] sm:px-8 lg:px-12 lg:pb-24">
        <div data-hero-eyebrow>
          <Eyebrow light>Web · App · Marketing · New Delhi</Eyebrow>
        </div>

        <h1 className="mt-6 max-w-4xl font-display text-display font-extrabold text-white">
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.04em]">
              {line.map((w, j) => (
                <span key={j} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
                  <span data-hero-word className="inline-block">{w === "CodeWins." ? <span className="text-accent">{w}</span> : w}</span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p data-hero-sub className="mt-8 max-w-xl text-lg leading-relaxed text-white/80">
          We&apos;re a web design, development and digital marketing studio crafting captivating
          websites and apps — and we sell premium, ready-to-ship templates and plugins too.
        </p>

        <div data-hero-cta className="mt-10 flex flex-wrap gap-3">
          <MagneticButton href="/contact" variant="primary">Get a Quote</MagneticButton>
          <MagneticButton href="/products" variant="light">Browse Templates</MagneticButton>
        </div>
      </div>

      <div data-hero-scroll className="absolute bottom-8 right-6 z-10 hidden items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70 lg:flex lg:right-12">
        Scroll
        <ArrowDown className="h-4 w-4" />
      </div>
    </section>
  );
}