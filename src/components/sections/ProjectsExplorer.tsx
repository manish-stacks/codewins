"use client";

import { useMemo, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projectCategories } from "@/data/projects";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>("All");
  const grid = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects]
  );

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        grid.current?.children ?? [],
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" }
      );
    },
    { dependencies: [filter], scope: grid }
  );

  return (
    <Section className="bg-white">
      <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center gap-3 border-b border-line pb-8">
          {projectCategories.map((c) => {
            const active = filter === c;
            return (
              <button key={c} onClick={() => setFilter(c)} className={cn("rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300", active ? "border-accent bg-accent text-white" : "border-ink/15 text-secondary hover:border-ink hover:text-ink")}>
                {c}
              </button>
            );
          })}
          <span className="ml-auto hidden text-sm text-secondary sm:block">{filtered.length} {filtered.length === 1 ? "project" : "projects"}</span>
        </div>

        <div ref={grid} className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <ProjectCard key={p.slug} project={p} priority={i < 3} />
          ))}
        </div>
      </div>
    </Section>
  );
}
