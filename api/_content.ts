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
