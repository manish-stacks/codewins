import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/anim/SplitHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/anim/Reveal";

const IMG = "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=1600&q=80";

export function CtaBanner() {
  return (
    <Section className="bg-surface">
      <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-card-lg bg-carbon">
          <Image src={IMG} alt="" fill sizes="100vw" className="object-cover opacity-30" />
          <div className="relative z-10 px-8 py-20 text-center lg:px-16 lg:py-28">
            <div className="flex justify-center">
              <Eyebrow light>Let&apos;s Build Together</Eyebrow>
            </div>
            <SplitHeading
              text={"Bring your office vision\nto life — connect with us today."}
              as="h2"
              className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.05] text-white"
            />
            <Reveal className="mt-10 flex justify-center">
              <Button href="/contact" variant="primary">Send Your Inquiry</Button>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
