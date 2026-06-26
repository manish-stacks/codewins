import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminForm } from "@/components/admin/AdminForm";
import { productFields } from "@/components/admin/schemas";

export const dynamic = "force-dynamic";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } }).catch(() => null);
  if (!product) notFound();
  return (
    <div>
      <AdminHeader title="Edit product" subtitle={product.title} />
      <AdminForm fields={productFields} endpoint={`/api/admin/products/${id}`} method="PATCH" redirect="/admin/products" initial={product as unknown as Record<string, unknown>} submitLabel="Save changes" />
    </div>
  );
}
