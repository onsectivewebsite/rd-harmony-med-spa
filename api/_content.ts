import { sql } from './_db.js';
import { SEED_SERVICES, SEED_PRODUCTS, SEED_OFFERS } from './_seed-data.js';

export interface ServiceInput {
  id?: string;
  name: string;
  category: string;
  price: string;
  duration: string;
  image?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  description?: string | null;
  longDescription?: string | null;
  benefits?: string[];
  idealFor?: string[];
  stepFlow?: unknown[];
  postCare?: string[];
  faqs?: unknown[];
  options?: unknown[];
  technology?: string | null;
  results?: string | null;
  downtime?: string | null;
  frequency?: string | null;
  recovery?: string | null;
  isMobileAvailable?: boolean;
  active?: boolean;
  sortOrder?: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  productsUsed?: string | null;
  experience?: string | null;
  testimonials?: unknown[];
  precautions?: string[];
  skinConcern?: string[];
}
export interface ServiceRow {
  id: string; name: string; category: string; price: string; duration: string;
  image: string | null; hero_title: string | null; hero_subtitle: string | null;
  description: string | null; long_description: string | null;
  benefits: string[]; ideal_for: string[]; step_flow: unknown[]; post_care: string[];
  faqs: unknown[]; options: unknown[]; technology: string | null;
  results: string | null; downtime: string | null; frequency: string | null;
  recovery: string | null; is_mobile_available: boolean; active: boolean;
  sort_order: number; meta_title: string | null; meta_description: string | null;
  products_used: string | null;
  experience: string | null;
  testimonials: unknown[];
  precautions: string[];
  skin_concern: string[];
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
    products_used text,
    experience text,
    testimonials jsonb NOT NULL DEFAULT '[]'::jsonb,
    precautions jsonb NOT NULL DEFAULT '[]'::jsonb,
    skin_concern jsonb NOT NULL DEFAULT '[]'::jsonb,
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
  await sql`ALTER TABLE services ADD COLUMN IF NOT EXISTS products_used text`;
  await sql`ALTER TABLE services ADD COLUMN IF NOT EXISTS experience text`;
  await sql`ALTER TABLE services ADD COLUMN IF NOT EXISTS testimonials jsonb NOT NULL DEFAULT '[]'::jsonb`;
  await sql`ALTER TABLE services ADD COLUMN IF NOT EXISTS precautions jsonb NOT NULL DEFAULT '[]'::jsonb`;
  await sql`ALTER TABLE services ADD COLUMN IF NOT EXISTS skin_concern jsonb NOT NULL DEFAULT '[]'::jsonb`;
  ensured = true;
}

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
      is_mobile_available, active, sort_order, meta_title, meta_description,
      products_used, experience, testimonials, precautions, skin_concern
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
      ${s.metaTitle || null}, ${s.metaDescription || null},
      ${s.productsUsed || null}, ${s.experience || null},
      ${JSON.stringify(s.testimonials || [])}::jsonb,
      ${JSON.stringify(s.precautions || [])}::jsonb,
      ${JSON.stringify(s.skinConcern || [])}::jsonb
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

function slugifyServiceName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export async function listAllServices(): Promise<ServiceRow[]> {
  await ensureContentSchema();
  return (await sql`SELECT * FROM services ORDER BY sort_order, name`) as ServiceRow[];
}

export async function upsertService(input: ServiceInput): Promise<ServiceRow> {
  await ensureContentSchema();

  const isNew = !input.id || !input.id.trim();
  let id = input.id && input.id.trim() ? input.id.trim() : slugifyServiceName(input.name);

  if (isNew) {
    const base = id;
    let candidate = base;
    let suffix = 2;
    // Avoid colliding with an existing row when the id was auto-generated from the name.
    while (true) {
      const found = (await sql`SELECT 1 FROM services WHERE id = ${candidate} LIMIT 1`) as unknown[];
      if (found.length === 0) break;
      candidate = `${base}-${suffix++}`;
    }
    id = candidate;
  }

  const active = input.active === undefined ? true : input.active;
  const sortOrder = input.sortOrder === undefined ? 0 : input.sortOrder;

  const rows = (await sql`
    INSERT INTO services (
      id, name, category, price, duration, image, hero_title, hero_subtitle,
      description, long_description, benefits, ideal_for, step_flow, post_care,
      faqs, options, technology, results, downtime, frequency, recovery,
      is_mobile_available, active, sort_order, meta_title, meta_description,
      products_used, experience, testimonials, precautions, skin_concern
    ) VALUES (
      ${id}, ${input.name}, ${input.category}, ${input.price}, ${input.duration},
      ${input.image ?? null}, ${input.heroTitle ?? null}, ${input.heroSubtitle ?? null},
      ${input.description ?? null}, ${input.longDescription ?? null},
      ${JSON.stringify(input.benefits || [])}::jsonb, ${JSON.stringify(input.idealFor || [])}::jsonb,
      ${JSON.stringify(input.stepFlow || [])}::jsonb, ${JSON.stringify(input.postCare || [])}::jsonb,
      ${JSON.stringify(input.faqs || [])}::jsonb, ${JSON.stringify(input.options || [])}::jsonb,
      ${input.technology ?? null}, ${input.results ?? null}, ${input.downtime ?? null},
      ${input.frequency ?? null}, ${input.recovery ?? null},
      ${!!input.isMobileAvailable}, ${active}, ${sortOrder},
      ${input.metaTitle ?? null}, ${input.metaDescription ?? null},
      ${input.productsUsed ?? null}, ${input.experience ?? null},
      ${JSON.stringify(input.testimonials || [])}::jsonb,
      ${JSON.stringify(input.precautions || [])}::jsonb,
      ${JSON.stringify(input.skinConcern || [])}::jsonb
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      category = EXCLUDED.category,
      price = EXCLUDED.price,
      duration = EXCLUDED.duration,
      image = EXCLUDED.image,
      hero_title = EXCLUDED.hero_title,
      hero_subtitle = EXCLUDED.hero_subtitle,
      description = EXCLUDED.description,
      long_description = EXCLUDED.long_description,
      benefits = EXCLUDED.benefits,
      ideal_for = EXCLUDED.ideal_for,
      step_flow = EXCLUDED.step_flow,
      post_care = EXCLUDED.post_care,
      faqs = EXCLUDED.faqs,
      options = EXCLUDED.options,
      technology = EXCLUDED.technology,
      results = EXCLUDED.results,
      downtime = EXCLUDED.downtime,
      frequency = EXCLUDED.frequency,
      recovery = EXCLUDED.recovery,
      is_mobile_available = EXCLUDED.is_mobile_available,
      active = EXCLUDED.active,
      sort_order = EXCLUDED.sort_order,
      meta_title = EXCLUDED.meta_title,
      meta_description = EXCLUDED.meta_description,
      products_used = EXCLUDED.products_used,
      experience = EXCLUDED.experience,
      testimonials = EXCLUDED.testimonials,
      precautions = EXCLUDED.precautions,
      skin_concern = EXCLUDED.skin_concern,
      updated_at = now()
    RETURNING *
  `) as ServiceRow[];

  return rows[0];
}

export async function setServiceActive(id: string, active: boolean): Promise<void> {
  await ensureContentSchema();
  await sql`UPDATE services SET active = ${active}, updated_at = now() WHERE id = ${id}`;
}

export async function deleteService(id: string): Promise<void> {
  await ensureContentSchema();
  await sql`DELETE FROM services WHERE id = ${id}`;
}
