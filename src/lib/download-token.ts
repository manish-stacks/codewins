// Short-lived, signed download tokens — bound to a user + order item so a
// copied link is useless to anyone else and expires within minutes.
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "change-me-in-env");
const ALG = "HS256";
const TTL_SECONDS = 120; // link is valid for 2 minutes

export interface DownloadClaims {
  itemId: string;
  userId: string;
}

export async function signDownloadToken(claims: DownloadClaims): Promise<string> {
  return await new SignJWT({ ...claims, typ: "download" })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${TTL_SECONDS}s`)
    .sign(secret);
}

export async function verifyDownloadToken(token: string): Promise<DownloadClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.typ !== "download" || !payload.itemId || !payload.userId) return null;
    return { itemId: String(payload.itemId), userId: String(payload.userId) };
  } catch {
    return null;
  }
}
