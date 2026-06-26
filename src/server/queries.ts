import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { SETTINGS_DEFAULTS, ROBOTS_DEFAULTS, type SiteSettings, type RobotsSettings } from "@/lib/seo";
import type {
  Service,
  Product,
  ProductCategory,
  Project,
  ProjectCategory,
  Testimonial,
  Stat,
  ProcessStep,
  Pillar,
  ValueItem,
  Founder,
  ServiceIconKey,
} from "@/types";

// ---- static fallbacks (so the site renders identically before the DB is seeded)
import { services as sServices } from "@/data/services";
import { products as sProducts } from "@/data/products";
import { projects as sProjects, testimonials as sTestimonials } from "@/data/projects";
import { stats as sStats } from "@/data/stats";
import { processSteps as sProcess, pillars as sPillars } from "@/data/process";
import { values as sValues, aboutStats as sAboutStats, founders as sFounders } from "@/data/about";
import { techStack as sTech } from "@/data/clients";
import { galleryImages as sGallery } from "@/data/gallery";
import { news as sNews } from "@/data/news";
import { contact as sContact, footerLinks as sFooter } from "@/data/navigation";

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
const arr = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);
const fmtDate = (d: Date) => d.toLocaleString("en-US", { month: "short", year: "numeric" });

async function safe<T>(
  fn: () => Promise<T>,
  fallback: T,
  emptyIsFallback = true
): Promise<T> {
  try {
    const r = await fn();
    if (emptyIsFallback && Array.isArray(r) && r.length === 0) return fallback;
    return r;
  } catch (e) {
    if (process.env.NODE_ENV === "development")
      console.warn("[queries] static fallback:", (e as Error).message);
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// extra detail types (supersets of the UI types)
// ---------------------------------------------------------------------------
export type ProductDetail = Product & {
  id?: string;
  demoUrl?: string | null;
  downloadUrl?: string | null;
  seoTitle?: string | null;
  seoDesc?: string | null;
};
export type ServiceDetail = Service & {
  longDescription?: string | null;
  image?: string | null;
  faqs?: { q: string; a: string }[];
  seoTitle?: string | null;
  seoDesc?: string | null;
};
export interface BlogListItem {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
}
export interface BlogDetail extends BlogListItem {
  content: string;
  author: string;
  readTime: number;
  tags: string[];
  seoTitle?: string | null;
  seoDesc?: string | null;
}

// ---------------------------------------------------------------------------
// SERVICES
// ---------------------------------------------------------------------------
export const getServices = cache(async (): Promise<Service[]> =>
  safe(async () => {
    const rows = await prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return rows.map((r) => ({
      id: r.slug,
      number: r.number,
      title: r.title,
      description: r.description,
      icon: r.icon as ServiceIconKey,
      features: arr(r.features),
    }));
  }, sServices)
);

export const getServiceBySlug = cache(async (slug: string): Promise<ServiceDetail | null> =>
  safe<ServiceDetail | null>(async () => {
    const r = await prisma.service.findUnique({ where: { slug } });
    if (!r) return null;
    return {
      id: r.slug,
      number: r.number,
      title: r.title,
      description: r.description,
      icon: r.icon as ServiceIconKey,
      features: arr(r.features),
      longDescription: r.longDescription,
      image: r.image,
      faqs: (r.faqs as { q: string; a: string }[] | null) ?? [],
      seoTitle: r.seoTitle ?? null,
      seoDesc: r.seoDesc ?? null,
    };
  }, sServices.find((s) => s.id === slug) ?? null, false)
);

// ---------------------------------------------------------------------------
// PRODUCTS
// ---------------------------------------------------------------------------
function toProduct(r: {
  id: string; slug: string; title: string; category: string; price: number;
  original: number; image: string; gallery: unknown; rating: number; sales: number;
  tags: unknown; summary: string; features: unknown; includes: unknown;
  featured: boolean; demoUrl: string | null; downloadUrl: string | null;
  seoTitle?: string | null; seoDesc?: string | null;
}): ProductDetail {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category as ProductCategory,
    price: r.price,
    original: r.original,
    image: r.image,
    gallery: arr(r.gallery),
    rating: r.rating,
    sales: r.sales,
    tags: arr(r.tags),
    summary: r.summary,
    features: arr(r.features),
    includes: arr(r.includes),
    featured: r.featured,
    demoUrl: r.demoUrl,
    downloadUrl: r.downloadUrl,
    seoTitle: r.seoTitle ?? null,
    seoDesc: r.seoDesc ?? null,
  };
}

export const getProducts = cache(async (): Promise<Product[]> =>
  safe(async () => {
    const rows = await prisma.product.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return rows.map(toProduct);
  }, sProducts)
);

export interface ProductsPage {
  items: Product[];
  total: number;
  nextOffset: number | null;
}

// Paginated + searchable product listing for the storefront (published only).
export async function getProductsPage(opts: {
  q?: string;
  category?: string;
  offset?: number;
  take?: number;
}): Promise<ProductsPage> {
  const take = Math.min(Math.max(opts.take ?? 9, 1), 24);
  const offset = Math.max(opts.offset ?? 0, 0);
  const q = (opts.q ?? "").trim();
  const category = (opts.category ?? "").trim();

  return safe<ProductsPage>(async () => {
    const where: Record<string, unknown> = { published: true };
    if (category && category !== "All") where.category = category;
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { summary: { contains: q } },
        { category: { contains: q } },
      ];
    }
    const [rows, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy: [{ order: "asc" }, { id: "asc" }], skip: offset, take }),
      prisma.product.count({ where }),
    ]);
    const items = rows.map(toProduct);
    const nextOffset = offset + items.length < total ? offset + items.length : null;
    return { items, total, nextOffset };
  }, (() => {
    // static fallback (no DB): filter the seed list
    let list = sProducts as Product[];
    if (category && category !== "All") list = list.filter((p) => p.category === category);
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(needle) || p.summary.toLowerCase().includes(needle) || p.category.toLowerCase().includes(needle));
    }
    const items = list.slice(offset, offset + take);
    const nextOffset = offset + items.length < list.length ? offset + items.length : null;
    return { items, total: list.length, nextOffset };
  })(), false);
}

export const getFeaturedProducts = cache(async (): Promise<Product[]> =>
  safe(async () => {
    const rows = await prisma.product.findMany({
      where: { published: true, featured: true },
      orderBy: { order: "asc" },
    });
    return rows.map(toProduct);
  }, sProducts.filter((p) => p.featured))
);

export const getProductBySlug = cache(async (slug: string): Promise<ProductDetail | null> =>
  safe(async () => {
    const r = await prisma.product.findUnique({ where: { slug } });
    return r ? toProduct(r) : null;
  }, (sProducts.find((p) => p.slug === slug) as ProductDetail) ?? null, false)
);

export const getRelatedProducts = cache(async (slug: string, n = 3): Promise<Product[]> =>
  safe(async () => {
    const rows = await prisma.product.findMany({
      where: { published: true, slug: { not: slug } },
      orderBy: { order: "asc" },
      take: n,
    });
    return rows.map(toProduct);
  }, sProducts.filter((p) => p.slug !== slug).slice(0, n))
);

// ---------------------------------------------------------------------------
// PROJECTS
// ---------------------------------------------------------------------------
function toProject(r: {
  slug: string; name: string; client: string; category: string; year: string;
  location: string; industry: string; scope: string; url: string; summary: string;
  description: unknown; cover: string; gallery: unknown; featured: boolean;
}): Project {
  return {
    slug: r.slug,
    name: r.name,
    client: r.client,
    category: r.category as ProjectCategory,
    year: r.year,
    location: r.location,
    industry: r.industry,
    scope: r.scope,
    url: r.url,
    summary: r.summary,
    description: arr(r.description),
    cover: r.cover,
    gallery: arr(r.gallery),
    featured: r.featured,
  };
}

export const getProjects = cache(async (): Promise<Project[]> =>
  safe(async () => {
    const rows = await prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return rows.map(toProject);
  }, sProjects)
);

export const getFeaturedProjects = cache(async (): Promise<Project[]> =>
  safe(async () => {
    const rows = await prisma.project.findMany({
      where: { published: true, featured: true },
      orderBy: { order: "asc" },
    });
    return rows.map(toProject);
  }, sProjects.filter((p) => p.featured))
);

export type ProjectDetail = Project & {
  descriptionHtml: string;
  seoTitle?: string | null;
  seoDesc?: string | null;
};

// Accepts legacy string[] paragraphs OR a rich-text HTML string.
function toDescriptionHtml(v: unknown): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return (v as string[]).map((para) => `<p>${para}</p>`).join("");
  return "";
}

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectDetail | null> =>
  safe<ProjectDetail | null>(async () => {
    const r = await prisma.project.findUnique({ where: { slug } });
    if (!r) return null;
    return {
      ...toProject(r),
      descriptionHtml: toDescriptionHtml(r.description),
      seoTitle: r.seoTitle ?? null,
      seoDesc: r.seoDesc ?? null,
    };
  }, (() => {
    const p = sProjects.find((x) => x.slug === slug);
    return p ? { ...p, descriptionHtml: toDescriptionHtml(p.description), seoTitle: null, seoDesc: null } : null;
  })(), false)
);

export const getRelatedProjects = cache(async (slug: string, n = 3): Promise<Project[]> =>
  safe(async () => {
    const rows = await prisma.project.findMany({
      where: { published: true, slug: { not: slug } },
      orderBy: { order: "asc" },
      take: n,
    });
    return rows.map(toProject);
  }, sProjects.filter((p) => p.slug !== slug).slice(0, n))
);

// ---------------------------------------------------------------------------
// TESTIMONIALS
// ---------------------------------------------------------------------------
export const getTestimonials = cache(async (): Promise<Testimonial[]> =>
  safe(async () => {
    const rows = await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return rows.map((r) => ({ id: r.id, client: r.client, scope: r.scope, quote: r.quote }));
  }, sTestimonials)
);

// ---------------------------------------------------------------------------
// CMS BLOCKS
// ---------------------------------------------------------------------------
export const getStats = cache(async (group: "home" | "about" = "home"): Promise<Stat[]> =>
  safe<Stat[]>(async () => {
    const rows = await prisma.stat.findMany({ where: { group }, orderBy: { order: "asc" } });
    return rows.map((r) => ({
      value: r.value,
      prefix: r.prefix ?? undefined,
      suffix: r.suffix ?? undefined,
      label: r.label,
    }));
  }, group === "about" ? sAboutStats : sStats)
);

export const getProcessSteps = cache(async (): Promise<ProcessStep[]> =>
  safe(async () => {
    const rows = await prisma.processStep.findMany({ orderBy: { order: "asc" } });
    return rows.map((r) => ({ number: r.number, title: r.title, description: r.description }));
  }, sProcess)
);

export const getPillars = cache(async (): Promise<Pillar[]> =>
  safe(async () => {
    const rows = await prisma.pillar.findMany({ orderBy: { order: "asc" } });
    return rows.map((r) => ({ icon: r.icon as Pillar["icon"], title: r.title, description: r.description }));
  }, sPillars)
);

export const getValues = cache(async (): Promise<ValueItem[]> =>
  safe(async () => {
    const rows = await prisma.valueItem.findMany({ orderBy: { order: "asc" } });
    return rows.map((r) => ({ number: r.number, title: r.title, description: r.description }));
  }, sValues)
);

export const getFounders = cache(async (): Promise<Founder[]> =>
  safe(async () => {
    const rows = await prisma.founder.findMany({ orderBy: { order: "asc" } });
    return rows.map((r) => ({ name: r.name, role: r.role, image: r.image }));
  }, sFounders)
);

export interface TechStackItem { label: string; image: string }

export const getTechStack = cache(async (): Promise<TechStackItem[]> =>
  safe(async () => {
    const rows = await prisma.techItem.findMany({ orderBy: { order: "asc" } });
    return rows.map((r) => ({ label: r.label, image: r.image ?? "" }));
  }, sTech.map((t) => ({ label: t, image: "" })))
);

export const getGallery = cache(async (): Promise<string[]> =>
  safe(async () => {
    const rows = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
    return rows.map((r) => r.url);
  }, sGallery)
);

// ---------------------------------------------------------------------------
// BLOG
// ---------------------------------------------------------------------------
export const getBlogPosts = cache(async (): Promise<BlogListItem[]> =>
  safe(async () => {
    const rows = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    });
    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      category: r.category,
      date: fmtDate(r.publishedAt),
      excerpt: r.excerpt,
      image: r.cover,
    }));
  }, sNews.map((n) => ({ slug: n.slug, title: n.title, category: n.category, date: n.date, excerpt: n.excerpt, image: n.image })))
);

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogDetail | null> =>
  safe(async () => {
    const r = await prisma.blogPost.findUnique({ where: { slug } });
    if (!r) return null;
    return {
      slug: r.slug,
      title: r.title,
      category: r.category,
      date: fmtDate(r.publishedAt),
      excerpt: r.excerpt,
      image: r.cover,
      content: r.content,
      author: r.author,
      readTime: r.readTime,
      tags: arr(r.tags),
      seoTitle: r.seoTitle ?? null,
      seoDesc: r.seoDesc ?? null,
    };
  }, (() => {
    const n = sNews.find((x) => x.slug === slug);
    return n
      ? { slug: n.slug, title: n.title, category: n.category, date: n.date, excerpt: n.excerpt, image: n.image, content: `<p>${n.excerpt}</p>`, author: "CodeWins", readTime: 4, tags: [], seoTitle: null, seoDesc: null }
      : null;
  })(), false)
);

export const getRelatedPosts = cache(async (slug: string, n = 3): Promise<BlogListItem[]> => {
  const all = await getBlogPosts();
  return all.filter((p) => p.slug !== slug).slice(0, n);
});

// ---------------------------------------------------------------------------
// SETTINGS (contact / footer links)
// ---------------------------------------------------------------------------
export type ContactInfo = typeof sContact;
export type FooterLinks = typeof sFooter;

export const getContact = cache(async (): Promise<ContactInfo> =>
  safe(async () => {
    const row = await prisma.setting.findUnique({ where: { key: "contact" } });
    return (row?.value as ContactInfo) ?? sContact;
  }, sContact, false)
);

export const getFooterLinks = cache(async (): Promise<FooterLinks> =>
  safe(async () => {
    const row = await prisma.setting.findUnique({ where: { key: "footerLinks" } });
    return (row?.value as FooterLinks) ?? sFooter;
  }, sFooter, false)
);

export const getSiteSettings = cache(async (): Promise<SiteSettings> =>
  safe(async () => {
    const row = await prisma.setting.findUnique({ where: { key: "seo" } });
    return { ...SETTINGS_DEFAULTS, ...((row?.value as Partial<SiteSettings>) ?? {}) };
  }, SETTINGS_DEFAULTS, false)
);

export const getRobotsSettings = cache(async (): Promise<RobotsSettings> =>
  safe(async () => {
    const row = await prisma.setting.findUnique({ where: { key: "robots" } });
    return { ...ROBOTS_DEFAULTS, ...((row?.value as Partial<RobotsSettings>) ?? {}) };
  }, ROBOTS_DEFAULTS, false)
);

// ---------------------------------------------------------------------------
// DASHBOARD / ADMIN
// ---------------------------------------------------------------------------
export interface AdminCounts {
  products: number;
  projects: number;
  posts: number;
  services: number;
  orders: number;
  paidOrders: number;
  revenue: number;
  unreadMessages: number;
  coupons: number;
  users: number;
}

export const getAdminCounts = cache(async (): Promise<AdminCounts> =>
  safe<AdminCounts>(async () => {
    const [products, projects, posts, services, orders, paid, unreadMessages, coupons, users, revenueAgg] =
      await Promise.all([
        prisma.product.count(),
        prisma.project.count(),
        prisma.blogPost.count(),
        prisma.service.count(),
        prisma.order.count(),
        prisma.order.count({ where: { status: "PAID" } }),
        prisma.contactMessage.count({ where: { read: false } }),
        prisma.coupon.count(),
        prisma.user.count(),
        prisma.order.aggregate({ _sum: { total: true }, where: { status: "PAID" } }),
      ]);
    return {
      products, projects, posts, services, orders,
      paidOrders: paid,
      revenue: revenueAgg._sum.total ?? 0,
      unreadMessages, coupons, users,
    };
  }, {
    products: 0, projects: 0, posts: 0, services: 0, orders: 0,
    paidOrders: 0, revenue: 0, unreadMessages: 0, coupons: 0, users: 0,
  }, false)
);

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  itemCount: number;
}

export const getUserOrders = cache(async (userId: string): Promise<OrderSummary[]> =>
  safe<OrderSummary[]>(async () => {
    const rows = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    return rows.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      total: o.total,
      createdAt: new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      itemCount: o.items.length,
    }));
  }, [], false)
);

export interface AdminOrder extends OrderSummary {
  customerName: string;
  customerEmail: string;
}

export const getAdminOrders = cache(async (): Promise<AdminOrder[]> =>
  safe<AdminOrder[]>(async () => {
    const rows = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
      take: 100,
    });
    return rows.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      total: o.total,
      createdAt: new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      itemCount: o.items.length,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
    }));
  }, [], false)
);

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export const getContactMessages = cache(async (): Promise<Message[]> =>
  safe<Message[]>(async () => {
    const rows = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
    return rows.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      subject: m.subject,
      message: m.message,
      read: m.read,
      createdAt: new Date(m.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    }));
  }, [], false)
);

export interface OrderItemDetail {
  id: string;
  title: string;
  image: string;
  price: number;
  qty: number;
  downloadable: boolean;
  purchasedVersion: string | null;
  currentVersion: string | null;
  updateAvailable: boolean;
}
export interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string | null;
  createdAt: string;
  items: OrderItemDetail[];
}

export const getUserOrderDetail = cache(async (userId: string, orderId: string): Promise<OrderDetail | null> =>
  safe<OrderDetail | null>(async () => {
    const o = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: { include: { product: { select: { downloadUrl: true, version: true } } } } },
    });
    if (!o) return null;
    return {
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      subtotal: o.subtotal,
      discount: o.discount,
      total: o.total,
      couponCode: o.couponCode,
      createdAt: new Date(o.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      items: o.items.map((it: { id: string; title: string; image: string; price: number; qty: number; purchasedVersion: string | null; product?: { downloadUrl: string | null; version: string | null } | null }) => {
        const currentVersion = it.product?.version ?? null;
        const downloadable = o.status === "PAID" && !!it.product?.downloadUrl;
        return {
          id: it.id,
          title: it.title,
          image: it.image,
          price: it.price,
          qty: it.qty,
          downloadable,
          purchasedVersion: it.purchasedVersion ?? null,
          currentVersion,
          updateAvailable: downloadable && !!currentVersion && !!it.purchasedVersion && currentVersion !== it.purchasedVersion,
        };
      }),
    };
  }, null, false)
);
