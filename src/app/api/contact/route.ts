import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";

export const runtime = "nodejs";

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();
    const phone = body.phone ? String(body.phone).trim() : null;
    const subject = body.subject ? String(body.subject).trim() : null;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    // Always persist first (source of truth).
    await prisma.contactMessage.create({ data: { name, email, message, phone, subject } });

    // Best-effort email notification — never block the response on it.
    const to = process.env.CONTACT_TO || process.env.ADMIN_EMAIL;
    if (to) {
      const html = `
        <h2 style="margin:0 0 12px">New quote request — CodeWins</h2>
        <table cellpadding="6" style="border-collapse:collapse;font:14px/1.5 system-ui">
          <tr><td><b>Name</b></td><td>${esc(name)}</td></tr>
          <tr><td><b>Email</b></td><td>${esc(email)}</td></tr>
          ${phone ? `<tr><td><b>Phone</b></td><td>${esc(phone)}</td></tr>` : ""}
          ${subject ? `<tr><td><b>Subject</b></td><td>${esc(subject)}</td></tr>` : ""}
        </table>
        <p style="margin:14px 0 4px"><b>Message</b></p>
        <p style="white-space:pre-wrap;font:14px/1.6 system-ui">${esc(message)}</p>
      `;
      sendMail({
        to,
        subject: `New quote request from ${name}${subject ? ` — ${subject}` : ""}`,
        html,
        replyTo: email,
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/contact]", e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
