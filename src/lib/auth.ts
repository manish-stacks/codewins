// Node-runtime auth helpers (route handlers / server components).
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import {
  signToken,
  verifyToken,
  COOKIE_NAME,
  MAX_AGE,
  type SessionPayload,
} from "@/lib/jwt";

export type { SessionPayload };
export { COOKIE_NAME };

export const hashPassword = (pw: string) => bcrypt.hash(pw, 10);
export const verifyPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash);

/** Set the auth cookie (call inside a Route Handler or Server Action). */
export async function setSession(payload: SessionPayload) {
  const token = await signToken(payload);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Read + verify the current session from the cookie. Null if logged out. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return token ? verifyToken(token) : null;
}
