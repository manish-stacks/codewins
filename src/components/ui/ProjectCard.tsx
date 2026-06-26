"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MaskReveal } from "@/components/anim/MaskReveal";

import type { Project } from "@/types";

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <Link href={`/portfolio/${project.slug}`} className="group block">
      <MaskReveal className="aspect-[4/3] rounded-card">
        <Image src={project.cover} alt={project.name} fill priority={priority} sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw" className="object-cover transition-transform duration-[1.1s] ease-smooth group-hover:scale-[1.06]" />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-ink backdrop-blur">{project.category}</span>
        <span className="absolute right-4 top-4 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-accent text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </MaskReveal>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xl font-semibold text-ink transition-colors duration-300 group-hover:text-accent">{project.name}</h3>
        <span className="shrink-0 text-sm text-secondary">{project.year}</span>
      </div>
      <p className="mt-2 text-[15px] leading-relaxed text-secondary">{project.summary}</p>
    </Link>
  );
}
