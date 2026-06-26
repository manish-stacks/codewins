import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { WorkProcess } from "@/components/sections/WorkProcess";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getProcessSteps } from "@/server/queries";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Services",
  description: "Web design & development, mobile apps, digital marketing, hosting, UI/UX and SEO — full-stack digital services from CodeWins Technologies.",
  path: "/services",
});

export const revalidate = 60;

export default async function ServicesPage() {
  const steps = await getProcessSteps();
  return (
    <>
      <PageHero eyebrow="What We Do" title={"Services that grow\nyour business online."} description="From a single landing page to a full product and marketing engine — we design, build and grow it with you." />
      <ServicesGrid />
      <WorkProcess steps={steps} />
      <WhyChoose />
      <CtaBanner />
    </>
  );
}
