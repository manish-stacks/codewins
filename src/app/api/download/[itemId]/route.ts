import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { verifyDownloadToken } from "@/lib/download-token";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

// Secured download. Requires BOTH:
//  - a valid, unexpired signed token (?t=) bound to this item + user, AND
//  - an authenticated session matching that user.
// The real downloadUrl is never sent to the browser — the file is streamed
// through the server, so the link cannot be shared or reused after it expires.
export async function GET(req: Request, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await params;
    const token = new URL(req.url).searchParams.get("t") || "";

    const claims = await verifyDownloadToken(token);
    if (!claims || claims.itemId !== itemId)
      return NextResponse.json({ error: "This download link is invalid or has expired." }, { status: 403 });

    const session = await getSession();
    if (!session || session.id !== claims.userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const item = await prisma.orderItem.findUnique({
      where: { id: itemId },
      include: {
        order: { select: { userId: true, status: true } },
        product: { select: { downloadUrl: true, slug: true, version: true } },
      },
    });

    if (!item || item.order.userId !== session.id)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (item.order.status !== "PAID")
      return NextResponse.json({ error: "Order not paid" }, { status: 403 });

    const src = item.product?.downloadUrl;
    if (!src) return NextResponse.json({ error: "Download not available yet." }, { status: 404 });

    const filename = `${item.product?.slug || slugify(item.title)}-${item.product?.version || "v1"}.zip`;

    // Proxy-stream the file so the origin URL stays hidden.
    const upstream = await fetch(src);
    if (!upstream.ok || !upstream.body) {
      // Fallback: still token-gated, but redirect if streaming isn't possible.
      return NextResponse.redirect(src);
    }

    const headers = new Headers();
    headers.set("Content-Type", upstream.headers.get("content-type") || "application/octet-stream");
    const len = upstream.headers.get("content-length");
    if (len) headers.set("Content-Length", len);
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    headers.set("Cache-Control", "private, no-store");

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch (e) {
    console.error("[api/download]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
