import { AdminHeader } from "@/components/admin/AdminHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getContact, getFooterLinks, getSiteSettings, getRobotsSettings } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function AdminSettings() {
  const [contact, footerLinks, seo, robots] = await Promise.all([
    getContact(),
    getFooterLinks(),
    getSiteSettings(),
    getRobotsSettings(),
  ]);
  return (
    <div>
      <AdminHeader title="Settings" subtitle="Branding, SEO, scripts, contact info and footer links" />
      <SettingsForm
        contact={contact}
        footerLinks={footerLinks as unknown as Record<string, unknown>}
        seo={seo}
        robots={robots}
      />
    </div>
  );
}
