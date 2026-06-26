import Link from "next/link";
import { Facebook, Instagram, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { SplitHeading } from "@/components/anim/SplitHeading";
import { Reveal } from "@/components/anim/Reveal";
import { navItems } from "@/data/navigation";
import { getContact, getFooterLinks, getSiteSettings } from "@/server/queries";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { SITE } from "@/lib/seo";
import Image from "next/image";

const socialIcons = { Facebook, Instagram, WhatsApp: MessageCircle } as const;

export async function Footer() {
  const year = new Date().getFullYear();
  const [contact, footerLinks, settings] = await Promise.all([getContact(), getFooterLinks(), getSiteSettings()]);

  return (
    <footer className="bg-carbon text-white">
      <div className="mx-auto max-w-frame px-6 py-section md:py-section-md lg:px-12">
        {/* Newsletter / brand */}
        <div className="grid gap-12 border-b border-white/12 pb-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Link href="/" className="font-display text-3xl font-extrabold tracking-tight">
              <Image src={settings.logo || "https://codewins.in/assets/uploads/media-uploader/logo11701255144.png"} alt={SITE.name} width={200} height={32} />
            </Link>
            <SplitHeading text={"Build your next\nproject with us."} as="p" className="mt-6 max-w-md font-display text-2xl font-medium leading-tight text-white/90 sm:text-3xl" />
          </div>
          <div className="lg:col-span-6">
            <Reveal>
              <h3 className="text-xs uppercase tracking-[0.18em] text-white/45">Subscribe to our newsletter</h3>
              <NewsletterForm />
              <div className="mt-6 flex items-center gap-3">
                {contact.socials.map((s) => {
                  const Icon = socialIcons[s.label as keyof typeof socialIcons];
                  return (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-accent hover:bg-accent hover:text-white">
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <FooterCol title="Services" links={footerLinks.services} />
          <FooterCol title="Products" links={footerLinks.products} />
          <FooterCol title="Company" links={footerLinks.company} />
          <div>
            <h3 className="text-xs uppercase tracking-[0.18em] text-white/45">Contact</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><span>{contact.address}</span></li>
              <li className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><a href={`tel:${contact.phone}`} className="hover:text-white">{contact.phone}</a></li>
              <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/12 pt-8 text-sm text-white/45 sm:flex-row sm:items-center">
          <span>© {year} {SITE.legalName}. All rights reserved.</span>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {navItems.map((n) => (
              <Link key={n.href} href={n.href} className="transition-colors hover:text-white">{n.label}</Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.18em] text-white/45">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((l, i) => (
          <li key={`${l.label}-${i}`}>
            <Link href={l.href} className="text-sm text-white/75 transition-colors hover:text-white">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
