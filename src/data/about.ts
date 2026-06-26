import type { Stat, ValueItem, Founder } from "@/types";

export const aboutTabs = [
  { id: "who", label: "Who We Are", href: "#who" },
  { id: "values", label: "Our Values", href: "#values" },
  { id: "team", label: "Our Team", href: "#team" },
  { id: "founders", label: "Founders", href: "#founders" },
];

export const aboutStats: Stat[] = [
  { value: 8, suffix: "+", label: "Years in business" },
  { value: 500, suffix: "+", label: "Projects delivered" },
  { value: 1000, suffix: "+", label: "Happy customers" },
];

export const values: ValueItem[] = [
  { number: "01", title: "Client First", description: "Every decision starts with your goals. We build for outcomes, not just deliverables." },
  { number: "02", title: "Clean Craft", description: "Maintainable code and considered design — work we're proud to put our name on." },
  { number: "03", title: "On Time", description: "Clear milestones and honest timelines. We ship when we say we will." },
  { number: "04", title: "Real Support", description: "We stay reachable and helpful long after launch — partnership, not a one-off." },
];

export const teamDisciplines = [
  "Web Developers",
  "App Developers",
  "UI / UX Designers",
  "Digital Marketers",
  "SEO Specialists",
  "QA & Support",
  "Project Managers",
];

const f = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

export const founders: Founder[] = [
  { name: "Ravi Kumar", role: "Founder & Lead Developer", image: f("photo-1507003211169-0a1dd7228f2d") },
  { name: "Anjali Sharma", role: "Co-founder & Design Lead", image: f("photo-1573496359142-b8d87734a5a2") },
  { name: "Amit Singh", role: "Co-founder & Marketing Lead", image: f("photo-1560250097-0b93528c311a") },
];
