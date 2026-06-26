import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/anim/Reveal";
import { SplitHeading } from "@/components/anim/SplitHeading";
import { MaskReveal } from "@/components/anim/MaskReveal";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getBlogPostBySlug, getRelatedPosts } from "@/server/queries";
import { SITE } from "@/lib/seo";

interface PageProps { params: Promise<{ slug: string }> }

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  const url = `${SITE.url}/news/${post.slug}`;
  const title = post.seoTitle || post.title;
  const description = post.seoDesc || post.excerpt;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title, description, images: [post.image] },
    twitter: { card: "summary_large_image", title, description, images: [post.image] },
  };
}

export default async function BlogDetail({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();
  const related = await getRelatedPosts(slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.image,
    description: post.excerpt,
    author: { "@type": "Organization", name: SITE.legalName },
    publisher: { "@type": "Organization", name: SITE.legalName },
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="pt-[130px] md:pt-[170px]">
        <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
          <Link href="/news" className="inline-flex items-center gap-2 text-sm text-secondary transition-colors hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> All posts
          </Link>
          <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-accent">
            <span>{post.category}</span>
            <span className="h-px w-5 bg-line" />
            <span className="text-secondary">{post.date}</span>
            <span className="h-px w-5 bg-line" />
            <span className="flex items-center gap-1 text-secondary"><Clock className="h-3.5 w-3.5" /> {post.readTime} min read</span>
          </div>
          <SplitHeading text={post.title} as="h1" className="mt-5 max-w-4xl font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-tight text-ink" immediate />
        </div>
        <Reveal className="mt-10 lg:mt-14">
          <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
            <MaskReveal className="aspect-[16/9] rounded-card-lg bg-surface">
              <Image src={post.image} alt={post.title} fill priority sizes="100vw" className="object-cover" />
            </MaskReveal>
          </div>
        </Reveal>
      </section>

      <Section>
        <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl">
            <div
              className="prose-cw space-y-5 text-lg leading-relaxed text-secondary [&_a]:text-accent [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <div className="mt-10 border-t border-line pt-6 text-sm text-secondary">By {post.author}</div>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section className="bg-surface">
          <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
            <h2 className="font-display text-heading font-semibold text-ink">More from the blog</h2>
            <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {related.map((n) => (
                <Link key={n.slug} href={`/news/${n.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface">
                    <Image src={n.image} alt={n.title} fill sizes="(max-width:1024px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-accent">
                    <span>{n.category}</span>
                    <span className="h-px w-5 bg-line" />
                    <span className="text-secondary">{n.date}</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-accent">{n.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}

      <CtaBanner />
    </article>
  );
}
