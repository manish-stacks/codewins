import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/anim/Reveal";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getBlogPosts } from "@/server/queries";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Blog",
  description: "Web design, development and digital marketing insights, project updates and studio news from the CodeWins Technologies team.",
  path: "/news",
});

export const revalidate = 60;

export default async function NewsPage() {
  const posts = await getBlogPosts();
  return (
    <>
      <PageHero eyebrow="Blog" title={"News, updates\n& insights."} description="Tips on web, apps and marketing, project milestones, and our point of view on building for the web." />
      <Section className="bg-white">
        <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((n, i) => (
              <Reveal key={n.slug}>
                <Link href={`/news/${n.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface">
                    <Image src={n.image} alt={n.title} fill priority={i < 3} sizes="(max-width:1024px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-accent">
                    <span>{n.category}</span>
                    <span className="h-px w-5 bg-line" />
                    <span className="text-secondary">{n.date}</span>
                  </div>
                  <h2 className="mt-4 font-display text-xl font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-accent">{n.title}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-secondary">{n.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
      <CtaBanner />
    </>
  );
}
