# CodeWins — Dynamic Migration (Phase 1: Foundation)

Stack added: **MySQL + Prisma + JWT auth + Razorpay** (Next.js 15 App Router).
Design/UI is untouched — content now lives in the DB and is seeded from the
existing static `src/data/*` files, so the site looks identical after seeding.

## 1. Install
```bash
npm install            # runs `prisma generate` via postinstall
```

## 2. Configure env
Copy `.env.example` → `.env` and fill:
- `DATABASE_URL` — your MySQL connection string
- `JWT_SECRET` — long random string
- `RAZORPAY_*` — from Razorpay dashboard (Phase 4)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — seed admin login

## 3. Create tables + seed
```bash
npm run db:push        # or: npm run db:migrate  (creates migration history)
npm run db:seed        # loads current content into the DB
```
Seed creates:
- Admin → `admin@codewins.in` / `Admin@123`
- Demo user → `user@codewins.in` / `User@123`
- All services, products, projects, blog (from news), testimonials,
  stats, process, pillars, values, founders, tech stack, gallery, settings
- Sample coupons → `WELCOME10` (10%, cap ₹200), `FLAT5` (₹5 off)

## 4. Run
```bash
npm run dev
npm run db:studio      # visual DB browser
```

## What's in Phase 1
- `prisma/schema.prisma` — full schema (auth, catalog, commerce, CMS blocks)
- `src/lib/prisma.ts` — singleton client
- `src/lib/auth.ts` — hash/verify, JWT sign/verify, cookie session helpers
- `prisma/seed.ts` — migrates current static content into the DB

## Next phases
2. Swap `src/data/*` reads → Prisma query layer (same shapes) + Service-details + Blog pages
3. Auth API + middleware + `/dashboard` (user) + `/admin` (RBAC) shells
4. Checkout + coupon apply + Razorpay (order → verify → webhook) + order history
5. Admin CRUD for everything

---

## Phase 2 — Dynamic data + new pages (DONE)

All content now comes from the DB via `src/server/queries.ts`, with a **static
fallback** baked into every query — so the site renders identically even before
you run `db:push`/`db:seed`. After seeding, everything is DB-driven and editable
(admin CRUD lands in Phase 5).

**Wired to DB:** home, about, services, portfolio, products, contact, blog list,
and all detail pages. Header/Footer/MobileMenu pull contact + footer links from
the `Setting` table. Filters (products/projects categories) and nav stay static
(structural, not content).

**New routes**
- `/services/[slug]` — service detail (features, optional FAQs, related)
- `/news/[slug]` — blog detail (renders HTML body, related posts)
- `POST /api/contact` — saves enquiries to the `ContactMessage` table
  (the contact form now submits for real; view messages in Phase 5 admin)

**Caching:** content pages use `export const revalidate = 60` (ISR) so admin
edits appear within ~60s without a rebuild. Detail pages render on-demand
(no `generateStaticParams` — content is dynamic).

> Note: `npm run typecheck` passes only after `prisma generate` (run via
> `npm install` postinstall, or `npm run db:push`). The Prisma client types are
> generated from your schema.

---

## Phase 3 — Auth + dashboards (DONE)

Custom JWT auth (httpOnly cookie, **jose** so it works in Edge middleware too),
bcrypt password hashing, and role-based route protection.

**Auth API**
- `POST /api/auth/register` — create account + sets session
- `POST /api/auth/login` — verify + sets session
- `POST /api/auth/logout` — clears session

**Pages**
- `/login`, `/register` — site-themed auth cards (Suspense-wrapped for `useSearchParams`)
- `/dashboard` — user shell: overview, `/dashboard/orders`, `/dashboard/profile`
- `/admin` — admin shell (ADMIN only): overview with live counts/revenue,
  `/admin/orders` (read-only), `/admin/messages` (contact enquiries, unread highlighted)

**Protection** — `src/middleware.ts` guards `/admin/*` (ADMIN), `/dashboard/*`
(any logged-in user), and bounces logged-in users away from `/login` `/register`.
Layouts also re-check the session as defense-in-depth.

**Chrome** — `ConditionalChrome` hides the marketing Header/Footer on `/dashboard`
and `/admin` so they render as clean app shells. The site Header now shows
**Login** or **Dashboard/Admin** based on session.

Seed logins: admin `admin@codewins.in / Admin@123`, user `user@codewins.in / User@123`.

> Files in `lib/`: `jwt.ts` (edge-safe sign/verify via jose) + `auth.ts`
> (bcrypt + cookie session helpers, Node runtime). Middleware imports only `jwt.ts`.

### Still ahead
4. Checkout + coupon apply + Razorpay (order → verify → webhook) + downloads
5. Admin CRUD for products/services/projects/blog/coupons/settings + profile editing

---

## Phase 4 — Checkout, coupons & Razorpay (DONE)

Full digital-product purchase flow. Prices and coupons are recomputed
**server-side** from the DB on every checkout — client prices are never trusted.

**Cart** — `CartProvider` (React context + localStorage). Header shows a live
cart count. Product detail page has **Buy Now / Add to Cart** (`BuyActions`).

**Pages**
- `/checkout` — cart items, quantity controls, coupon apply, totals, Razorpay pay
- `/checkout/success` — confirmation
- `/dashboard/orders/[id]` — order detail with **download** buttons for paid items

**APIs**
- `POST /api/coupon/apply` — validates `WELCOME10` / `FLAT5` etc. (active window,
  min subtotal, global + per-user limits)
- `POST /api/checkout` — auth required; rebuilds the order from DB prices, applies
  the coupon server-side, creates a `PENDING` order + a Razorpay order, returns
  the payment params. (100%-off orders are marked PAID directly, no gateway.)
- `POST /api/checkout/verify` — verifies the Razorpay signature (HMAC) and
  finalises the order
- `POST /api/webhook/razorpay` — verifies the webhook signature and finalises too
- `GET /api/download/[itemId]` — streams a purchased file only to the owning user
  of a PAID order

**Race-safe finalisation** — both `verify` and the webhook call
`finalizePaidOrder()`, which flips the order to PAID through an atomic
`updateMany({ where: { confirmationSent: false } })` gate. Only the winner runs
coupon redemption, so there's no double-counting (same pattern proven on PrintHutt).

### Razorpay setup
1. Add to `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxx
   RAZORPAY_KEY_SECRET=xxx
   RAZORPAY_WEBHOOK_SECRET=xxx
   ```
2. In the Razorpay dashboard add a webhook → URL `https://yourdomain.com/api/webhook/razorpay`,
   secret = `RAZORPAY_WEBHOOK_SECRET`, events: `payment.captured`, `order.paid`.
3. Set a `downloadUrl` on each product (admin CRUD lands in Phase 5) to enable
   downloads after purchase.

> Without keys the checkout returns a friendly "gateway not configured" message,
> so the rest of the app still runs.

### Final phase
5. Admin CRUD — create/edit/delete products, services, projects, blog, coupons,
   site settings, mark messages read, manage order status + product download URLs;
   plus user profile editing.

---

## Phase 5 — Admin CRUD + profile (DONE)

The admin panel can now fully manage the site. Every mutation runs behind
`requireAdmin()` and calls `revalidatePath()` so public pages reflect changes
within seconds (no rebuild).

**Manage (create / edit / delete)** — Products, Services, Projects, Blog posts,
Coupons. All driven by one schema-based `AdminForm` (`components/admin/schemas.ts`
defines the fields per entity), so adding a field is a one-line change.

**Inline actions**
- Orders → change status from a dropdown (`/api/admin/orders/[id]`)
- Messages → mark read/unread + delete (`/api/admin/messages/[id]`)
- Products → set `downloadUrl` so buyers can download after a paid order

**Settings** (`/admin/settings`) — edit site-wide contact info, socials, and
footer link columns; saved to the `Setting` table and revalidated app-wide.

**User profile** (`/dashboard/profile`) — users edit name + phone
(`/api/profile`), which also refreshes their session cookie so the header stays
in sync.

### Admin API surface
```
POST   /api/admin/{products|services|projects|blog|coupons}        create
PATCH  /api/admin/{...}/[id]                                        update
DELETE /api/admin/{...}/[id]                                        delete
PATCH  /api/admin/orders/[id]        { status }
PATCH  /api/admin/messages/[id]      { read }      DELETE
PATCH  /api/admin/settings           { key, value }
PATCH  /api/profile                  { name, phone }   (user self-service)
```

That completes the static → full dynamic platform: DB-driven content, auth,
user + admin dashboards, checkout with coupons + Razorpay, and full admin CRUD —
with the original design untouched.
