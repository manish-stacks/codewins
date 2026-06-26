import { Zap, Shield, Headphones } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/anim/SplitHeading";
import { Reveal } from "@/components/anim/Reveal";
import { getPillars } from "@/server/queries";

const iconMap = { zap: Zap, shield: Shield, headphones: Headphones } as const;

export async function WhyChoose() {
  const pillars = await getPillars();
  return (
    <Section className="bg-white">
      <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow>Why CodeWins</Eyebrow>
            <SplitHeading text={"Built well.\nDelivered fast.\nSupported always."} as="h2" className="mt-5 font-display text-heading font-semibold text-ink" />
            <p className="mt-6 max-w-md text-lg leading-relaxed text-secondary">
              We help businesses launch and grow online with web, app and marketing work that's
              crafted with care — and backed by support you can actually rely on.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="grid gap-px overflow-hidden rounded-card-lg bg-line">
              {pillars.map((p, i) => {
                const Icon = iconMap[p.icon];
                return (
                  <Reveal key={i}>
                    <div className="group flex gap-6 bg-white p-8 transition-colors duration-500 hover:bg-surface lg:p-10">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-white">
                        <Icon className="h-6 w-6" strokeWidth={1.7} />
                      </span>
                      <div>
                        <h3 className="font-display text-2xl font-semibold text-ink">{p.title}</h3>
                        <p className="mt-3 text-[15px] leading-relaxed text-secondary">{p.description}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
