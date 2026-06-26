import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { AboutTabs } from "@/components/sections/AboutTabs";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getStats, getValues, getFounders, getTestimonials } from "@/server/queries";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "About",
  description: "CodeWins Technologies is a web design, development and digital marketing studio in New Delhi, helping businesses launch and grow online.",
  path: "/about",
});

export const revalidate = 60;

export default async function AboutPage() {
  const [stats, values, founders, testimonials] = await Promise.all([
    getStats("about"),
    getValues(),
    getFounders(),
    getTestimonials(),
  ]);

  return (
    <>
      <PageHero eyebrow="About Us" title={"A studio built\nto help you win."} description="We're a freelance-rooted team of designers, developers and marketers crafting digital work that performs." />
      <AboutTabs stats={stats} values={values} founders={founders} />
      <WhyChoose />
      <Testimonials items={testimonials} />
      <CtaBanner />
    </>
  );
}
