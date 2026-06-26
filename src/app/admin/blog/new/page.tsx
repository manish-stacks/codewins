import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminForm } from "@/components/admin/AdminForm";
import { blogFields } from "@/components/admin/schemas";

export default function NewPost() {
  return (
    <div>
      <AdminHeader title="New post" />
      <AdminForm fields={blogFields} endpoint="/api/admin/blog" method="POST" redirect="/admin/blog" initial={{ published: true, author: "CodeWins", readTime: 4 }} submitLabel="Publish post" />
    </div>
  );
}
