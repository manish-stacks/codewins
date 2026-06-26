import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/anim/Reveal";
import { SplitHeading } from "@/components/anim/SplitHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { serviceIcons } from "@/lib/icons";
import { getServices, getServiceBySlug } from "@/server/queries";
import { SITE } from "@/lib/seo";

interface PageProps { params: Promise<{ slug: string }> }

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };
  const url = `${SITE.url}/services/${service.id}`;
  const title = service.seoTitle || service.title;
  const description = service.seoDesc || service.description;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description, ...(service.image ? { images: [service.image] } : {}) },
  };
}

export default async function ServiceDetail({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const all = await getServices();
  const others = all.filter((s) => s.id !== service.id).slice(0, 3);
  const Icon = serviceIcons[service.icon];

  return (
    <article>
      {/* Hero */}
      <section className="border-b border-line bg-surface pb-section pt-[150px] md:pb-section-md md:pt-[190px]">
        <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm text-secondary transition-colors hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> All services
          </Link>
          <div className="mt-8 flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <Icon className="h-6 w-6" strokeWidth={1.7} />
            </span>
            <Eyebrow>Service {service.number}</Eyebrow>
          </div>
          <SplitHeading text={service.title} as="h1" className="mt-6 max-w-4xl font-display text-display font-extrabold text-ink" immediate />
          <Reveal>
            {service.longDescription ? (
              <div
                className="prose-cw mt-8 max-w-2xl text-xl leading-relaxed text-secondary [&_a]:text-accent [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink [&_p]:mt-4"
                dangerouslySetInnerHTML={{ __html: service.longDescription }}
              />
            ) : (
              <p className="mt-8 max-w-2xl text-xl leading-relaxed text-secondary">{service.description}</p>
            )}
          </Reveal>
          <Reveal>
            <div className="mt-10"><Button href="/contact">Get a Quote</Button></div>
          </Reveal>
        </div>
      </section>

      {/* What's included */}
      <Section className="bg-white">
        <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Eyebrow>What&apos;s included</Eyebrow>
              <h2 className="mt-5 font-display text-heading font-semibold text-ink">Everything you get.</h2>
            </div>
            <div className="lg:col-span-8">
              <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {service.features.map((feat) => (
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

      {/* FAQs (optional) */}
      {service.faqs && service.faqs.length > 0 && (
        <Section className="bg-surface">
          <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
            <Eyebrow>FAQs</Eyebrow>
            <h2 className="mt-5 font-display text-heading font-semibold text-ink">Common questions.</h2>
            <div className="mt-10 grid gap-x-12 gap-y-8 lg:grid-cols-2">
              {service.faqs.map((f) => (
                <Reveal key={f.q}>
                  <h3 className="font-display text-xl font-semibold text-ink">{f.q}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-secondary">{f.a}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Other services */}
      <Section className="bg-white">
        <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
          <h2 className="font-display text-heading font-semibold text-ink">Other services</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {others.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
          </div>
        </div>
      </Section>

      <CtaBanner />
    </article>
  );
}
