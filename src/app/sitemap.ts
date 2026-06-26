import type { MetadataRoute } from "next";
import { getProjects, getProducts, getServices, getBlogPosts } from "@/server/queries";
import { SITE } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, products, services, posts] = await Promise.all([
    getProjects(),
    getProducts(),
    getServices(),
    getBlogPosts(),
  ]);

  const routes = ["", "/about", "/services", "/portfolio", "/products", "/news", "/contact"].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const portfolio = projects.map((p) => ({ url: `${SITE.url}/portfolio/${p.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 }));
  const prods = products.map((p) => ({ url: `${SITE.url}/products/${p.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 }));
  const svc = services.map((s) => ({ url: `${SITE.url}/services/${s.id}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 }));
  const blog = posts.map((b) => ({ url: `${SITE.url}/news/${b.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.5 }));
  return [...routes, ...portfolio, ...prods, ...svc, ...blog];
}
