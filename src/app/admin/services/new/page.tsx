import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminForm } from "@/components/admin/AdminForm";
import { serviceFields } from "@/components/admin/schemas";

export default function NewService() {
  return (
    <div>
      <AdminHeader title="New service" />
      <AdminForm fields={serviceFields} endpoint="/api/admin/services" method="POST" redirect="/admin/services" initial={{ published: true, number: "01", icon: "code", order: 0 }} submitLabel="Create service" />
    </div>
  );
}
