import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSession();
  let phone = "";
  try {
    if (session) {
      const u = await prisma.user.findUnique({ where: { id: session.id }, select: { phone: true } });
      phone = u?.phone ?? "";
    }
  } catch {
    /* DB not ready */
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-ink">Profile</h1>
      <p className="mt-2 text-secondary">Update your account details.</p>
      <ProfileForm name={session?.name ?? ""} email={session?.email ?? ""} phone={phone} role={session?.role ?? "USER"} />
    </div>
  );
}
