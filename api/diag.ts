import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const results: Record<string, { ok: boolean; error?: string }> = {};

  const tryLoad = async (name: string, loader: () => Promise<unknown>) => {
    try {
      await loader();
      results[name] = { ok: true };
    } catch (err) {
      results[name] = { ok: false, error: err instanceof Error ? `${err.name}: ${err.message}` : String(err) };
    }
  };

  await tryLoad('templates', () => import('./_lib/templates'));
  await tryLoad('mailer', () => import('./_lib/mailer'));
  await tryLoad('http', () => import('./_lib/http'));
  await tryLoad('auth', () => import('./_lib/auth'));
  await tryLoad('db', () => import('./_lib/db'));

  return res.status(200).json({
    node: process.version,
    env: {
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      SMTP_HOST: process.env.SMTP_HOST || null,
      SMTP_USER: !!process.env.SMTP_USER,
      SMTP_PASS: !!process.env.SMTP_PASS,
      MAIL_FROM: !!process.env.MAIL_FROM,
      MAIL_TO_BIZ: !!process.env.MAIL_TO_BIZ,
      ADMIN_SECRET: !!process.env.ADMIN_SECRET,
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
      ADMIN_USERNAME: process.env.ADMIN_USERNAME || null,
      APP_URL: process.env.APP_URL || null,
    },
    modules: results,
  });
}
