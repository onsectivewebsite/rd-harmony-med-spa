import type { VercelRequest } from '@vercel/node';

export function parseBody(req: VercelRequest): Record<string, unknown> | null {
  if (req.body == null) return null;
  if (typeof req.body === 'object') return req.body as Record<string, unknown>;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return null; }
  }
  return null;
}
