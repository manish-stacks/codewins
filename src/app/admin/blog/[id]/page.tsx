import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminForm } from "@/components/admin/AdminForm";
import { blogFields } from "@/components/admin/schemas";

export const dynamic = "force-dynamic";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await prisma.blogPost.findUnique({ where: { id } }).catch(() => null);
  if (!row) notFound();
  return (
    <div>
      <AdminHeader title="Edit post" subtitle={row.title} />
      <AdminForm fields={blogFields} endpoint={`/api/admin/blog/${id}`} method="PATCH" redirect="/admin/blog" initial={row as unknown as Record<string, unknown>} submitLabel="Save changes" />
    </div>
  );
}
