import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureSchema } from '../_lib/db';
import { sendMail } from '../_lib/mailer';
import { adminOtpEmail } from '../_lib/templates';
import { verifyPassword, hashToken, randomNumericCode } from '../_lib/auth';
import { parseBody } from '../_lib/http';

const OTP_TTL_MINUTES = 10;

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(1, local.length - 2))}@${domain}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const body = parseBody(req);
  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  try {
    await ensureSchema();

    const rows = (await sql`
      SELECT id, username, email, password_hash
        FROM admin_users
       WHERE username = ${username}
       LIMIT 1
    `) as Array<{ id: number; username: string; email: string; password_hash: string }>;

    const user = rows[0];
    const ok = user ? verifyPassword(password, user.password_hash) : false;
    if (!user || !ok) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const code = randomNumericCode(6);
    const codeHash = hashToken(code);
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60_000);

    const inserted = (await sql`
      INSERT INTO admin_otps (user_id, code_hash, expires_at)
      VALUES (${user.id}, ${codeHash}, ${expiresAt.toISOString()})
      RETURNING id
    `) as Array<{ id: number }>;

    try {
      await sendMail({
        to: user.email,
        subject: `Admin login code: ${code}`,
        html: adminOtpEmail(code, OTP_TTL_MINUTES),
      });
    } catch (err) {
      console.error('OTP email failed:', err);
      return res.status(502).json({ success: false, message: 'Could not send verification code. Please try again.' });
    }

    return res.status(200).json({
      success: true,
      challenge_id: inserted[0].id,
      email_hint: maskEmail(user.email),
      ttl_minutes: OTP_TTL_MINUTES,
    });
  } catch (err) {
    console.error('admin/login error:', err);
    return res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
}
