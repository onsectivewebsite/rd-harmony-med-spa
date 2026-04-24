import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureSchema, generateBookingNumber } from './_db.js';
import { sendMail } from './_mailer.js';
import { adminOtpEmail, adminResetEmail } from './_templates.js';
import {
  verifyPassword,
  hashPassword,
  hashToken,
  randomNumericCode,
  randomToken,
  issueSession,
  verifySession,
  readBearer,
} from './_auth.js';
import { parseBody } from './_http.js';

const OTP_TTL_MINUTES = 10;
const RESET_TTL_MINUTES = 30;
const MAX_ATTEMPTS = 5;

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(1, local.length - 2))}@${domain}`;
}

function resetBaseUrl(req: VercelRequest): string {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/+$/, '');
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  return `${proto}://${host}`;
}

function requireAuth(req: VercelRequest): boolean {
  return Boolean(verifySession(readBearer(req.headers.authorization)));
}

async function handleLogin(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });
  const body = parseBody(req);
  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password required' });

  const rows = (await sql`
    SELECT id, username, email, password_hash
      FROM admin_users
     WHERE username = ${username}
     LIMIT 1
  `) as Array<{ id: number; username: string; email: string; password_hash: string }>;

  const user = rows[0];
  const ok = user ? verifyPassword(password, user.password_hash) : false;
  if (!user || !ok) return res.status(401).json({ success: false, message: 'Invalid username or password' });

  const code = randomNumericCode(6);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60_000);
  const inserted = (await sql`
    INSERT INTO admin_otps (user_id, code_hash, expires_at)
    VALUES (${user.id}, ${hashToken(code)}, ${expiresAt.toISOString()})
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
}

async function handleVerifyOtp(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });
  const body = parseBody(req);
  const challengeId = Number(body?.challenge_id);
  const code = typeof body?.code === 'string' ? body.code.trim() : '';
  if (!challengeId || !/^\d{6}$/.test(code)) {
    return res.status(400).json({ success: false, message: 'Invalid challenge or code format' });
  }

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
  if (!otp) return res.status(400).json({ success: false, message: 'Verification challenge not found' });
  if (otp.consumed_at) return res.status(400).json({ success: false, message: 'Code already used' });
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
}

async function handleRequestReset(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });
  const body = parseBody(req);
  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  if (!username) return res.status(400).json({ success: false, message: 'Username required' });

  const rows = (await sql`
    SELECT id, email FROM admin_users WHERE username = ${username} LIMIT 1
  `) as Array<{ id: number; email: string }>;

  if (rows[0]) {
    const token = randomToken(24);
    const expiresAt = new Date(Date.now() + RESET_TTL_MINUTES * 60_000);
    await sql`
      INSERT INTO admin_reset_tokens (user_id, token_hash, expires_at)
      VALUES (${rows[0].id}, ${hashToken(token)}, ${expiresAt.toISOString()})
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
}

async function handleResetPassword(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });
  const body = parseBody(req);
  const token = typeof body?.token === 'string' ? body.token.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!token || password.length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Reset token is required and password must be at least 10 characters.',
    });
  }

  const rows = (await sql`
    SELECT id, user_id, expires_at, consumed_at
      FROM admin_reset_tokens
     WHERE token_hash = ${hashToken(token)}
     LIMIT 1
  `) as Array<{ id: number; user_id: number; expires_at: string; consumed_at: string | null }>;

  const rt = rows[0];
  if (!rt) return res.status(400).json({ success: false, message: 'Invalid or expired reset link.' });
  if (rt.consumed_at) return res.status(400).json({ success: false, message: 'This reset link was already used.' });
  if (new Date(rt.expires_at).getTime() < Date.now()) {
    return res.status(400).json({ success: false, message: 'This reset link has expired.' });
  }

  await sql`UPDATE admin_users SET password_hash = ${hashPassword(password)}, updated_at = NOW() WHERE id = ${rt.user_id}`;
  await sql`UPDATE admin_reset_tokens SET consumed_at = NOW() WHERE id = ${rt.id}`;
  await sql`UPDATE admin_otps SET consumed_at = COALESCE(consumed_at, NOW()) WHERE user_id = ${rt.user_id}`;

  return res.status(200).json({ success: true, message: 'Password updated. You can now sign in.' });
}

interface BookingRow {
  id: number;
  booking_number: string | null;
  name: string;
  email: string;
  phone: string;
  service: string;
  service_type: string;
  appointment_date: string;
  appointment_time: string;
  price: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

async function handleBookings(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req)) return res.status(401).json({ success: false, message: 'Unauthorized' });

  if (req.method === 'GET') {
    const rows = (await sql`
      SELECT id, booking_number, name, email, phone, service, service_type,
             to_char(appointment_date, 'YYYY-MM-DD') AS appointment_date,
             to_char(appointment_time, 'HH24:MI')   AS appointment_time,
             price, notes, status, created_at
        FROM bookings
       ORDER BY created_at DESC
    `) as BookingRow[];
    return res.status(200).json({ success: true, bookings: rows });
  }

  if (req.method === 'POST') {
    const body = parseBody(req) || {};
    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const phone = String(body.phone ?? '').trim();
    const service = String(body.service ?? '').trim();
    const serviceType = body.service_type === 'Mobile' ? 'Mobile' : 'In-Clinic';
    const date = String(body.appointment_date ?? '').trim();
    const time = String(body.appointment_time ?? '').trim();
    const price = String(body.price ?? '').trim();
    const notes = String(body.notes ?? '').trim();

    if (!name || !phone || !service || !date || !time) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
      return res.status(400).json({ success: false, message: 'Invalid date or time format' });
    }

    const inserted = (await sql`
      INSERT INTO bookings
        (name, email, phone, service, service_type, appointment_date, appointment_time, price, notes)
      VALUES
        (${name}, ${email || 'walkin@rdharmonymedspa.com'}, ${phone}, ${service}, ${serviceType},
         ${date}::date, ${time}::time, ${price || null}, ${notes || null})
      RETURNING id
    `) as Array<{ id: number }>;
    const id = inserted[0].id;
    const bookingNumber = generateBookingNumber(id, date);
    await sql`UPDATE bookings SET booking_number = ${bookingNumber} WHERE id = ${id}`;
    return res.status(201).json({ success: true, id, booking_number: bookingNumber });
  }

  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ success: false, message: 'Missing booking id' });

  if (req.method === 'DELETE') {
    await sql`DELETE FROM bookings WHERE id = ${id}`;
    return res.status(200).json({ success: true });
  }

  if (req.method === 'PATCH') {
    const body = parseBody(req) || {};
    const status = typeof body.status === 'string' ? body.status.trim() : '';
    if (!['confirmed', 'completed', 'cancelled', 'no_show'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    await sql`UPDATE bookings SET status = ${status} WHERE id = ${id}`;
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = String(req.query.action || '');
  try {
    await ensureSchema();
    switch (action) {
      case 'login': return handleLogin(req, res);
      case 'verify-otp': return handleVerifyOtp(req, res);
      case 'request-reset': return handleRequestReset(req, res);
      case 'reset-password': return handleResetPassword(req, res);
      case 'bookings': return handleBookings(req, res);
      default: return res.status(404).json({ success: false, message: 'Unknown admin action' });
    }
  } catch (err) {
    console.error(`admin?action=${action} error:`, err);
    return res.status(500).json({ success: false, message: 'Request failed. Please try again.' });
  }
}
