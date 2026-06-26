import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/anim/SplitHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/anim/Reveal";
import { ProductCard } from "@/components/ui/ProductCard";
import { getFeaturedProducts } from "@/server/queries";

export async function ProductsMarketplace() {
  const featured = await getFeaturedProducts();
  return (
    <Section className="bg-surface">
      <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>Marketplace</Eyebrow>
            <SplitHeading text={"Premium templates,\nready to ship."} as="h2" className="mt-5 font-display text-heading font-semibold text-ink" />
            <Reveal>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-secondary">
                Admin dashboards, HTML themes and plugins — built by our team, battle-tested on real
                projects, and priced to launch fast.
              </p>
            </Reveal>
          </div>
          <Reveal>
            <Button href="/products" variant="primary">Browse Marketplace</Button>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.slug}>
              <ProductCard product={p} priority={i < 4} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
