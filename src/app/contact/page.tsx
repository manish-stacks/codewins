import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { getContact } from "@/server/queries";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description: "Get a quote from CodeWins Technologies — web design, development, apps and digital marketing in New Delhi. We reply within a working day.",
  path: "/contact",
});

export default async function ContactPage() {
  const contact = await getContact();
  return (
    <>
      <PageHero eyebrow="Get In Touch" title={"Let's build\nsomething great."} description="Tell us about your project or pick a template — we'll get back to you within one working day." />
      <ContactForm contact={contact} />
    </>
  );
}
