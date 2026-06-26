import type { ProcessStep, Pillar } from "@/types";

export const processSteps: ProcessStep[] = [
  { number: "01", title: "Register / Login", description: "Create your account in seconds and tell us a little about your business and goals." },
  { number: "02", title: "Select Service", description: "Pick the service or product that fits — web, app, marketing, hosting or a ready-made template." },
  { number: "03", title: "Submit Order", description: "Share your requirements and brief. We confirm scope, timeline and a transparent quote." },
  { number: "04", title: "Give Content", description: "Hand over your content and assets — we keep it simple with a clear checklist." },
  { number: "05", title: "Payment & Delivery", description: "Secure payment, then we build, review and deliver — with support after launch." },
];

export const pillars: Pillar[] = [
  { icon: "zap", title: "Fast Delivery", description: "We move quickly without cutting corners — clear milestones, no missed deadlines, and work shipped on time." },
  { icon: "shield", title: "Reliable Quality", description: "Clean, maintainable code and pixel-perfect design, tested across devices so it works everywhere it matters." },
  { icon: "headphones", title: "Real Support", description: "Prompt communication and genuine after-sales support — we stay with you long after handover." },
];
