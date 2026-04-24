import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureSchema } from '../_lib/db';
import { sendMail } from '../_lib/mailer';
import { adminResetEmail } from '../_lib/templates';
import { hashToken, randomToken } from '../_lib/auth';
import { parseBody } from '../_lib/http';

const RESET_TTL_MINUTES = 30;

function resetBaseUrl(req: VercelRequest): string {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/+$/, '');
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  return `${proto}://${host}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const body = parseBody(req);
  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  if (!username) {
    return res.status(400).json({ success: false, message: 'Username required' });
  }

  try {
    await ensureSchema();

    const rows = (await sql`
      SELECT id, email FROM admin_users WHERE username = ${username} LIMIT 1
    `) as Array<{ id: number; email: string }>;

    if (rows[0]) {
      const token = randomToken(24);
      const tokenHash = hashToken(token);
      const expiresAt = new Date(Date.now() + RESET_TTL_MINUTES * 60_000);

      await sql`
        INSERT INTO admin_reset_tokens (user_id, token_hash, expires_at)
        VALUES (${rows[0].id}, ${tokenHash}, ${expiresAt.toISOString()})
      `;

      const resetUrl = `${resetBaseUrl(req)}/admin?reset=${token}`;

      try {
        await sendMail({
          to: rows[0].email,
          subject: 'Reset your RD Harmony admin password',
          html: adminResetEmail(resetUrl, RESET_TTL_MINUTES),
        });
      } catch (err) {
        console.error('Reset email failed:', err);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'If that account exists, a reset link has been emailed to the admin address on file.',
    });
  } catch (err) {
    console.error('admin/request-reset error:', err);
    return res.status(500).json({ success: false, message: 'Could not start password reset. Please try again.' });
  }
}
