import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, Check } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/anim/Reveal";
import { SplitHeading } from "@/components/anim/SplitHeading";
import { MaskReveal } from "@/components/anim/MaskReveal";
import { ProductCard } from "@/components/ui/ProductCard";
import { BuyActions } from "@/components/products/BuyActions";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getProductBySlug, getRelatedProducts } from "@/server/queries";
import { SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

interface PageProps { params: Promise<{ slug: string }> }

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  const url = `${SITE.url}/products/${product.slug}`;
  const title = product.seoTitle || product.title;
  const description = product.seoDesc || product.summary;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description, images: [product.image] },
    twitter: { card: "summary_large_image", title, description, images: [product.image] },
  };
}

export default async function ProductDetail({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(slug);
  const off = Math.round((1 - product.price / product.original) * 100);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.image,
    description: product.summary,
    brand: { "@type": "Brand", name: SITE.legalName },
    aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.sales },
    offers: { "@type": "Offer", price: product.price, priceCurrency: "INR", availability: "https://schema.org/InStock" },
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="pt-[130px] md:pt-[170px]">
        <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-secondary transition-colors hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> All products
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <MaskReveal className="aspect-[16/10] rounded-card-lg bg-surface">
                <Image src={product.image} alt={product.title} fill priority sizes="(max-width:1024px) 100vw, 60vw" className="object-cover" />
              </MaskReveal>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {product.gallery.map((g, i) => (
                  <div key={i} className="relative aspect-[16/11] overflow-hidden rounded-card bg-surface">
                    <Image src={g} alt={`${product.title} ${i + 1}`} fill sizes="20vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <Eyebrow>{product.category}</Eyebrow>
              <SplitHeading text={product.title} as="h1" className="mt-5 font-display text-[clamp(1.9rem,3.5vw,2.75rem)] font-bold leading-tight text-ink" immediate />
              <div className="mt-5 flex items-center gap-4 text-sm text-secondary">
                <span className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("h-4 w-4", i < Math.round(product.rating) ? "fill-accent text-accent" : "text-line")} />
                  ))}
                  <span className="ml-1 font-medium text-ink">{product.rating.toFixed(1)}</span>
                </span>
                <span>·</span>
                <span>{product.sales} sales</span>
              </div>

              <p className="mt-6 text-lg leading-relaxed text-secondary">{product.summary}</p>

              <div className="mt-8 rounded-card-lg border border-line bg-surface p-6">
                <div className="flex items-end gap-3">
                  <span className="font-display text-4xl font-bold text-ink">₹{product.price}</span>
                  <span className="mb-1 text-lg text-secondary line-through">₹{product.original}</span>
                  {off > 0 && <span className="mb-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-white">-{off}%</span>}
                </div>
                <BuyActions
                  product={{
                    id: product.id,
                    slug: product.slug,
                    title: product.title,
                    image: product.image,
                    price: product.price,
                    demoUrl: product.demoUrl,
                  }}
                />
              </div>

              <div className="mt-8">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">What&apos;s included</h3>
                <ul className="mt-4 space-y-2.5">
                  {product.includes.map((inc) => (
                    <li key={inc} className="flex items-center gap-3 text-[15px] text-ink">
                      <Check className="h-4 w-4 text-accent" /> {inc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {product.tags.map((t) => (
                  <span key={t} className="rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-secondary">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section>
        <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4"><Eyebrow>Features</Eyebrow><h2 className="mt-5 font-display text-heading font-semibold text-ink">Everything you need.</h2></div>
            <div className="lg:col-span-8">
              <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {product.features.map((feat) => (
                  <Reveal key={feat}>
                    <div className="flex items-start gap-3 border-b border-line pb-5 text-lg text-ink">
                      <Check className="mt-1 h-5 w-5 shrink-0 text-accent" /> {feat}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-surface">
        <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
          <h2 className="font-display text-heading font-semibold text-ink">You might also like</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </Section>

      <CtaBanner />
    </article>
  );
}
