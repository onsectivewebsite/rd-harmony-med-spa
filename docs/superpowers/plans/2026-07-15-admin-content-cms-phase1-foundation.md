# Admin Content CMS — Phase 1 (Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the website read its services/offers/products from the Neon database (single source of truth) instead of `src/constants.ts`, with offer prices resolved and displayed everywhere — with zero visible change to the site on first deploy.

**Architecture:** New Postgres tables (`services`, `products`, `offers`) seeded once from the current constants. A public `GET /api/content` returns active content with effective (offer-aware) pricing precomputed. A `useContent()` React context fetches it once and shares it; the six content pages read from context instead of importing constants. A shared `<Price>` component renders struck-through offer pricing. `constants.ts` is retained only as the seed source and the offline fallback.

**Tech Stack:** Vercel serverless (`api/*.ts`, `@vercel/node`), Neon serverless Postgres (`@neondatabase/serverless` `sql` tag), React 19 + Vite + React Router 7, Vitest (new, for pure-logic unit tests).

## Global Constraints

- Database access uses the existing `sql` tagged-template from `api/_db.ts`; call `ensureContentSchema()` at the top of each content handler (mirrors the existing `ensureSchema()` pattern).
- Admin-authenticated endpoints reuse `verifySession(readBearer(req.headers.authorization))` from `api/_auth.ts`; unauthorized → HTTP 401.
- Public read endpoints set `Cache-Control: no-store, max-age=0` (mirrors `api/service-prices.ts`).
- Prices are strings like `"$249"` (do not convert to numbers for storage/display).
- HTML content fields are sanitized on save AND on render (defense in depth). Phase 1 stores no HTML yet, but the sanitize helper is created here for later phases.
- The site MUST NOT hard-break if `/api/content` fails: pages fall back to `src/constants.ts`.
- Frequent commits: one per task minimum.

---

### Task 1: Add Vitest test runner

**Files:**
- Modify: `package.json` (add `vitest` devDependency + `test` script)
- Create: `vitest.config.ts`

**Interfaces:**
- Produces: `npm test` runs Vitest in run-mode; `*.test.ts` files are discovered.

- [ ] **Step 1: Add the dependency and script**

Run:
```bash
cd "/Users/recallrishabh/Downloads/rd harmony" && npm install -D vitest
```
Then edit `package.json` `scripts` to add:
```json
"test": "vitest run"
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'api/**/*.test.ts'],
  },
});
```

- [ ] **Step 3: Add a smoke test**

Create `src/lib/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
describe('vitest', () => {
  it('runs', () => { expect(1 + 1).toBe(2); });
});
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/smoke.test.ts
git commit -m "test: add vitest runner"
```

---

### Task 2: Effective-price resolver (pure module) + tests

**Files:**
- Create: `src/lib/pricing.ts`
- Test: `src/lib/pricing.test.ts`

**Interfaces:**
- Produces:
  - `type OfferLike = { itemType: 'service' | 'product' | null; itemId: string | null; offerPrice: string; originalPrice?: string | null; badge?: string | null; active: boolean; startsAt?: string | null; endsAt?: string | null; }`
  - `type PriceInfo = { price: string; originalPrice?: string; onOffer: boolean; badge?: string; }`
  - `function isOfferActive(offer: OfferLike, nowIso: string): boolean`
  - `function effectivePrice(itemType: 'service' | 'product', itemId: string, basePrice: string, offers: OfferLike[], nowIso: string): PriceInfo`
  - Later tasks (and the API) import these.

- [ ] **Step 1: Write the failing test**

Create `src/lib/pricing.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { isOfferActive, effectivePrice, type OfferLike } from './pricing';

const base: OfferLike = {
  itemType: 'service', itemId: 'hydrafacial', offerPrice: '$99',
  originalPrice: '$249', badge: 'Sale', active: true, startsAt: null, endsAt: null,
};
const NOW = '2026-07-15T12:00:00.000Z';

describe('isOfferActive', () => {
  it('inactive flag → false', () => {
    expect(isOfferActive({ ...base, active: false }, NOW)).toBe(false);
  });
  it('not yet started → false', () => {
    expect(isOfferActive({ ...base, startsAt: '2026-08-01T00:00:00Z' }, NOW)).toBe(false);
  });
  it('expired → false', () => {
    expect(isOfferActive({ ...base, endsAt: '2026-07-01T00:00:00Z' }, NOW)).toBe(false);
  });
  it('open window + active → true', () => {
    expect(isOfferActive(base, NOW)).toBe(true);
  });
});

describe('effectivePrice', () => {
  it('no offer → base price, not on offer', () => {
    const r = effectivePrice('service', 'hydrafacial', '$249', [], NOW);
    expect(r).toEqual({ price: '$249', onOffer: false });
  });
  it('active linked offer → offer price + original + badge', () => {
    const r = effectivePrice('service', 'hydrafacial', '$249', [base], NOW);
    expect(r).toEqual({ price: '$99', originalPrice: '$249', onOffer: true, badge: 'Sale' });
  });
  it('offer for a different item is ignored', () => {
    const r = effectivePrice('service', 'microdermabrasion', '$199', [base], NOW);
    expect(r).toEqual({ price: '$199', onOffer: false });
  });
  it('inactive offer → base price', () => {
    const r = effectivePrice('service', 'hydrafacial', '$249', [{ ...base, active: false }], NOW);
    expect(r).toEqual({ price: '$249', onOffer: false });
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- pricing`
Expected: FAIL ("Cannot find module './pricing'").

- [ ] **Step 3: Implement `src/lib/pricing.ts`**

```ts
export type OfferLike = {
  itemType: 'service' | 'product' | null;
  itemId: string | null;
  offerPrice: string;
  originalPrice?: string | null;
  badge?: string | null;
  active: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
};

export type PriceInfo = {
  price: string;
  originalPrice?: string;
  onOffer: boolean;
  badge?: string;
};

export function isOfferActive(offer: OfferLike, nowIso: string): boolean {
  if (!offer.active) return false;
  const now = Date.parse(nowIso);
  if (offer.startsAt && Date.parse(offer.startsAt) > now) return false;
  if (offer.endsAt && Date.parse(offer.endsAt) < now) return false;
  return true;
}

export function effectivePrice(
  itemType: 'service' | 'product',
  itemId: string,
  basePrice: string,
  offers: OfferLike[],
  nowIso: string,
): PriceInfo {
  const match = offers.find(
    o => o.itemType === itemType && o.itemId === itemId && isOfferActive(o, nowIso),
  );
  if (!match) return { price: basePrice, onOffer: false };
  return {
    price: match.offerPrice,
    originalPrice: match.originalPrice || basePrice,
    onOffer: true,
    ...(match.badge ? { badge: match.badge } : {}),
  };
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test -- pricing`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/pricing.ts src/lib/pricing.test.ts
git commit -m "feat: add effective-price resolver"
```

---

### Task 3: Content DB schema + sanitize helper

**Files:**
- Create: `api/_content.ts`

**Interfaces:**
- Consumes: `sql`, `ensureSchema` from `api/_db.js`.
- Produces:
  - `async function ensureContentSchema(): Promise<void>` — creates `services`, `products`, `offers` tables if absent.
  - `function sanitizeHtml(html: string): string` — strips `<script>`, event handlers, and `javascript:` URLs (used by later phases when saving HTML).
  - Row types `ServiceRow`, `ProductRow`, `OfferRow` (exported).

- [ ] **Step 1: Implement `api/_content.ts`**

```ts
import { sql } from './_db.js';

export interface ServiceRow {
  id: string; name: string; category: string; price: string; duration: string;
  image: string | null; hero_title: string | null; hero_subtitle: string | null;
  description: string | null; long_description: string | null;
  benefits: string[]; ideal_for: string[]; step_flow: unknown[]; post_care: string[];
  faqs: unknown[]; options: unknown[]; technology: string | null;
  results: string | null; downtime: string | null; frequency: string | null;
  recovery: string | null; is_mobile_available: boolean; active: boolean;
  sort_order: number; meta_title: string | null; meta_description: string | null;
}
export interface ProductRow {
  id: string; name: string; category: string | null; price: string | null;
  description: string | null; image: string | null; active: boolean; sort_order: number;
}
export interface OfferRow {
  id: string; item_type: 'service' | 'product' | null; item_id: string | null;
  title: string; subtitle: string | null; description: string | null; image: string | null;
  original_price: string | null; offer_price: string; badge: string | null;
  highlights: string[]; active: boolean; starts_at: string | null; ends_at: string | null;
}

let ensured = false;
export async function ensureContentSchema(): Promise<void> {
  if (ensured) return;
  await sql`CREATE TABLE IF NOT EXISTS services (
    id text PRIMARY KEY,
    name text NOT NULL,
    category text NOT NULL DEFAULT 'Skincare',
    price text NOT NULL DEFAULT '',
    duration text NOT NULL DEFAULT '',
    image text,
    hero_title text, hero_subtitle text,
    description text, long_description text,
    benefits jsonb NOT NULL DEFAULT '[]'::jsonb,
    ideal_for jsonb NOT NULL DEFAULT '[]'::jsonb,
    step_flow jsonb NOT NULL DEFAULT '[]'::jsonb,
    post_care jsonb NOT NULL DEFAULT '[]'::jsonb,
    faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
    options jsonb NOT NULL DEFAULT '[]'::jsonb,
    technology text, results text, downtime text, frequency text, recovery text,
    is_mobile_available boolean NOT NULL DEFAULT false,
    active boolean NOT NULL DEFAULT true,
    sort_order integer NOT NULL DEFAULT 0,
    meta_title text, meta_description text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS products (
    id text PRIMARY KEY,
    name text NOT NULL,
    category text,
    price text,
    description text,
    image text,
    active boolean NOT NULL DEFAULT true,
    sort_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS offers (
    id text PRIMARY KEY,
    item_type text,
    item_id text,
    title text NOT NULL,
    subtitle text,
    description text,
    image text,
    original_price text,
    offer_price text NOT NULL DEFAULT '',
    badge text,
    highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
    active boolean NOT NULL DEFAULT true,
    starts_at timestamptz,
    ends_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`;
  ensured = true;
}

export function sanitizeHtml(html: string): string {
  return String(html)
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit --module esnext --moduleResolution bundler --target es2020 --skipLibCheck --types node api/_content.ts`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add api/_content.ts
git commit -m "feat: add content DB schema + sanitize helper"
```

---

### Task 4: Seed data module (mirror of current constants)

**Files:**
- Create: `api/_seed-data.ts`

**Interfaces:**
- Produces: `export const SEED_SERVICES`, `SEED_PRODUCTS`, `SEED_OFFERS` — plain arrays whose shapes match the DB row columns (snake_case keys omitted; use the `Service`/`Product`/`Offer` field names, mapped during insert in Task 5).

- [ ] **Step 1: Generate the seed data**

Copy the current `SERVICES`, `PRODUCTS`, and `OFFERS` arrays from `src/constants.ts` into `api/_seed-data.ts`, exporting them as `SEED_SERVICES`, `SEED_PRODUCTS`, `SEED_OFFERS`. Keep the same field names (`longDescription`, `isMobileAvailable`, `serviceId`, etc.). Do NOT import from `src/` (Vercel builds `api/` separately). This is an intentional one-time copy; after seeding, the DB is source of truth and `src/constants.ts` remains only as the frontend fallback.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit --module esnext --moduleResolution bundler --target es2020 --skipLibCheck api/_seed-data.ts`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add api/_seed-data.ts
git commit -m "feat: add content seed data"
```

---

### Task 5: Seed function + admin seed action

**Files:**
- Modify: `api/_content.ts` (add `seedContent`)
- Modify: `api/admin.ts` (register `seed-content` action, admin-auth)

**Interfaces:**
- Consumes: `SEED_SERVICES/PRODUCTS/OFFERS` (Task 4), `sql`, the existing `service_prices` table.
- Produces: `async function seedContent(): Promise<{ seeded: boolean; services: number; products: number; offers: number }>` — idempotent; no-ops if `services` already has rows. Applies existing `service_prices` overrides onto `services.price`.

- [ ] **Step 1: Implement `seedContent` in `api/_content.ts`**

```ts
import { SEED_SERVICES, SEED_PRODUCTS, SEED_OFFERS } from './_seed-data.js';

export async function seedContent() {
  await ensureContentSchema();
  const existing = (await sql`SELECT count(*)::int AS n FROM services`) as Array<{ n: number }>;
  if (existing[0].n > 0) return { seeded: false, services: 0, products: 0, offers: 0 };

  // Existing DB price overrides win over the constant price during seed.
  const overrideRows = (await sql`SELECT service_id, price FROM service_prices`) as Array<{ service_id: string; price: string }>;
  const overrides: Record<string, string> = {};
  for (const r of overrideRows) overrides[r.service_id] = r.price;

  let sOrder = 0;
  for (const s of SEED_SERVICES as any[]) {
    await sql`INSERT INTO services (
      id, name, category, price, duration, image, hero_title, hero_subtitle,
      description, long_description, benefits, ideal_for, step_flow, post_care,
      faqs, options, technology, results, downtime, frequency, recovery,
      is_mobile_available, active, sort_order, meta_title, meta_description
    ) VALUES (
      ${s.id}, ${s.name}, ${s.category}, ${overrides[s.id] || s.price || ''}, ${s.duration || ''},
      ${s.image || null}, ${s.heroTitle || null}, ${s.heroSubtitle || null},
      ${s.description || null}, ${s.longDescription || null},
      ${JSON.stringify(s.benefits || [])}::jsonb, ${JSON.stringify(s.idealFor || [])}::jsonb,
      ${JSON.stringify(s.stepFlow || [])}::jsonb, ${JSON.stringify(s.postCare || [])}::jsonb,
      ${JSON.stringify(s.faqs || [])}::jsonb, ${JSON.stringify(s.options || [])}::jsonb,
      ${s.technology || null}, ${s.results || null}, ${s.downtime || null},
      ${s.frequency || null}, ${s.recovery || null},
      ${!!s.isMobileAvailable}, true, ${sOrder++},
      ${s.metaTitle || null}, ${s.metaDescription || null}
    ) ON CONFLICT (id) DO NOTHING`;
  }
  let pOrder = 0;
  for (const p of SEED_PRODUCTS as any[]) {
    await sql`INSERT INTO products (id, name, category, price, description, image, active, sort_order)
      VALUES (${p.id}, ${p.name}, ${p.category || null}, ${p.price || null}, ${p.description || null},
        ${p.image || null}, true, ${pOrder++}) ON CONFLICT (id) DO NOTHING`;
  }
  for (const o of SEED_OFFERS as any[]) {
    await sql`INSERT INTO offers (id, item_type, item_id, title, subtitle, description, image,
        original_price, offer_price, badge, highlights, active, starts_at, ends_at)
      VALUES (${o.id}, ${o.serviceId ? 'service' : null}, ${o.serviceId || null}, ${o.title},
        ${o.subtitle || null}, ${o.description || null}, ${o.image || null},
        ${o.originalPrice || null}, ${o.offerPrice || ''}, ${o.badge || null},
        ${JSON.stringify(o.highlights || [])}::jsonb, true, null, null)
      ON CONFLICT (id) DO NOTHING`;
  }
  return { seeded: true, services: SEED_SERVICES.length, products: SEED_PRODUCTS.length, offers: SEED_OFFERS.length };
}
```

- [ ] **Step 2: Register the admin action in `api/admin.ts`**

Find the action dispatch (around `admin.ts:554-563`) and add a case that requires auth:
```ts
if (action === 'seed-content') {
  const session = verifySession(readBearer(req.headers.authorization));
  if (!session) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const { seedContent } = await import('./_content.js');
  const result = await seedContent();
  return res.status(200).json({ success: true, ...result });
}
```
(Confirm `verifySession`/`readBearer` are already imported in `admin.ts`; if not, add `import { verifySession, readBearer } from './_auth.js';`.)

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit --module esnext --moduleResolution bundler --target es2020 --skipLibCheck --types node api/_content.ts api/admin.ts`
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add api/_content.ts api/admin.ts
git commit -m "feat: add idempotent content seed + admin seed action"
```

---

### Task 6: Public `GET /api/content` endpoint

**Files:**
- Create: `api/content.ts`

**Interfaces:**
- Consumes: `ensureContentSchema`, row types, `sql`, `effectivePrice`-equivalent logic (recomputed here in JS over rows).
- Produces: `GET /api/content` → `{ success, services, products, offers }` where each service/product carries a `pricing: PriceInfo` object (computed from active offers). camelCase keys mapped from rows.

- [ ] **Step 1: Implement `api/content.ts`**

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_db.js';
import { ensureContentSchema, type ServiceRow, type ProductRow, type OfferRow } from './_content.js';

function offerActive(o: OfferRow, now: number): boolean {
  if (!o.active) return false;
  if (o.starts_at && Date.parse(o.starts_at) > now) return false;
  if (o.ends_at && Date.parse(o.ends_at) < now) return false;
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method not allowed' });
  try {
    await ensureContentSchema();
    const [services, products, offers] = await Promise.all([
      sql`SELECT * FROM services WHERE active = true ORDER BY sort_order, name` as Promise<ServiceRow[]>,
      sql`SELECT * FROM products WHERE active = true ORDER BY sort_order, name` as Promise<ProductRow[]>,
      sql`SELECT * FROM offers WHERE active = true` as Promise<OfferRow[]>,
    ]);
    const now = Date.now();
    const activeOffers = offers.filter(o => offerActive(o, now));
    const pricing = (type: 'service' | 'product', id: string, base: string | null) => {
      const m = activeOffers.find(o => o.item_type === type && o.item_id === id);
      if (!m) return { price: base || '', onOffer: false };
      return { price: m.offer_price, originalPrice: m.original_price || base || '', onOffer: true, badge: m.badge || undefined };
    };
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(200).json({
      success: true,
      services: services.map(s => ({ ...toCamelService(s), pricing: pricing('service', s.id, s.price) })),
      products: products.map(p => ({ ...toCamelProduct(p), pricing: pricing('product', p.id, p.price) })),
      offers: offers.map(toCamelOffer),
    });
  } catch (err) {
    console.error('content error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load content.' });
  }
}

function toCamelService(s: ServiceRow) {
  return {
    id: s.id, name: s.name, category: s.category, price: s.price, duration: s.duration,
    image: s.image || undefined, heroTitle: s.hero_title || undefined, heroSubtitle: s.hero_subtitle || undefined,
    description: s.description || undefined, longDescription: s.long_description || undefined,
    benefits: s.benefits, idealFor: s.ideal_for, stepFlow: s.step_flow, postCare: s.post_care,
    faqs: s.faqs, options: s.options, technology: s.technology || undefined,
    results: s.results || undefined, downtime: s.downtime || undefined, frequency: s.frequency || undefined,
    recovery: s.recovery || undefined, isMobileAvailable: s.is_mobile_available,
    metaTitle: s.meta_title || undefined, metaDescription: s.meta_description || undefined,
  };
}
function toCamelProduct(p: ProductRow) {
  return { id: p.id, name: p.name, category: p.category || undefined, price: p.price || undefined, description: p.description || undefined, image: p.image || undefined };
}
function toCamelOffer(o: OfferRow) {
  return {
    id: o.id, serviceId: o.item_type === 'service' ? o.item_id || undefined : undefined,
    title: o.title, subtitle: o.subtitle || undefined, description: o.description || undefined,
    image: o.image || undefined, originalPrice: o.original_price || undefined,
    offerPrice: o.offer_price, badge: o.badge || undefined, highlights: o.highlights,
  };
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit --module esnext --moduleResolution bundler --target es2020 --skipLibCheck --types node api/content.ts`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add api/content.ts
git commit -m "feat: add public GET /api/content endpoint"
```

---

### Task 7: `useContent()` context with constants fallback

**Files:**
- Create: `src/context/ContentContext.tsx`
- Modify: `src/App.tsx` (wrap the app in `<ContentProvider>`)

**Interfaces:**
- Consumes: `SERVICES`, `OFFERS`, `PRODUCTS` from `../constants` (fallback); `PriceInfo` from `../lib/pricing`.
- Produces:
  - `useContent(): { services: Service[]; offers: Offer[]; products: Product[]; pricingFor(type, id, base): PriceInfo; loading: boolean; source: 'api' | 'fallback' }`
  - `<ContentProvider>` component.

- [ ] **Step 1: Implement `src/context/ContentContext.tsx`**

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SERVICES, OFFERS, PRODUCTS } from '../constants';
import type { Service, Offer, Product } from '../types';
import type { PriceInfo } from '../lib/pricing';

type ApiService = Service & { pricing?: PriceInfo };
type ApiProduct = Product & { pricing?: PriceInfo };

type Ctx = {
  services: ApiService[];
  offers: Offer[];
  products: ApiProduct[];
  pricingFor: (type: 'service' | 'product', id: string, base: string) => PriceInfo;
  loading: boolean;
  source: 'api' | 'fallback';
};

const ContentCtx = createContext<Ctx | null>(null);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<Omit<Ctx, 'pricingFor'>>({
    services: SERVICES, offers: OFFERS, products: PRODUCTS, loading: true, source: 'fallback',
  });

  useEffect(() => {
    let alive = true;
    fetch('/api/content')
      .then(r => r.json())
      .then(d => {
        if (!alive || !d?.success) return;
        setState({ services: d.services, offers: d.offers, products: d.products, loading: false, source: 'api' });
      })
      .catch(() => { if (alive) setState(s => ({ ...s, loading: false })); });
    return () => { alive = false; };
  }, []);

  const pricingFor = (type: 'service' | 'product', id: string, base: string): PriceInfo => {
    const list = type === 'service' ? state.services : state.products;
    const found = (list as Array<ApiService | ApiProduct>).find(i => i.id === id);
    if (found && (found as ApiService).pricing) return (found as ApiService).pricing!;
    return { price: base, onOffer: false };
  };

  return <ContentCtx.Provider value={{ ...state, pricingFor }}>{children}</ContentCtx.Provider>;
};

export function useContent(): Ctx {
  const ctx = useContext(ContentCtx);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
```

- [ ] **Step 2: Wrap the app in `src/App.tsx`**

Import and wrap the `<Router>...</Router>` tree (or the outer div) with `<ContentProvider>`:
```tsx
import { ContentProvider } from './context/ContentContext';
// ...
return (
  <ContentProvider>
    <Router> ... </Router>
  </ContentProvider>
);
```

- [ ] **Step 3: Typecheck + build**

Run: `npx tsc --noEmit -p tsconfig.json && npx vite build`
Expected: TSC exit 0, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/context/ContentContext.tsx src/App.tsx
git commit -m "feat: add content context with constants fallback"
```

---

### Task 8: Shared `<Price>` component + test

**Files:**
- Create: `src/components/Price.tsx`
- Test: `src/components/Price.test.tsx` (render-free logic test via a helper) — OR skip render test and rely on build; see Step 1.

**Interfaces:**
- Consumes: `PriceInfo` from `../lib/pricing`.
- Produces: `<Price info={PriceInfo} className? size? />` — renders `$X` normally; when `info.onOffer`, renders `<s>{originalPrice}</s> {price}` plus an optional badge.

- [ ] **Step 1: Implement `src/components/Price.tsx`**

```tsx
import React from 'react';
import type { PriceInfo } from '../lib/pricing';

export const Price: React.FC<{ info: PriceInfo; className?: string; showBadge?: boolean }> = ({ info, className, showBadge = true }) => {
  if (!info.onOffer) return <span className={className}>{info.price}</span>;
  return (
    <span className={className}>
      {info.originalPrice && <s className="text-spa-ink/40 mr-1.5">{info.originalPrice}</s>}
      <span className="text-emerald-600 font-semibold">{info.price}</span>
      {showBadge && info.badge && (
        <span className="ml-2 text-[9px] uppercase tracking-widest font-bold text-emerald-700 bg-emerald-500/15 px-2 py-0.5 rounded-full">{info.badge}</span>
      )}
    </span>
  );
};
```

- [ ] **Step 2: Build check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/Price.tsx
git commit -m "feat: add shared Price component"
```

---

### Task 9: Refactor Services page to context + `<Price>`

**Files:**
- Modify: `src/pages/Services.tsx`

**Interfaces:**
- Consumes: `useContent()`, `pricingFor`, `<Price>`.

- [ ] **Step 1: Replace data source**

In `src/pages/Services.tsx`: remove `import { SERVICES } from '../constants'` usage for the base list; instead `const { services, pricingFor } = useContent();` and build `allServices` from `services` (drop the `localStorage` custom-services merge — the DB is now the source). Keep the threading-umbrella and options-expansion logic.

- [ ] **Step 2: Render prices via `<Price>`**

Where the card currently renders `{item.price}` (Tag row), replace with:
```tsx
<Price info={item.optionId ? { price: item.price, onOffer: false } : pricingFor('service', item.serviceId, item.price)} />
```
(Options keep their own tier price; base services show offer pricing.)

- [ ] **Step 3: Typecheck + build**

Run: `npx tsc --noEmit -p tsconfig.json && npx vite build`
Expected: exit 0 / success.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Services.tsx
git commit -m "refactor: Services page reads from content context"
```

---

### Task 10: Refactor ServiceDetail to context + `<Price>`

**Files:**
- Modify: `src/pages/ServiceDetail.tsx`

- [ ] **Step 1: Replace data source**

Replace `import { SERVICES } from '../constants'` + `livePrices` fetch with `const { services, pricingFor } = useContent();`. Find the service by `id` from `services`. Remove the `/api/service-prices` fetch (pricing now comes from context).

- [ ] **Step 2: Headline price**

Compute `const pi = pricingFor('service', service.id, service.price);` and render the hero/sticky price via `<Price info={service.options?.length ? { price: \`From ${lowestTierPrice}\`, onOffer: false } : pi} />`. Keep the "From" logic for tiered services.

- [ ] **Step 3: Typecheck + build**

Run: `npx tsc --noEmit -p tsconfig.json && npx vite build`
Expected: exit 0 / success.

- [ ] **Step 4: Commit**

```bash
git add src/pages/ServiceDetail.tsx
git commit -m "refactor: ServiceDetail reads from content context"
```

---

### Task 11: Refactor Booking to context + offer pricing

**Files:**
- Modify: `src/pages/Booking.tsx`

- [ ] **Step 1: Replace data source**

Replace `import { SERVICES }` + `customPrices` fetch with `const { services, pricingFor } = useContent();`. Build `bookableItems` from `services`. For a non-option service, use `pricingFor('service', s.id, s.price).price` as the booking price (so an active offer books at the offer price). Options keep their tier price. Remove the `/api/service-prices` fetch.

- [ ] **Step 2: Typecheck + build**

Run: `npx tsc --noEmit -p tsconfig.json && npx vite build`
Expected: exit 0 / success.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Booking.tsx
git commit -m "refactor: Booking reads from content context + offer pricing"
```

---

### Task 12: Refactor Offers + Products + Home to context

**Files:**
- Modify: `src/pages/Offers.tsx`, `src/pages/Products.tsx`, `src/pages/Home.tsx`

- [ ] **Step 1: Offers page**

Replace `import { OFFERS }` with `const { offers } = useContent();`. Render the same cards from `offers`.

- [ ] **Step 2: Products page**

Replace `import { PRODUCTS }` with `const { products, pricingFor } = useContent();`. Render product price via `<Price info={pricingFor('product', product.id, product.price || '')} />`.

- [ ] **Step 3: Home page**

If `Home.tsx` imports `SERVICES`/`OFFERS` for featured sections, switch to `useContent()`. (If it uses only static arrays defined inline, leave as-is.)

- [ ] **Step 4: Typecheck + build**

Run: `npx tsc --noEmit -p tsconfig.json && npx vite build`
Expected: exit 0 / success.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Offers.tsx src/pages/Products.tsx src/pages/Home.tsx
git commit -m "refactor: Offers/Products/Home read from content context"
```

---

### Task 13: Seed on deploy + retire `service_prices` reads

**Files:**
- Modify: `src/pages/Admin.tsx` (add a "Seed content" button in an admin tab that POSTs `?action=seed-content`)
- Modify: `src/pages/Services.tsx`, `src/pages/ServiceDetail.tsx`, `src/pages/Booking.tsx` (confirm no remaining `/api/service-prices` fetches)

**Interfaces:**
- Consumes: existing admin bearer token (`rd_harmony_admin_token`).

- [ ] **Step 1: Add a one-click seed button**

In `Admin.tsx`, add a button (Pricing/Services tab) that calls:
```ts
await fetch('/api/admin?action=seed-content', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
```
and shows the returned counts. This runs the idempotent seed once against production.

- [ ] **Step 2: Grep for leftover overrides**

Run: `grep -rn "service-prices" src`
Expected: no remaining fetches in the refactored pages (Admin may still POST prices until Phase 2 replaces the tab — that's fine, but note it in the commit).

- [ ] **Step 3: Typecheck + build**

Run: `npx tsc --noEmit -p tsconfig.json && npx vite build`
Expected: exit 0 / success.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Admin.tsx
git commit -m "feat: add admin seed-content button"
```

---

### Task 14: Manual acceptance + push

- [ ] **Step 1: Run the full check suite**

Run: `npm test && npx tsc --noEmit -p tsconfig.json && npx vite build`
Expected: all pass.

- [ ] **Step 2: Deploy + seed**

Push, let Vercel deploy, log into the admin, click "Seed content", confirm counts returned (services/products/offers > 0).

- [ ] **Step 3: Verify parity**

Visit the live site: Services, a service detail page, Booking dropdown, Offers, Products, Home. Confirm everything looks identical to before (now DB-driven). Confirm the existing $99 Non-Surgical Facelift offer still renders struck-through via `<Price>` on the surfaces where its linked service appears.

- [ ] **Step 4: Commit any fixes + push**

```bash
git push origin main
```

## Self-Review

- **Spec coverage (Phase 1 scope):** tables (T3) ✓, seed/migration incl. `service_prices` fold-in (T4/T5) ✓, `/api/content` with effective pricing (T6) ✓, `useContent()` + fallback (T7) ✓, shared `<Price>` strikethrough (T8) ✓, frontend refactor of all six pages (T9–T12) ✓, retire `service_prices` reads (T13) ✓, testing/manual acceptance (T2, T14) ✓. Offers/Services/Products *admin CRUD*, WYSIWYG, and photo editor are **Phase 2–4** (separate plans) — intentionally out of this plan.
- **Placeholder scan:** no TBD/TODO; code shown for each logic step. Page-refactor tasks (T9–T13) give exact files + the specific edit; these are mechanical swaps of an import + price render, so prose + the shared snippet suffices.
- **Type consistency:** `PriceInfo`/`OfferLike` (T2) reused by `<Price>` (T8) and context (T7); row types (T3) reused by `/api/content` (T6); camelCase mappers keep the frontend `Service`/`Offer`/`Product` shapes so pages need minimal change.

## Follow-on plans (not this document)
- **Phase 2:** Admin Services CRUD + Service Builder + TipTap WYSIWYG + image-upload endpoint (Vercel Blob public) + Filerobot photo editor.
- **Phase 3:** Offers admin CRUD + wire offer engine end-to-end.
- **Phase 4:** Products admin CRUD.
- **Phase 5:** Automated review-request campaign (daily cron, 1 day post-appointment + 3 weekly follow-ups, `GOOGLE_REVIEW_URL` env var). See spec §13b.
