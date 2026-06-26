import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminForm } from "@/components/admin/AdminForm";
import { productFields } from "@/components/admin/schemas";

export default function NewProduct() {
  return (
    <div>
      <AdminHeader title="New product" />
      <AdminForm fields={productFields} endpoint="/api/admin/products" method="POST" redirect="/admin/products" initial={{ published: true, featured: false, rating: 5, sales: 0, order: 0 }} submitLabel="Create product" />
    </div>
  );
}
