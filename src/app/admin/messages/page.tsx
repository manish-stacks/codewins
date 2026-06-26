import { getContactMessages } from "@/server/queries";
import { RowAction } from "@/components/admin/RowAction";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminMessages() {
  const messages = await getContactMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-ink">Messages</h1>
      <p className="mt-2 text-secondary">{messages.length} total · {unread} unread.</p>

      {messages.length === 0 ? (
        <div className="mt-8 rounded-card-lg border border-dashed border-line bg-surface p-12 text-center text-secondary">
          No contact messages yet.
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`rounded-card-lg border p-6 ${m.read ? "border-line bg-white" : "border-accent/30 bg-accent/[0.03]"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  {!m.read && <span className="h-2 w-2 rounded-full bg-accent" />}
                  <span className="font-display text-lg font-semibold text-ink">{m.name}</span>
                  <a href={`mailto:${m.email}`} className="text-sm text-accent hover:underline">{m.email}</a>
                  {m.phone && <span className="text-sm text-secondary">· {m.phone}</span>}
                </div>
                <span className="text-xs text-secondary">{m.createdAt}</span>
              </div>
              {m.subject && <div className="mt-2 text-sm font-medium text-ink">{m.subject}</div>}
              <p className="mt-2 text-[15px] leading-relaxed text-secondary">{m.message}</p>
              <div className="mt-4 flex gap-2">
                <RowAction endpoint={`/api/admin/messages/${m.id}`} body={{ read: !m.read }}>
                  {m.read ? "Mark unread" : "Mark read"}
                </RowAction>
                <DeleteButton endpoint={`/api/admin/messages/${m.id}`} label="this message" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
