import type { VercelRequest } from '@vercel/node';

export function parseBody(req: VercelRequest): Record<string, unknown> | null {
  if (req.body == null) return null;
  if (typeof req.body === 'object') return req.body as Record<string, unknown>;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return null; }
  }
  return null;
}

export function appBaseUrl(req: VercelRequest): string {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/+$/, '');
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  return `${proto}://${host}`;
}
