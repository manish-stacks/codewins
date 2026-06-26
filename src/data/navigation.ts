import type { NavItem } from "@/types";

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
];

export const contact = {
  email: "info@codewins.in",
  phone: "+91 62000 27897",
  phoneAlt: "+91 70379 58642",
  whatsapp: "916200027897",
  address: "Kadipur Pur, Burari, New Delhi 110084",
  hours: "Mon – Sat, 10:00 AM to 7:00 PM",
  socials: [
    { label: "Facebook", href: "https://facebook.com/codewins" },
    { label: "Instagram", href: "https://instagram.com/codewins_technologies" },
    { label: "WhatsApp", href: "https://wa.me/916200027897" },
  ],
};

export const footerLinks = {
  services: [
    { label: "Web Design & Development", href: "/services" },
    { label: "Mobile App Development", href: "/services" },
    { label: "Digital Marketing", href: "/services" },
    { label: "Hosting Solutions", href: "/services" },
  ],
  products: [
    { label: "Admin Templates", href: "/products" },
    { label: "HTML Templates", href: "/products" },
    { label: "Dashboard Kits", href: "/products" },
    { label: "Plugins", href: "/products" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Contact", href: "/contact" },
    { label: "Get a Quote", href: "/contact" },
  ],
};
