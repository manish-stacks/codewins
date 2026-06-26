import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/anim/SmoothScroll";
import { ScrollProgress } from "@/components/anim/ScrollProgress";
import { ScriptInjector } from "@/components/layout/ScriptInjector";
import { SITE } from "@/lib/seo";
import { getContact, getSiteSettings } from "@/server/queries";
import { getSession } from "@/lib/auth";
import { ConditionalChrome } from "@/components/layout/ConditionalChrome";
import { CartProvider } from "@/components/cart/CartProvider";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const keywords = s.keywords
    ? s.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : undefined;
  return {
    metadataBase: new URL(SITE.url),
    title: { default: s.siteTitle, template: s.titleTemplate },
    description: s.description,
    keywords,
    authors: [{ name: SITE.legalName }],
    alternates: { canonical: "/" },
    icons: s.favicon ? { icon: s.favicon, shortcut: s.favicon, apple: s.favicon } : undefined,
    openGraph: {
      type: "website",
      url: SITE.url,
      siteName: SITE.legalName,
      title: s.siteTitle,
      description: s.description,
      ...(s.ogImage ? { images: [s.ogImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: s.siteTitle,
      description: s.description,
      ...(s.ogImage ? { images: [s.ogImage] } : {}),
      ...(s.twitterHandle ? { site: s.twitterHandle, creator: s.twitterHandle } : {}),
    },
    robots: { index: s.robotsIndex, follow: s.robotsIndex },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [contact, settings, session] = await Promise.all([
    getContact(),
    getSiteSettings(),
    getSession(),
  ]);

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.legalName,
    url: SITE.url,
    description: settings.description,
    email: contact.email,
    telephone: contact.phone,
    address: { "@type": "PostalAddress", streetAddress: contact.address, addressCountry: "IN" },
    sameAs: contact.socials.map((s) => s.href),
    ...(settings.logo ? { logo: settings.logo } : {}),
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        {/* Admin-managed analytics / custom head scripts */}
        <ScriptInjector html={settings.headerScripts} target="head" />
        <CartProvider>
          <SmoothScroll>
            <ScrollProgress />
            <ConditionalChrome
              header={<Header contact={contact} session={session} logo={settings.logo} />}
              footer={<Footer />}
            >
              {children}
            </ConditionalChrome>
          </SmoothScroll>
        </CartProvider>
        {/* Admin-managed footer scripts (chat widgets, deferred analytics) */}
        <ScriptInjector html={settings.footerScripts} target="body" />
      </body>
    </html>
  );
}
