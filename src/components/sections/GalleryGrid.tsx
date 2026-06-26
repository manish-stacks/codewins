import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/anim/SplitHeading";
import { MaskReveal } from "@/components/anim/MaskReveal";
import { getGallery } from "@/server/queries";
import { cn } from "@/lib/utils";

export async function GalleryGrid() {
  const galleryImages = await getGallery();
  return (
    <Section className="bg-white">
      <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <Eyebrow>In The Frame</Eyebrow>
          <SplitHeading text={"A look inside\nthe spaces we build."} as="h2" className="mt-5 font-display text-heading font-semibold text-ink" />
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {galleryImages.map((src, i) => {
            const tall = i % 5 === 0 || i % 5 === 3;
            const dir = i % 2 === 0 ? "up" : "down";
            return (
              <MaskReveal key={src} direction={dir} className={cn("rounded-card", tall ? "row-span-2 aspect-[3/4]" : "aspect-square")}>
                <Image src={src} alt={`Project detail ${i + 1}`} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 hover:scale-105" />
              </MaskReveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
