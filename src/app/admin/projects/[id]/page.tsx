import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminForm } from "@/components/admin/AdminForm";
import { projectFields } from "@/components/admin/schemas";

export const dynamic = "force-dynamic";

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await prisma.project.findUnique({ where: { id } }).catch(() => null);
  if (!row) notFound();
  return (
    <div>
      <AdminHeader title="Edit project" subtitle={row.name} />
      <AdminForm fields={projectFields} endpoint={`/api/admin/projects/${id}`} method="PATCH" redirect="/admin/projects" initial={row as unknown as Record<string, unknown>} submitLabel="Save changes" />
    </div>
  );
}
