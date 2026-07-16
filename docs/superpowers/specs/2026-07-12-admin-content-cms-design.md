# Admin-Managed Content (Services · Offers · Products) — Design

**Date:** 2026-07-12
**Status:** Approved (design), pending spec review
**Repo:** rd-harmony-med-spa

## 1. Problem & Goals

The spa owner needs to manage site content without code changes. Today, content is
split across three sources — code (`src/constants.ts`), the database
(`service_prices` table), and browser `localStorage` (`rd_harmony_custom_added_services`).
This split already caused a live bug (a Hydrafacial price of $199 in the DB overriding
$249 in code). Admin-"added" services live only in one browser and are never seen by
customers.

**Goals (all designed together, shipped in phases):**

1. **Offer price everywhere** — when a service/product is on offer, its price shows as
   struck-through original + offer price + badge on every surface (Services cards,
   detail hero + sticky CTA, booking dropdown, Home, Products, Offers page).
2. **Add/manage offers from the admin.**
3. **Add/edit/delete services from the admin** (persisted server-side, seen by all
   visitors on all devices).
4. **Service/offer/product builder** with a **full WYSIWYG text editor** (inline images,
   tables, color) and a **full photo editor** (crop, rotate, brightness/contrast/
   saturation, filters).

**Chosen architecture:** Approach A — move services, offers, and products into the Neon
Postgres database as the single source of truth. The website reads them via a public
API; the admin does full CRUD + image upload.

## 2. Non-Goals (YAGNI)

- No multi-user roles/permissions beyond the existing single admin.
- No draft/publish workflow or content versioning/history (an `active` toggle is enough).
- No e-commerce cart/checkout for products (Products remain "enquire" items).
- No i18n/translations.
- No analytics on offers.

## 3. Data Model (Neon Postgres)

Three new tables, seeded once from `src/constants.ts`. Rich/nested fields stored as JSONB;
long descriptions stored as **sanitized HTML** from the WYSIWYG.

### `services`
| column | type | notes |
|---|---|---|
| id | text PK | slug, e.g. `hydrafacial` |
| name | text | |
| category | text | one of the existing Service categories |
| price | text | e.g. `$249` (kept as string to match current UI) |
| duration | text | e.g. `60 Minutes` |
| image | text | Blob/public URL |
| hero_title | text null | |
| hero_subtitle | text null | |
| description | text null | short/plain summary |
| long_description | text null | **sanitized HTML** (WYSIWYG) |
| benefits | jsonb | string[] |
| ideal_for | jsonb | string[] |
| step_flow | jsonb | {title,desc}[] |
| post_care | jsonb | string[] |
| faqs | jsonb | {q,a}[] |
| options | jsonb | ServiceOption[] (price tiers) |
| technology | text null | |
| results / downtime / frequency / recovery | text null | |
| is_mobile_available | boolean | default false |
| active | boolean | default true |
| sort_order | int | default 0 |
| meta_title / meta_description | text null | SEO |
| created_at / updated_at | timestamptz | |

### `products`
| column | type | notes |
|---|---|---|
| id | text PK | slug |
| name | text | |
| category | text null | |
| price | text null | |
| description | text null | **sanitized HTML** (WYSIWYG) |
| image | text null | Blob/public URL |
| active | boolean | default true |
| sort_order | int | default 0 |
| created_at / updated_at | timestamptz | |

### `offers`
| column | type | notes |
|---|---|---|
| id | text PK | slug/uuid |
| item_type | text null | `'service'` \| `'product'` \| null (standalone) |
| item_id | text null | references services.id / products.id when linked |
| title | text | |
| subtitle | text null | |
| description | text null | **sanitized HTML** |
| image | text null | |
| original_price | text null | auto-filled from linked item, editable |
| offer_price | text | |
| badge | text null | e.g. "Limited Time Offer" |
| highlights | jsonb | string[] |
| active | boolean | default true |
| starts_at | timestamptz null | optional window start |
| ends_at | timestamptz null | optional window end |
| created_at / updated_at | timestamptz | |

**Pricing consolidation:** during seeding, the existing `service_prices` overrides are
applied onto `services.price`, then the `service_prices` table + `/api/service-prices`
usage is retired. This removes the split-source pricing bug. (The public GET of
`/api/service-prices` may be kept as a thin alias during transition, then removed.)

## 4. Offer Engine ("changes everywhere")

A single shared **effective-price resolver** (one module, imported by both the API layer
and the frontend):

```
effectivePrice(item, offers, now) -> {
  price: string,          // offer price if on offer, else base price
  originalPrice?: string, // present only when on offer
  onOffer: boolean,
  badge?: string,
}
```

An offer is "active" when `active === true` AND (`starts_at` is null or ≤ now) AND
(`ends_at` is null or ≥ now). When a linked offer is active, the item's effective price is
`offer_price` with `originalPrice = base price`.

Every price display uses one shared `<Price>` component that renders the strikethrough +
offer price + badge when `onOffer`. Surfaces: Services cards, ServiceDetail hero + sticky
CTA, booking dropdown/labels, Home featured/promotions, Products cards, Offers page.

The public API precomputes effective pricing so the frontend and any email/booking logic
agree.

## 5. Public Content API

- `GET /api/content` → `{ services, offers, products }`, **active items only**, effective
  pricing precomputed, `Cache-Control: no-store, max-age=0` (same pattern as
  `service-prices`).
- The website fetches this once via a `useContent()` hook/context and shares it across
  pages.

## 6. Admin API (reuses existing OTP + bearer auth)

Extends `api/admin.ts` (`?action=...`), all admin actions require a valid bearer session:

- `service-list`, `service-save` (create/update by id), `service-delete`
- `product-list`, `product-save`, `product-delete`
- `offer-list`, `offer-save`, `offer-delete`
- `image-upload` → stores to **Vercel Blob public** store, returns `{ url }`
- `seed-content` → idempotent one-time seed from constants (guarded; no-op if tables
  already populated)

All HTML fields are **sanitized server-side on save** (defense in depth) in addition to
sanitizing on render.

## 7. Frontend Refactor

- New `useContent()` context: fetches `/api/content` once, caches in memory, exposes
  `{ services, offers, products, loading }`.
- Pages refactored to read from context instead of importing `SERVICES`/`OFFERS`/
  `PRODUCTS`: `Home`, `Services`, `ServiceDetail`, `Booking`, `Offers`, `Products`.
- `src/constants.ts` is retained **only** as (a) the seed source and (b) an offline
  fallback if `/api/content` fails, so the site never hard-breaks.
- Long-description HTML rendered through DOMPurify inside a styled prose container.
- Booking: the bookable-items list and price/duration are derived from the context data
  and effective pricing (offers reflected in the dropdown + the amount sent to `/api/book`).

## 8. Admin UI

Three new tabs (replacing the current localStorage add-service tab):

- **Services** — table with edit/delete + "New Service"; **Service Builder** modal/page:
  all fields, WYSIWYG for `long_description`, repeaters for options (tiers)/benefits/
  faqs/step_flow/ideal_for/post_care, image upload w/ photo editor, SEO fields, active
  toggle, drag-to-reorder (`sort_order`).
- **Offers** — table + "New Offer"; builder: choose linked service/product (or
  standalone), `original_price` auto-fills from the item and is editable, `offer_price`,
  `badge`, optional `starts_at`/`ends_at`, active toggle, **live strikethrough preview**.
- **Products** — table + builder: name, category, WYSIWYG description, price, image
  (photo editor), active.

## 9. Editors & Image Pipeline

- **WYSIWYG:** TipTap (`@tiptap/react` + starter-kit + image/link/table/color extensions).
  Output HTML sanitized on save and on render (DOMPurify). Inline images go through the
  same `image-upload` endpoint.
- **Photo editor:** `react-filerobot-image-editor` (crop, rotate, brightness/contrast/
  saturation, filters). Edits client-side, exports the edited image blob, uploads it.
- **Storage:** `image-upload` admin endpoint → Vercel Blob **public** store → returns a
  public URL stored on the record. Consent Blob store stays private/separate.
- **New deps (all MIT):** `@tiptap/react`, `@tiptap/starter-kit`, TipTap image/link/table/
  color extensions, `isomorphic-dompurify`, `react-filerobot-image-editor`.

## 10. Migration / Seed

`seed-content` admin action (idempotent): if the tables are empty, insert current
`constants.ts` services/offers/products, applying existing `service_prices` overrides onto
`services.price`. Safe to run once; no-ops thereafter. Nothing is lost.

## 11. Error Handling

- `/api/content` failure on the frontend → fall back to `constants.ts` seed so pages still
  render.
- Image upload: validate content-type (jpg/png/webp) and size (≤ ~5 MB); reject otherwise.
- HTML sanitized on save AND render.
- Offer windows enforced server-side in the effective-price computation.
- Admin writes are transactional where multiple rows change.

## 12. Testing

- **Unit:** effective-price resolver (offer active / inactive / not-yet-started / expired /
  standalone); HTML sanitization strips scripts/handlers; slug generation.
- **Integration:** admin CRUD round-trip for each entity; `image-upload` returns a
  reachable URL; `seed-content` idempotency (second run is a no-op).
- **Manual acceptance:**
  - Create a service in admin → appears on Services page, gets a detail page, appears in
    the booking dropdown, for a fresh visitor (not just the admin's browser).
  - Create an offer on that service → struck-through price + badge appear everywhere; the
    booking amount uses the offer price.
  - Edit / delete a service or offer → change reflects on the site.
  - Upload + crop/adjust a photo → shows as the item image.

## 13. Implementation Phases (designed together, built in order)

1. **Foundation** — tables + `seed-content` + `/api/content` + `useContent()` + frontend
   read refactor + shared `<Price>`/effective-price module. (Site visually unchanged, now
   DB-driven. Retire `service_prices`.)
2. **Services CRUD** — admin Services tab + Service Builder + WYSIWYG + image upload +
   photo editor.
3. **Offers** — offer engine wired end-to-end + admin Offers tab + strikethrough on all
   surfaces.
4. **Products** — admin Products tab CRUD.

## 13b. Future Phase — Automated Review-Request Campaign

Separate feature (build AFTER the CMS phases), reusing the existing cron + email
infrastructure (`api/send-reminders.ts`, `api/_templates.ts`, `CRON_SECRET`).

**Decisions (confirmed):**
- First email goes out **1 day after the appointment date**.
- Then **up to 3 weekly follow-ups**, then stop (initial + 3 = 4 emails max per booking).
- Review link stored in a **`GOOGLE_REVIEW_URL`** env var (owner provides the direct
  write-review link, e.g. `https://g.page/r/…/review`). No hardcoded URL.
- Stop rule is count/time-based (we cannot detect whether a client actually left a Google
  review without the Places API + fuzzy matching — out of scope).

**Design sketch:**
- New daily cron endpoint `api/send-review-requests.ts` (guarded by `CRON_SECRET`,
  registered in `vercel.json`).
- Track progress per booking: add `review_stage` (int, 0–4) and `review_next_at`
  (timestamptz) columns to `bookings` (or a small `review_requests` table). Stage 0 = not
  started; the cron sends the next email when `review_next_at <= now` and increments the
  stage, scheduling the next at +7 days until stage 4.
- Suppress duplicates: don't email the same client address more than once per 7 days even
  if they have multiple bookings.
- New template `reviewRequestEmail(booking, reviewUrl, isFollowUp)` — friendly ask with a
  prominent "Leave us a review" button and an unsubscribe/stop line.
- Only applies to bookings from feature launch onward (a backfill of past clients is
  optional and off by default).

## 14. Open Defaults (chosen; override if desired)

- Offers support an **optional** time window; blank = runs until toggled off.
- Offers may be **linked** (price propagates to the item everywhere) or **standalone**
  (shows only in the Offers section).
