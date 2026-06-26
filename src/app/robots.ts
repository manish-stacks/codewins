import type { MetadataRoute } from "next";
import { getRobotsSettings } from "@/server/queries";
import { SITE } from "@/lib/seo";

export const revalidate = 3600;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const r = await getRobotsSettings();
  const disallow = r.disallow.split("\n").map((x) => x.trim()).filter(Boolean);

  return {
    rules: r.index
      ? { userAgent: "*", allow: "/", ...(disallow.length ? { disallow } : {}) }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
