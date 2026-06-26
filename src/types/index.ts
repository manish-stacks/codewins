export interface NavItem {
  label: string;
  href: string;
}

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export type ServiceIconKey =
  | "code" | "smartphone" | "megaphone" | "server" | "palette" | "search";

export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: ServiceIconKey;
  features: string[];
}

export interface ValueItem {
  number: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface Pillar {
  icon: "zap" | "shield" | "headphones";
  title: string;
  description: string;
}

export type ProjectCategory = "Government" | "Medical & Hospital" | "Schools & Institutes" | "Other";

export interface Project {
  slug: string;
  name: string;
  client: string;
  category: ProjectCategory;
  year: string;
  location: string;
  industry: string;
  scope: string;
  url: string;
  summary: string;
  description: string[];
  cover: string;
  gallery: string[];
  featured?: boolean;
}

export type ProductCategory = "Admin Template" | "HTML Template" | "Dashboard Kit" | "Plugin";

export interface Product {
  slug: string;
  title: string;
  category: ProductCategory;
  price: number;
  original: number;
  image: string;
  gallery: string[];
  rating: number;
  sales: number;
  tags: string[];
  summary: string;
  features: string[];
  includes: string[];
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  client: string;
  scope: string;
  quote: string;
}

export interface Founder {
  name: string;
  role: string;
  image: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Contact {
  email: string;
  phone: string;
  phoneAlt: string;
  whatsapp: string;
  address: string;
  hours: string;
  socials: SocialLink[];
}
