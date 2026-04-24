import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureSchema } from './_lib/db';
import { hashToken, issueSession } from './_lib/auth';
import { parseBody } from './_lib/http';

const MAX_ATTEMPTS = 5;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const body = parseBody(req);
  const challengeId = Number(body?.challenge_id);
  const code = typeof body?.code === 'string' ? body.code.trim() : '';
  if (!challengeId || !/^\d{6}$/.test(code)) {
    return res.status(400).json({ success: false, message: 'Invalid challenge or code format' });
  }

  try {
    await ensureSchema();

    const rows = (await sql`
      SELECT o.id, o.user_id, o.code_hash, o.expires_at, o.consumed_at, o.attempts, u.username
        FROM admin_otps o
        JOIN admin_users u ON u.id = o.user_id
       WHERE o.id = ${challengeId}
       LIMIT 1
    `) as Array<{
      id: number; user_id: number; code_hash: string;
      expires_at: string; consumed_at: string | null; attempts: number; username: string;
    }>;

    const otp = rows[0];
    if (!otp) {
      return res.status(400).json({ success: false, message: 'Verification challenge not found' });
    }
    if (otp.consumed_at) {
      return res.status(400).json({ success: false, message: 'Code already used' });
    }
    if (new Date(otp.expires_at).getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: 'Code expired. Please sign in again.' });
    }
    if (otp.attempts >= MAX_ATTEMPTS) {
      return res.status(429).json({ success: false, message: 'Too many attempts. Please sign in again.' });
    }

    if (hashToken(code) !== otp.code_hash) {
      await sql`UPDATE admin_otps SET attempts = attempts + 1 WHERE id = ${otp.id}`;
      return res.status(401).json({ success: false, message: 'Incorrect code' });
    }

    await sql`UPDATE admin_otps SET consumed_at = NOW() WHERE id = ${otp.id}`;
    const token = issueSession(otp.user_id, otp.username);

    return res.status(200).json({ success: true, token, username: otp.username });
  } catch (err) {
    console.error('admin/verify-otp error:', err);
    return res.status(500).json({ success: false, message: 'Verification failed. Please try again.' });
  }
}
