import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminForm } from "@/components/admin/AdminForm";
import { serviceFields } from "@/components/admin/schemas";

export const dynamic = "force-dynamic";

export default async function EditService({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await prisma.service.findUnique({ where: { id } }).catch(() => null);
  if (!row) notFound();
  return (
    <div>
      <AdminHeader title="Edit service" subtitle={row.title} />
      <AdminForm fields={serviceFields} endpoint={`/api/admin/services/${id}`} method="PATCH" redirect="/admin/services" initial={row as unknown as Record<string, unknown>} submitLabel="Save changes" />
    </div>
  );
}
