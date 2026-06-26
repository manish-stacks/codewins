import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "web",
    number: "01",
    title: "Web Design & Development",
    description: "Fast, captivating websites built to convert — from marketing sites to full-stack web apps, designed and engineered end to end.",
    icon: "code",
    features: ["Next.js / React", "Laravel / PHP", "WordPress", "E-commerce", "Web Apps"],
  },
  {
    id: "app",
    number: "02",
    title: "Mobile App Development",
    description: "Native-feeling cross-platform apps that put your business in your users' hands, built with React Native and a polished UX.",
    icon: "smartphone",
    features: ["React Native", "Android & iOS", "App UI/UX", "API Integration", "Play / App Store"],
  },
  {
    id: "marketing",
    number: "03",
    title: "Digital Marketing",
    description: "Performance-led campaigns that grow reach and revenue — SEO, social, ads and content working as one system.",
    icon: "megaphone",
    features: ["SEO", "Social Media", "Google Ads", "Content", "Analytics"],
  },
  {
    id: "hosting",
    number: "04",
    title: "Hosting Solutions",
    description: "Reliable, optimised hosting and DevOps so your sites stay fast and online — a robust foundation for your growth.",
    icon: "server",
    features: ["VPS & Cloud", "Domains", "SSL", "Email", "Maintenance"],
  },
  {
    id: "design",
    number: "05",
    title: "UI / UX Design",
    description: "Interfaces people love to use — research-led product and brand design, from wireframes to polished design systems.",
    icon: "palette",
    features: ["Wireframes", "UI Kits", "Prototyping", "Design Systems", "Branding"],
  },
  {
    id: "seo",
    number: "06",
    title: "SEO & Growth",
    description: "Data-driven optimisation that compounds — technical SEO, content and CRO to keep your pipeline full.",
    icon: "search",
    features: ["Technical SEO", "Keyword Strategy", "On-page", "Backlinks", "Reporting"],
  },
];
