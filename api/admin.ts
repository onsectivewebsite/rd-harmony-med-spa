import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureSchema, generateBookingNumber } from './_db.js';
import { sendMail } from './_mailer.js';
import { adminOtpEmail, adminResetEmail, consentLinkEmail, type BookingData } from './_templates.js';
import { appBaseUrl } from './_http.js';
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
import { templateForServiceName, TEMPLATES } from './_consent.js';
import { uploadBytes, fetchBlob, safeServedType, uploadPublicImage } from './_blob.js';
import type { ServiceInput } from './_content.js';

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

function getSession(req: VercelRequest) {
  return verifySession(readBearer(req.headers.authorization));
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
      SELECT b.id, b.booking_number, b.name, b.email, b.phone, b.service, b.service_type,
             to_char(b.appointment_date, 'YYYY-MM-DD') AS appointment_date,
             to_char(b.appointment_time, 'HH24:MI')   AS appointment_time,
             b.price, b.notes, b.status, b.created_at,
             c.id         AS consent_id,
             c.status     AS consent_status,
             c.file_url   AS consent_file_url,
             c.file_mime  AS consent_file_mime
        FROM bookings b
        LEFT JOIN consents c ON c.booking_id = b.id
       ORDER BY b.created_at DESC
    `) as Array<BookingRow & { consent_id: number | null; consent_status: string | null; consent_file_url: string | null; consent_file_mime: string | null }>;
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
        (${name}, ${email || 'walkin@gmail.com'}, ${phone}, ${service}, ${serviceType},
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
    const updates: Record<string, string | null> = {};

    if (typeof body.status === 'string') {
      const s = body.status.trim();
      if (!['confirmed', 'completed', 'cancelled', 'no_show'].includes(s)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }
      updates.status = s;
    }
    if (typeof body.name === 'string' && body.name.trim()) updates.name = body.name.trim();
    if (typeof body.email === 'string') updates.email = body.email.trim().toLowerCase();
    if (typeof body.phone === 'string' && body.phone.trim()) updates.phone = body.phone.trim();
    if (typeof body.service === 'string' && body.service.trim()) updates.service = body.service.trim();
    if (body.service_type === 'Mobile' || body.service_type === 'In-Clinic') {
      updates.service_type = body.service_type;
    }
    if (typeof body.appointment_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.appointment_date)) {
      updates.appointment_date = body.appointment_date;
    }
    if (typeof body.appointment_time === 'string' && /^\d{2}:\d{2}$/.test(body.appointment_time)) {
      updates.appointment_time = body.appointment_time;
    }
    if (typeof body.price === 'string') updates.price = body.price.trim() || null;
    if (typeof body.notes === 'string') updates.notes = body.notes.trim() || null;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'Nothing to update' });
    }

    for (const [col, val] of Object.entries(updates)) {
      if (col === 'appointment_date') {
        await sql`UPDATE bookings SET appointment_date = ${val}::date WHERE id = ${id}`;
      } else if (col === 'appointment_time') {
        await sql`UPDATE bookings SET appointment_time = ${val}::time WHERE id = ${id}`;
      } else if (col === 'status') {
        await sql`UPDATE bookings SET status = ${val} WHERE id = ${id}`;
      } else if (col === 'name') {
        await sql`UPDATE bookings SET name = ${val} WHERE id = ${id}`;
      } else if (col === 'email') {
        await sql`UPDATE bookings SET email = ${val} WHERE id = ${id}`;
      } else if (col === 'phone') {
        await sql`UPDATE bookings SET phone = ${val} WHERE id = ${id}`;
      } else if (col === 'service') {
        await sql`UPDATE bookings SET service = ${val} WHERE id = ${id}`;
      } else if (col === 'service_type') {
        await sql`UPDATE bookings SET service_type = ${val} WHERE id = ${id}`;
      } else if (col === 'price') {
        await sql`UPDATE bookings SET price = ${val} WHERE id = ${id}`;
      } else if (col === 'notes') {
        await sql`UPDATE bookings SET notes = ${val} WHERE id = ${id}`;
      }
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

async function handleConsents(req: VercelRequest, res: VercelResponse) {
  const session = getSession(req);
  if (!session) return res.status(401).json({ success: false, message: 'Unauthorized' });

  if (req.method === 'GET') {
    const bookingIdParam = req.query.booking_id ? Number(req.query.booking_id) : null;
    if (bookingIdParam) {
      const rows = (await sql`
        SELECT c.id, c.booking_id, c.token, c.template_id, c.status,
               c.form_data, c.file_url, c.file_mime, c.signature_url,
               c.filled_at, c.uploaded_by, c.created_at
          FROM consents c
         WHERE c.booking_id = ${bookingIdParam}
         ORDER BY c.created_at DESC
         LIMIT 1
      `) as Array<Record<string, unknown>>;
      return res.status(200).json({ success: true, consent: rows[0] || null });
    }
    const rows = (await sql`
      SELECT c.id, c.booking_id, c.template_id, c.status,
             c.file_url, c.file_mime, c.filled_at, c.uploaded_by, c.created_at,
             b.booking_number, b.name AS client_name, b.service,
             to_char(b.appointment_date, 'YYYY-MM-DD') AS appointment_date
        FROM consents c
        JOIN bookings b ON b.id = c.booking_id
       ORDER BY c.created_at DESC
    `) as Array<Record<string, unknown>>;
    return res.status(200).json({ success: true, consents: rows });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

async function handleConsentUpload(req: VercelRequest, res: VercelResponse) {
  const session = getSession(req);
  if (!session) return res.status(401).json({ success: false, message: 'Unauthorized' });
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const body = parseBody(req);
  const bookingId = Number(body?.booking_id);
  const mime = String(body?.mime || '').toLowerCase();
  const base64 = String(body?.base64 || '');
  if (!bookingId || !base64) {
    return res.status(400).json({ success: false, message: 'booking_id and base64 are required' });
  }
  if (!['application/pdf', 'image/jpeg', 'image/png'].includes(mime)) {
    return res.status(400).json({ success: false, message: 'File must be PDF, JPG, or PNG' });
  }

  const bookings = (await sql`SELECT id, service FROM bookings WHERE id = ${bookingId} LIMIT 1`) as Array<{ id: number; service: string }>;
  const booking = bookings[0];
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(Buffer.from(base64, 'base64'));
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid base64' });
  }
  if (bytes.length === 0 || bytes.length > 5_000_000) {
    return res.status(413).json({ success: false, message: 'File must be between 1 byte and 5 MB' });
  }

  const existing = (await sql`SELECT id FROM consents WHERE booking_id = ${bookingId} LIMIT 1`) as Array<{ id: number }>;
  let consentId: number;
  if (existing.length === 0) {
    const tplId = templateForServiceName(booking.service).template?.id || '';
    const token = randomToken(24);
    const inserted = (await sql`
      INSERT INTO consents (booking_id, token, template_id, status)
      VALUES (${bookingId}, ${token}, ${tplId}, 'pending')
      RETURNING id
    `) as Array<{ id: number }>;
    consentId = inserted[0].id;
  } else {
    consentId = existing[0].id;
  }

  const ext = mime === 'application/pdf' ? 'pdf' : mime === 'image/jpeg' ? 'jpg' : 'png';
  const url = await uploadBytes(
    `consents/${bookingId}/upload-${Date.now()}.${ext}`,
    bytes,
    mime,
  );

  await sql`
    UPDATE consents SET
      status = 'uploaded',
      file_url = ${url},
      file_mime = ${mime},
      uploaded_by = ${session.u},
      filled_at = NOW()
    WHERE id = ${consentId}
  `;

  return res.status(200).json({ success: true, file_url: url });
}

async function handleConsentFile(req: VercelRequest, res: VercelResponse) {
  const session = getSession(req);
  if (!session) return res.status(401).json({ success: false, message: 'Unauthorized' });
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ success: false, message: 'id is required' });

  const rows = (await sql`
    SELECT file_url, file_mime FROM consents WHERE id = ${id} LIMIT 1
  `) as Array<{ file_url: string | null; file_mime: string | null }>;
  const row = rows[0];
  if (!row || !row.file_url) return res.status(404).json({ success: false, message: 'File not found' });

  const fetched = await fetchBlob(row.file_url);
  if (!fetched) return res.status(404).json({ success: false, message: 'File not found' });

  const safe = safeServedType(row.file_mime || fetched.contentType);
  res.setHeader('Content-Type', safe.contentType);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
  res.setHeader('Content-Disposition', `${safe.inline ? 'inline' : 'attachment'}; filename="consent-file"`);
  res.setHeader('Cache-Control', 'private, no-store');
  return res.status(200).send(fetched.bytes);
}

async function handleConsentsByClient(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req)) return res.status(401).json({ success: false, message: 'Unauthorized' });
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const phone = String(req.query.phone || '').trim();
  if (!phone) return res.status(400).json({ success: false, message: 'phone is required' });

  const rows = (await sql`
    SELECT c.id, c.booking_id, c.template_id, c.status, c.form_data,
           c.file_url, c.file_mime, c.signature_url, c.filled_at, c.uploaded_by, c.created_at,
           b.booking_number, b.service,
           to_char(b.appointment_date, 'YYYY-MM-DD') AS appointment_date,
           to_char(b.appointment_time, 'HH24:MI')   AS appointment_time
      FROM consents c
      JOIN bookings b ON b.id = c.booking_id
     WHERE b.phone = ${phone}
     ORDER BY b.appointment_date DESC, b.appointment_time DESC
  `) as Array<Record<string, unknown> & { template_id: string }>;

  const enriched = rows.map(r => {
    const tpl = TEMPLATES[r.template_id];
    return {
      ...r,
      template: tpl ? { id: tpl.id, title: tpl.title, fields: tpl.fields } : null,
    };
  });

  return res.status(200).json({ success: true, consents: enriched });
}

async function handleConsentResend(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req)) return res.status(401).json({ success: false, message: 'Unauthorized' });
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const body = parseBody(req);
  const bookingId = Number(body?.booking_id);
  if (!bookingId) return res.status(400).json({ success: false, message: 'booking_id is required' });

  const bookings = (await sql`
    SELECT id, booking_number, name, email, phone, service, service_type,
           to_char(appointment_date, 'YYYY-MM-DD') AS appointment_date,
           to_char(appointment_time, 'HH24:MI')   AS appointment_time,
           price, notes
      FROM bookings WHERE id = ${bookingId} LIMIT 1
  `) as Array<BookingData & { service_type: string }>;
  const booking = bookings[0];
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  if (!booking.email || !/.+@.+\..+/.test(booking.email)) {
    return res.status(400).json({ success: false, message: 'Booking has no valid email on file.' });
  }

  const tplLookup = templateForServiceName(booking.service);
  if (!tplLookup.template) {
    return res.status(400).json({ success: false, message: 'This service does not require a consent form.' });
  }

  const existing = (await sql`
    SELECT id, token, status FROM consents WHERE booking_id = ${bookingId} LIMIT 1
  `) as Array<{ id: number; token: string; status: string }>;

  let token: string;
  if (existing[0]) {
    if (existing[0].status === 'filled' || existing[0].status === 'uploaded') {
      return res.status(409).json({ success: false, message: 'Consent has already been completed for this booking.' });
    }
    token = existing[0].token;
  } else {
    token = randomToken(24);
    await sql`
      INSERT INTO consents (booking_id, token, template_id, status)
      VALUES (${bookingId}, ${token}, ${tplLookup.template.id}, 'pending')
    `;
  }

  const consentUrl = `${appBaseUrl(req)}/consent/${token}`;
  try {
    await sendMail({
      to: booking.email,
      subject: `Action needed: complete your consent form (${booking.booking_number || `Booking #${booking.id}`})`,
      html: consentLinkEmail(booking, consentUrl),
    });
  } catch (err) {
    console.error('Consent resend email failed:', err);
    return res.status(502).json({ success: false, message: 'Could not send the email. Please check SMTP settings.' });
  }

  return res.status(200).json({ success: true, sent_to: booking.email });
}

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
async function handleImageUpload(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req)) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const body = parseBody(req);
  const filename = typeof body.filename === 'string' ? body.filename : '';
  const contentType = typeof body.contentType === 'string' ? body.contentType : '';
  const dataBase64 = typeof body.dataBase64 === 'string' ? body.dataBase64 : '';
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    return res.status(400).json({ success: false, message: 'Only JPEG, PNG, or WebP images are allowed.' });
  }
  const bytes = Buffer.from(dataBase64, 'base64');
  if (bytes.length === 0) return res.status(400).json({ success: false, message: 'Empty image.' });
  if (bytes.length > 5 * 1024 * 1024) return res.status(400).json({ success: false, message: 'Image exceeds 5 MB.' });
  const safeName = (filename || 'image').replace(/[^a-zA-Z0-9._-]/g, '_').slice(-60);
  const key = `service-images/${Date.now()}-${safeName}`;
  const url = await uploadPublicImage(key, bytes, contentType);
  return res.status(200).json({ success: true, url });
}

async function handleSeedContent(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req)) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const { seedContent } = await import('./_content.js');
  const result = await seedContent();
  return res.status(200).json({ success: true, ...result });
}

async function handleServiceList(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req)) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const { listAllServices } = await import('./_content.js');
  const services = await listAllServices();
  return res.status(200).json({ success: true, services });
}

async function handleServiceSave(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req)) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const body = (parseBody(req) || {}) as Record<string, unknown>;
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) return res.status(400).json({ success: false, message: 'name is required' });

  const { upsertService } = await import('./_content.js');
  const service = await upsertService({ ...body, name } as ServiceInput);
  return res.status(200).json({ success: true, service });
}

async function handleServiceDelete(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req)) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const body = parseBody(req) || {};
  const id = typeof body.id === 'string' ? body.id.trim() : '';
  if (!id) return res.status(400).json({ success: false, message: 'id is required' });

  const { deleteService, setServiceActive } = await import('./_content.js');
  if (body.hard === true) {
    await deleteService(id);
  } else {
    await setServiceActive(id, false);
  }
  return res.status(200).json({ success: true });
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
      case 'consents': return handleConsents(req, res);
      case 'consent-upload': return handleConsentUpload(req, res);
      case 'consent-file': return handleConsentFile(req, res);
      case 'consent-resend': return handleConsentResend(req, res);
      case 'consents-by-client': return handleConsentsByClient(req, res);
      case 'seed-content': return handleSeedContent(req, res);
      case 'image-upload': return handleImageUpload(req, res);
      case 'service-list': return handleServiceList(req, res);
      case 'service-save': return handleServiceSave(req, res);
      case 'service-delete': return handleServiceDelete(req, res);
      default: return res.status(404).json({ success: false, message: 'Unknown admin action' });
    }
  } catch (err) {
    console.error(`admin?action=${action} error:`, err);
    return res.status(500).json({ success: false, message: 'Request failed. Please try again.' });
  }
}
