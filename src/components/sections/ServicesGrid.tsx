import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/anim/SplitHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/anim/Reveal";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { getServices } from "@/server/queries";

export async function ServicesGrid() {
  const services = await getServices();
  return (
    <Section className="bg-surface">
      <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>What We Do</Eyebrow>
            <SplitHeading text={"Services that grow\nyour business."} as="h2" className="mt-5 font-display text-heading font-semibold text-ink" />
          </div>
          <Reveal>
            <Button href="/services" variant="outline">See All Services</Button>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </div>
    </Section>
  );
}
