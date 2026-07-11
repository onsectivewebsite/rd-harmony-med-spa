import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureSchema, generateBookingNumber } from './_db.js';
import { sendMail } from './_mailer.js';
import {
  bookingConfirmationEmail,
  bookingNotificationEmail,
  type BookingData,
} from './_templates.js';
import { templateForServiceName } from './_consent.js';
import { randomToken } from './_auth.js';
import { appBaseUrl } from './_http.js';
import { isCalendarConfigured, createCalendarEvent } from './_calendar.js';

const BIZ_ADDRESS = '78 Jones St, Oakville, ON L6L 6C5';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid request body' });
  }

  const { name, email, phone, service, type, date, time, price, message, durationMinutes } = body as Record<string, unknown>;

  for (const [k, v] of Object.entries({ name, email, phone, service, date, time })) {
    if (typeof v !== 'string' || !v.trim()) {
      return res.status(400).json({ success: false, message: `Missing required field: ${k}` });
    }
  }

  const nameS = (name as string).trim();
  const emailS = (email as string).trim().toLowerCase();
  const phoneS = (phone as string).trim();
  const serviceS = (service as string).trim();
  const dateS = (date as string).trim();
  const timeS = (time as string).trim();
  const priceS = typeof price === 'string' ? price.trim() : '';
  const notesS = typeof message === 'string' ? message.trim() : '';
  const serviceType = type === 'Mobile' ? 'Mobile' : 'In-Clinic';
  const durMin = Number(durationMinutes);
  const eventDuration = Number.isFinite(durMin) && durMin > 0 ? Math.min(durMin, 8 * 60) : 60;

  if (!EMAIL_RE.test(emailS)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateS)) {
    return res.status(400).json({ success: false, message: 'Invalid date format' });
  }
  if (!/^\d{2}:\d{2}$/.test(timeS)) {
    return res.status(400).json({ success: false, message: 'Invalid time format' });
  }

  try {
    await ensureSchema();

    const conflict = (await sql`
      SELECT 1 FROM bookings
      WHERE appointment_date = ${dateS}::date
        AND appointment_time = ${timeS}::time
        AND status = 'confirmed'
      LIMIT 1
    `) as Array<unknown>;
    if (conflict.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked. Please choose a different time.',
      });
    }

    const inserted = (await sql`
      INSERT INTO bookings
        (name, email, phone, service, service_type, appointment_date, appointment_time, price, notes)
      VALUES
        (${nameS}, ${emailS}, ${phoneS}, ${serviceS}, ${serviceType},
         ${dateS}::date, ${timeS}::time, ${priceS || null}, ${notesS || null})
      RETURNING id
    `) as Array<{ id: number }>;
    const bookingId = inserted[0].id;
    const bookingNumber = generateBookingNumber(bookingId, dateS);
    await sql`UPDATE bookings SET booking_number = ${bookingNumber} WHERE id = ${bookingId}`;

    const bookingData: BookingData = {
      id: bookingId,
      booking_number: bookingNumber,
      name: nameS,
      email: emailS,
      phone: phoneS,
      service: serviceS,
      service_type: serviceType,
      appointment_date: dateS,
      appointment_time: timeS,
      price: priceS,
      notes: notesS,
    };

    let consentUrl: string | undefined;
    const tplLookup = templateForServiceName(serviceS);
    if (tplLookup.template) {
      const consentToken = randomToken(24);
      await sql`
        INSERT INTO consents (booking_id, token, template_id, status)
        VALUES (${bookingId}, ${consentToken}, ${tplLookup.template.id}, 'pending')
      `;
      consentUrl = `${appBaseUrl(req)}/consent/${consentToken}`;
    }

    // Hardcoded so a stale MAIL_TO_BIZ env var can't redirect mail to an old inbox.
    const bizInbox = 'rdharmonymedspa@gmail.com';
    const bccBiz = bizInbox.toLowerCase() !== emailS ? bizInbox : undefined;

    const calendarTask: Promise<string | null> = isCalendarConfigured()
      ? createCalendarEvent({
          summary: `${serviceS} — ${nameS}`,
          description:
            `Booking #${bookingNumber}\n` +
            `Client: ${nameS}\n` +
            `Phone: ${phoneS}\n` +
            `Email: ${emailS}\n` +
            `Type: ${serviceType}\n` +
            `Price: ${priceS || 'N/A'}` +
            (notesS ? `\nNotes: ${notesS}` : ''),
          location: serviceType === 'Mobile' ? (notesS || 'Mobile service') : BIZ_ADDRESS,
          date: dateS,
          time: timeS,
          durationMinutes: eventDuration,
        })
      : Promise.resolve(null);

    const [mailResults, calendarResult] = await Promise.all([
      Promise.allSettled([
        sendMail({
          to: emailS,
          bcc: bccBiz,
          subject: `Booking Confirmed (${bookingNumber}) - RD Harmony Med Spa`,
          html: bookingConfirmationEmail(bookingData, consentUrl),
        }),
        sendMail({
          to: bizInbox,
          subject: `New Booking ${bookingNumber}: ${serviceS} - ${nameS}`,
          html: bookingNotificationEmail(bookingData),
          replyTo: emailS,
        }),
      ]),
      calendarTask.then(
        (): { ok: boolean; error: string | null } => ({ ok: true, error: null }),
        (err: unknown): { ok: boolean; error: string | null } => ({
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        }),
      ),
    ]);

    if (!calendarResult.ok) console.error('Google Calendar event failed:', calendarResult.error);

    const customerErr =
      mailResults[0].status === 'rejected'
        ? mailResults[0].reason instanceof Error
          ? mailResults[0].reason.message
          : String(mailResults[0].reason)
        : null;
    const bizErr =
      mailResults[1].status === 'rejected'
        ? mailResults[1].reason instanceof Error
          ? mailResults[1].reason.message
          : String(mailResults[1].reason)
        : null;

    if (customerErr) console.error('Customer confirmation email failed:', customerErr);
    if (bizErr) console.error('Business notification email failed:', bizErr);

    return res.status(200).json({
      success: true,
      booking_id: bookingId,
      booking_number: bookingNumber,
      email_sent: mailResults[0].status === 'fulfilled',
      email_error: customerErr || bizErr || undefined,
      calendar_added: isCalendarConfigured() && calendarResult.ok,
      message: 'Appointment booked successfully.',
    });
  } catch (err) {
    console.error('Booking error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to save booking. Please try again.',
    });
  }
}

function safeParse(s: string): unknown {
  try { return JSON.parse(s); } catch { return null; }
}
