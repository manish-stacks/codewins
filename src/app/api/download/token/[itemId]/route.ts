import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { signDownloadToken } from "@/lib/download-token";

export const runtime = "nodejs";

// Issues a fresh, short-lived download URL for an item the user owns.
// The dashboard calls this on click, so the actual file URL is never exposed
// and the link expires within minutes — making it non-shareable.
export async function GET(_req: Request, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { itemId } = await params;
    const item = await prisma.orderItem.findUnique({
      where: { id: itemId },
      include: { order: { select: { userId: true, status: true } }, product: { select: { downloadUrl: true } } },
    });

    if (!item || item.order.userId !== session.id)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (item.order.status !== "PAID")
      return NextResponse.json({ error: "Order not paid" }, { status: 403 });
    if (!item.product?.downloadUrl)
      return NextResponse.json({ error: "Download not available yet." }, { status: 404 });

    const token = await signDownloadToken({ itemId, userId: session.id });
    return NextResponse.json({ url: `/api/download/${itemId}?t=${token}`, expiresIn: 120 });
  } catch (e) {
    console.error("[api/download/token]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
