import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminForm } from "@/components/admin/AdminForm";
import { couponFields } from "@/components/admin/schemas";

export const dynamic = "force-dynamic";

export default async function EditCoupon({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await prisma.coupon.findUnique({ where: { id } }).catch(() => null);
  if (!row) notFound();
  return (
    <div>
      <AdminHeader title="Edit coupon" subtitle={row.code} />
      <AdminForm fields={couponFields} endpoint={`/api/admin/coupons/${id}`} method="PATCH" redirect="/admin/coupons" initial={row as unknown as Record<string, unknown>} submitLabel="Save changes" />
    </div>
  );
}
