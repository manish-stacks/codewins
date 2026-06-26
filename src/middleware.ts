import { NextResponse, type NextRequest } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  const loginUrl = (next: string) => {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", next);
    return url;
  };

  // Admin area — must be ADMIN
  if (pathname.startsWith("/admin")) {
    if (!session) return NextResponse.redirect(loginUrl(pathname));
    if (session.role !== "ADMIN") return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // User dashboard — must be logged in
  if (pathname.startsWith("/dashboard")) {
    if (!session) return NextResponse.redirect(loginUrl(pathname));
  }

  // Already logged in? Skip auth pages.
  if ((pathname === "/login" || pathname === "/register") && session) {
    return NextResponse.redirect(new URL(session.role === "ADMIN" ? "/admin" : "/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register"],
};
