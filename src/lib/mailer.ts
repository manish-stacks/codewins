// SMTP mailer (nodemailer). Safe no-op when SMTP env is not configured so
// callers never crash — they should always treat email as best-effort.
import nodemailer, { type Transporter } from "nodemailer";

let cached: Transporter | null | undefined;

function getTransport(): Transporter | null {
  if (cached !== undefined) return cached;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    cached = null;
    return null;
  }
  const port = Number(SMTP_PORT || 587);
  cached = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // SSL on 465, STARTTLS otherwise
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return cached;
}

export interface MailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

/** Returns true if sent, false if SMTP is not configured or sending failed. */
export async function sendMail({ to, subject, html, text, replyTo }: MailInput): Promise<boolean> {
  const t = getTransport();
  if (!t) {
    console.warn("[mailer] SMTP not configured — skipping email:", subject);
    return false;
  }
  try {
    await t.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, " "),
      ...(replyTo ? { replyTo } : {}),
    });
    return true;
  } catch (e) {
    console.error("[mailer] send failed:", e);
    return false;
  }
}
