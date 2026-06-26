# Design & Build (Next.js 15 + GSAP)

An enterprise-grade marketing site, built with the
Next.js App Router, TypeScript, Tailwind CSS, **GSAP (ScrollTrigger + useGSAP)** and Lucide
icons. The structure and interaction model are inspired by leading Singapore fit-out studios;
all copy, imagery and branding here are original placeholders you can swap for your own.

## Stack
- **Next.js 15** (App Router, RSC, static generation)
- **TypeScript** (strict)
- **Tailwind CSS** (custom tokens: 1480/1280 frame, 20/28px radius, 72/104/144 section spacing, orange accent)
- **GSAP 3 + @gsap/react** — all animation (split-line headings, scroll reveals, counters, parallax, marquee, magnetic, mobile menu timeline)
- **Lucide React** (icons)

## Animations (all GSAP)
- `SplitHeading` — masked line-by-line reveal with stagger
- `Reveal` — fade/translate on scroll via ScrollTrigger
- `Counter` — tween-based number count up
- `Parallax` — scrub-linked parallax
- `MarqueeRow` — infinite logo marquee (seamless, reversible)
- `Magnetic` — pointer-follow micro-interaction
- Hero intro timeline + image scale/parallax; mobile menu open/close timeline
- All wrapped in `useGSAP` for automatic cleanup, with `prefers-reduced-motion` guards

## Pages
`/` Home · `/about` · `/services` · `/projects` · `/projects/[slug]` (SSG) · `/clients` · `/news` · `/contact`

## Home sections
Hero → About (tabbed: Who We Are / Values / Team / Founders + animated stats) → What We Do
(4-phase accordion with sticky image) → Why Atrium (3 pillars, dark) → Projects showcase →
Testimonials slider → Clients marquee → Gallery grid (parallax) → CTA banner.

## Structure
```
src/
├── app/             # routes, layout, metadata, sitemap, robots, JSON-LD
├── components/
│   ├── layout/      # Header, Footer, MobileMenu, LanguageSwitcher
│   ├── sections/    # Hero, AboutTabs, WhatWeDo, WhyChoose, Projects, Testimonials, ...
│   ├── ui/          # Button, Container, Section, Eyebrow, ProjectCard
│   └── anim/        # GSAP: Reveal, SplitHeading, Counter, Parallax, MarqueeRow, Magnetic
├── data/            # dummy datasets (projects, about, phases, news, clients, navigation)
├── hooks/           # useScrolled, useLockBody
├── lib/             # gsap (plugin registration), utils, seo
└── types/           # shared TypeScript types
```

## Getting started
```bash
npm install
npx prisma generate && npx prisma db push
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
```