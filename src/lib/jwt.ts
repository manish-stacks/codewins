// Edge + Node safe JWT helpers (used by middleware AND route handlers).
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import type { Role } from "@prisma/client";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "change-me-in-env");
const ALG = "HS256";
export const COOKIE_NAME = "cw_session";
export const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export async function signToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    const p = payload as JWTPayload & Partial<SessionPayload>;
    if (!p.id || !p.email || !p.role) return null;
    return { id: p.id, email: p.email, name: p.name ?? "", role: p.role };
  } catch {
    return null;
  }
}
