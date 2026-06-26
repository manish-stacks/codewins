import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ProjectsExplorer } from "@/components/sections/ProjectsExplorer";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getProjects } from "@/server/queries";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Portfolio",
  description: "Selected client work by CodeWins across government, healthcare, education and more — websites and apps built to perform.",
  path: "/portfolio",
});

export const revalidate = 60;

export default async function PortfolioPage() {
  const projects = await getProjects();
  return (
    <>
      <PageHero eyebrow="Our Work" title={"Work that wins\nfor our clients."} description="A cross-section of recent projects. Filter by industry, or open any case to see the story behind it." />
      <ProjectsExplorer projects={projects} />
      <CtaBanner />
    </>
  );
}
