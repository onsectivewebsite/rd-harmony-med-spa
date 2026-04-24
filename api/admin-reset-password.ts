import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureSchema } from './_lib/db';
import { hashPassword, hashToken } from './_lib/auth';
import { parseBody } from './_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const body = parseBody(req);
  const token = typeof body?.token === 'string' ? body.token.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!token || password.length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Reset token is required and password must be at least 10 characters.',
    });
  }

  try {
    await ensureSchema();

    const rows = (await sql`
      SELECT id, user_id, expires_at, consumed_at
        FROM admin_reset_tokens
       WHERE token_hash = ${hashToken(token)}
       LIMIT 1
    `) as Array<{ id: number; user_id: number; expires_at: string; consumed_at: string | null }>;

    const rt = rows[0];
    if (!rt) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset link.' });
    }
    if (rt.consumed_at) {
      return res.status(400).json({ success: false, message: 'This reset link was already used.' });
    }
    if (new Date(rt.expires_at).getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: 'This reset link has expired.' });
    }

    await sql`UPDATE admin_users SET password_hash = ${hashPassword(password)}, updated_at = NOW() WHERE id = ${rt.user_id}`;
    await sql`UPDATE admin_reset_tokens SET consumed_at = NOW() WHERE id = ${rt.id}`;
    await sql`UPDATE admin_otps SET consumed_at = COALESCE(consumed_at, NOW()) WHERE user_id = ${rt.user_id}`;

    return res.status(200).json({ success: true, message: 'Password updated. You can now sign in.' });
  } catch (err) {
    console.error('admin/reset-password error:', err);
    return res.status(500).json({ success: false, message: 'Password reset failed. Please try again.' });
  }
}
