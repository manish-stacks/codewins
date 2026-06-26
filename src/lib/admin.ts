import { getSession, type SessionPayload } from "@/lib/auth";

/** Returns the admin session, or null if the caller is not an ADMIN. */
export async function requireAdmin(): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}
