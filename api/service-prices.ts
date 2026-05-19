import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureSchema } from './_db.js';
import { verifySession, readBearer } from './_auth.js';

function parseBody(req: VercelRequest): Record<string, unknown> {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body) as Record<string, unknown>; } catch { return {}; }
  }
  return req.body as Record<string, unknown>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureSchema();

    if (req.method === 'GET') {
      // Public read — visitors fetch overrides to render up-to-date prices.
      const rows = (await sql`SELECT service_id, price FROM service_prices`) as Array<{
        service_id: string;
        price: string;
      }>;
      const prices: Record<string, string> = {};
      for (const r of rows) prices[r.service_id] = r.price;
      res.setHeader('Cache-Control', 'no-store, max-age=0');
      return res.status(200).json({ success: true, prices });
    }

    if (req.method === 'POST') {
      // Admin write — replaces the full override map atomically.
      const session = verifySession(readBearer(req.headers.authorization));
      if (!session) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const body = parseBody(req);
      const raw = body.prices;
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        return res.status(400).json({ success: false, message: 'Body must include a `prices` object.' });
      }

      const entries: Array<[string, string]> = [];
      for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
        const id = String(k).trim();
        const price = typeof v === 'string' ? v.trim() : '';
        if (!id) continue;
        if (price) entries.push([id, price]);
      }

      const keepIds = entries.map(([id]) => id);
      if (keepIds.length === 0) {
        await sql`DELETE FROM service_prices`;
      } else {
        await sql`DELETE FROM service_prices WHERE service_id <> ALL(${keepIds}::text[])`;
      }
      for (const [id, price] of entries) {
        await sql`
          INSERT INTO service_prices (service_id, price, updated_at)
          VALUES (${id}, ${price}, NOW())
          ON CONFLICT (service_id) DO UPDATE
            SET price = EXCLUDED.price, updated_at = NOW()
        `;
      }

      return res.status(200).json({ success: true, count: entries.length });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (err) {
    console.error('service-prices error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load or save service prices.' });
  }
}
