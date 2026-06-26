/* Seeds the DB from the existing static content so the live site is identical.
   Run: npm run db:seed  (after `prisma db push` / `prisma migrate dev`).        */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { services } from "../src/data/services";
import { products } from "../src/data/products";
import { projects, testimonials } from "../src/data/projects";
import { news } from "../src/data/news";
import { stats } from "../src/data/stats";
import { aboutStats, values, founders } from "../src/data/about";
import { processSteps, pillars } from "../src/data/process";
import { techStack } from "../src/data/clients";
import { galleryImages } from "../src/data/gallery";
import { contact, footerLinks } from "../src/data/navigation";

const db = new PrismaClient();

async function main() {
  console.log("Seeding…");

  // --- Admin + demo user ------------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL || "admin@codewins.in";
  const adminPass = process.env.ADMIN_PASSWORD || "Admin@123";
  await db.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "CodeWins Admin",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPass, 10),
      role: "ADMIN",
    },
  });
  await db.user.upsert({
    where: { email: "user@codewins.in" },
    update: {},
    create: {
      name: "Demo User",
      email: "user@codewins.in",
      passwordHash: await bcrypt.hash("User@123", 10),
      role: "USER",
    },
  });

  // --- Services ---------------------------------------------------------------
  for (const [i, s] of services.entries()) {
    await db.service.upsert({
      where: { slug: s.id },
      update: {},
      create: {
        slug: s.id,
        number: s.number,
        title: s.title,
        description: s.description,
        icon: s.icon,
        features: s.features,
        order: i,
      },
    });
  }

  // --- Products ---------------------------------------------------------------
  for (const [i, p] of products.entries()) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        category: p.category,
        price: p.price,
        original: p.original,
        image: p.image,
        gallery: p.gallery,
        rating: p.rating,
        sales: p.sales,
        tags: p.tags,
        summary: p.summary,
        features: p.features,
        includes: p.includes,
        featured: p.featured ?? false,
        order: i,
      },
    });
  }

  // --- Projects ---------------------------------------------------------------
  for (const [i, p] of projects.entries()) {
    await db.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        client: p.client,
        category: p.category,
        year: p.year,
        location: p.location,
        industry: p.industry,
        scope: p.scope,
        url: p.url,
        summary: p.summary,
        description: p.description,
        cover: p.cover,
        gallery: p.gallery,
        featured: p.featured ?? false,
        order: i,
      },
    });
  }

  // --- Blog (seeded from existing news items) --------------------------------
  for (const n of news) {
    await db.blogPost.upsert({
      where: { slug: n.slug },
      update: {},
      create: {
        slug: n.slug,
        title: n.title,
        category: n.category,
        excerpt: n.excerpt,
        content: `<p>${n.excerpt}</p><p>Replace this body from the admin panel.</p>`,
        cover: n.image,
      },
    });
  }

  // --- Testimonials -----------------------------------------------------------
  for (const [i, t] of testimonials.entries()) {
    await db.testimonial.create({
      data: { client: t.client, scope: t.scope, quote: t.quote, order: i },
    });
  }

  // --- CMS blocks -------------------------------------------------------------
  for (const [i, s] of stats.entries())
    await db.stat.create({ data: { ...s, group: "home", order: i } });
  for (const [i, s] of aboutStats.entries())
    await db.stat.create({ data: { ...s, group: "about", order: i } });
  for (const [i, p] of processSteps.entries())
    await db.processStep.create({ data: { ...p, order: i } });
  for (const [i, p] of pillars.entries())
    await db.pillar.create({ data: { ...p, order: i } });
  for (const [i, v] of values.entries())
    await db.valueItem.create({ data: { ...v, order: i } });
  for (const [i, f] of founders.entries())
    await db.founder.create({ data: { ...f, order: i } });
  for (const [i, t] of techStack.entries())
    await db.techItem.create({ data: { label: t, order: i } });
  for (const [i, g] of galleryImages.entries())
    await db.galleryImage.create({ data: { url: g, order: i } });

  // --- Settings (site-wide editable content) ---------------------------------
  await db.setting.upsert({
    where: { key: "contact" },
    update: { value: contact },
    create: { key: "contact", value: contact },
  });
  await db.setting.upsert({
    where: { key: "footerLinks" },
    update: { value: footerLinks },
    create: { key: "footerLinks", value: footerLinks },
  });

  // --- Sample coupons ---------------------------------------------------------
  await db.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: { code: "WELCOME10", type: "PERCENT", value: 10, maxDiscount: 200, perUserLimit: 1 },
  });
  await db.coupon.upsert({
    where: { code: "FLAT5" },
    update: {},
    create: { code: "FLAT5", type: "FLAT", value: 5, minSubtotal: 9 },
  });

  console.log("Seed complete ✓");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
