import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/anim/SplitHeading";
import { Reveal } from "@/components/anim/Reveal";
import { MaskReveal } from "@/components/anim/MaskReveal";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getProjectBySlug, getRelatedProjects } from "@/server/queries";
import { SITE } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  const url = `${SITE.url}/portfolio/${project.slug}`;
  const title = project.seoTitle || `${project.name} — ${project.client}`;
  const description = project.seoDesc || project.summary;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title, description, images: [project.cover] },
    twitter: { card: "summary_large_image", title, description, images: [project.cover] },
  };
}

export default async function ProjectDetail({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const related = await getRelatedProjects(slug);
  const meta = [
    { label: "Location", value: project.location },
    { label: "Industry", value: project.industry },
    { label: "Scope of Work", value: project.scope },
    { label: "Year", value: project.year },
    { label: "Website", value: project.url },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    creator: { "@type": "Organization", name: SITE.legalName },
    about: project.summary,
    dateCreated: project.year,
    image: project.cover,
    locationCreated: project.location,
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Banner */}
      <section className="pt-[130px] md:pt-[170px]">
        <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm text-secondary transition-colors hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> All projects
          </Link>
          <div className="mt-8"><Eyebrow>{project.category}</Eyebrow></div>
          <SplitHeading text={project.name} as="h1" className="mt-5 font-display text-display font-extrabold text-ink" immediate />
          <Reveal><p className="mt-6 max-w-2xl text-xl leading-relaxed text-secondary">{project.summary}</p></Reveal>
        </div>
        <Reveal className="mt-12 lg:mt-16">
          <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
            <MaskReveal className="aspect-[16/9] rounded-card-lg bg-surface">
              <Image src={project.cover} alt={project.name} fill priority sizes="100vw" className="object-cover" />
            </MaskReveal>
          </div>
        </Reveal>
      </section>

      {/* Info grid + description */}
      <Section>
        <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 lg:grid-cols-1">
                  {meta.map((m) => (
                    <div key={m.label}>
                      <dt className="text-xs uppercase tracking-[0.16em] text-secondary">{m.label}</dt>
                      <dd className="mt-2 text-lg text-ink">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              <Reveal><Eyebrow>The Story</Eyebrow></Reveal>
              <Reveal>
                {project.descriptionHtml ? (
                  <div
                    className="prose-cw mt-6 max-w-2xl space-y-5 text-lg leading-relaxed text-secondary [&_a]:text-accent [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink [&_p]:mt-4"
                    dangerouslySetInnerHTML={{ __html: project.descriptionHtml }}
                  />
                ) : (
                  <div className="mt-6 space-y-5">
                    {project.description.map((para, i) => (
                      <p key={i} className="max-w-2xl text-lg leading-relaxed text-secondary">{para}</p>
                    ))}
                  </div>
                )}
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      {/* Gallery */}
      <section className="pb-section md:pb-section-md lg:pb-section-lg">
        <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
          <div className="grid gap-5 lg:grid-cols-2">
            {project.gallery.map((img, i) => (
              <MaskReveal key={img} direction={i % 2 === 0 ? "up" : "down"} className={`rounded-card-lg bg-surface ${i === 0 ? "aspect-[16/10] lg:col-span-2" : "aspect-[4/3]"}`}>
                <Image src={img} alt={`${project.name} ${i + 1}`} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
              </MaskReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <Section className="bg-surface">
        <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-heading font-semibold text-ink">More projects</h2>
            <Button href="/portfolio" variant="outline">See all works</Button>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
            {related.map((p) => <ProjectCard key={p.slug} project={p} />)}
          </div>
        </div>
      </Section>

      <CtaBanner />
    </article>
  );
}
