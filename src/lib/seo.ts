import type { Metadata } from "next";

export const SITE = {
  name: "CodeWins",
  legalName: "CodeWins Technologies",
  url: "https://codewins.in",
  description:
    "CodeWins Technologies is a web design, development and digital marketing studio in Delhi — building captivating websites, apps and marketing that grow your business. We also sell premium admin templates, HTML themes and plugins.",
  tagline: "Build your next project with us.",
  email: "info@codewins.in",
  phone: "+91 62000 27897",
  phoneAlt: "+91 70379 58642",
  whatsapp: "916200027897",
};

export function pageMeta({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = `${SITE.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: `${title} — ${SITE.legalName}`, description, siteName: SITE.legalName },
    twitter: { card: "summary_large_image", title: `${title} — ${SITE.legalName}`, description },
  };
}

// ---------------------------------------------------------------------------
// Admin-driven site settings (stored in the `seo` + `robots` Setting rows)
// ---------------------------------------------------------------------------
export interface SiteSettings {
  siteTitle: string;        // default <title>
  titleTemplate: string;    // e.g. "%s — CodeWins Technologies"
  description: string;
  keywords: string;         // comma separated
  logo: string;             // header logo url
  favicon: string;          // favicon url (png/ico/svg)
  ogImage: string;          // default social share image
  twitterHandle: string;    // @handle
  headerScripts: string;    // raw HTML/JS injected into <head> (GTM, pixels...)
  footerScripts: string;    // raw HTML/JS injected before </body>
  robotsIndex: boolean;     // global index/follow on/off
}

export const SETTINGS_DEFAULTS: SiteSettings = {
  siteTitle: `${SITE.legalName}: Web Design & Digital Marketing Services`,
  titleTemplate: `%s — ${SITE.legalName}`,
  description: SITE.description,
  keywords:
    "codewins, web design, web development, digital marketing, admin templates, html templates, react templates, Delhi web design, freelance web developer",
  logo: "https://codewins.in/assets/uploads/media-uploader/logo11701255144.png",
  favicon: "/favicon.ico",
  ogImage: "",
  twitterHandle: "",
  headerScripts: "",
  footerScripts: "",
  robotsIndex: true,
};

export interface RobotsSettings {
  index: boolean;     // master allow/disallow
  disallow: string;   // newline-separated paths to block (e.g. /admin)
}

export const ROBOTS_DEFAULTS: RobotsSettings = {
  index: true,
  disallow: "/admin\n/dashboard\n/api",
};
