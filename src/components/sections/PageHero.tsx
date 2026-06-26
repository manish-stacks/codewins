import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/anim/SplitHeading";
import { Reveal } from "@/components/anim/Reveal";

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <section className="border-b border-line bg-surface pb-section pt-[150px] md:pb-section-md md:pt-[190px]">
      <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
        <Eyebrow>{eyebrow}</Eyebrow>
        <SplitHeading text={title} as="h1" className="mt-6 max-w-4xl font-display text-display font-extrabold text-ink" immediate />
        {description && (
          <Reveal>
            <p className="mt-8 max-w-2xl text-xl leading-relaxed text-secondary">{description}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
