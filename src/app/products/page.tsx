import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ProductsExplorer } from "@/components/sections/ProductsExplorer";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getProductsPage } from "@/server/queries";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Products",
  description:
    "Premium admin templates, HTML themes, dashboard kits and plugins by CodeWins — production-ready and priced to launch fast.",
  path: "/products",
});

export const revalidate = 60;

export default async function ProductsPage() {
  const first = await getProductsPage({ offset: 0, take: 9 });
  return (
    <>
      <PageHero
        eyebrow="Marketplace"
        title={"Templates &\ndigital products."}
        description="Hand-crafted admin dashboards, HTML themes and plugins — clean code, great design, and lifetime value."
      />
      <ProductsExplorer initial={first.items} initialNext={first.nextOffset} total={first.total} />
      <CtaBanner />
    </>
  );
}
