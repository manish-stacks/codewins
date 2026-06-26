import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminForm } from "@/components/admin/AdminForm";
import { projectFields } from "@/components/admin/schemas";

export default function NewProject() {
  return (
    <div>
      <AdminHeader title="New project" />
      <AdminForm fields={projectFields} endpoint="/api/admin/projects" method="POST" redirect="/admin/projects" initial={{ published: true, featured: false, order: 0 }} submitLabel="Create project" />
    </div>
  );
}
