import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminForm } from "@/components/admin/AdminForm";
import { couponFields } from "@/components/admin/schemas";

export default function NewCoupon() {
  return (
    <div>
      <AdminHeader title="New coupon" />
      <AdminForm fields={couponFields} endpoint="/api/admin/coupons" method="POST" redirect="/admin/coupons" initial={{ active: true, type: "PERCENT", perUserLimit: 1, minSubtotal: 0 }} submitLabel="Create coupon" />
    </div>
  );
}
