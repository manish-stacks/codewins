import { Hero } from "@/components/sections/Hero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { Statistics } from "@/components/sections/Statistics";
import { ProductsMarketplace } from "@/components/sections/ProductsMarketplace";
import { WorkProcess } from "@/components/sections/WorkProcess";
import { ProjectsShowcase } from "@/components/sections/ProjectsShowcase";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { Testimonials } from "@/components/sections/Testimonials";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getFeaturedProjects, getTestimonials, getProcessSteps } from "@/server/queries";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, testimonials, steps] = await Promise.all([
    getFeaturedProjects(),
    getTestimonials(),
    getProcessSteps(),
  ]);

  return (
    <>
      <Hero />
      <ServicesGrid />
      <Statistics />
      <ProductsMarketplace />
      <WorkProcess steps={steps} />
      <ProjectsShowcase featured={featured} />
      <WhyChoose />
      <Testimonials items={testimonials} />
      <TechMarquee />
      <CtaBanner />
    </>
  );
}
