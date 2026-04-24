import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureSchema, generateBookingNumber } from './_db.js';
import { sendMail } from './_mailer.js';
import {
  bookingConfirmationEmail,
  bookingNotificationEmail,
  type BookingData,
} from './_templates.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid request body' });
  }

  const { name, email, phone, service, type, date, time, price, message } = body as Record<string, unknown>;

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

    const mailResults = await Promise.allSettled([
      sendMail({
        to: emailS,
        subject: `Booking Confirmed (${bookingNumber}) - RD Harmony Med Spa`,
        html: bookingConfirmationEmail(bookingData),
      }),
      sendMail({
        to: process.env.MAIL_TO_BIZ || emailS,
        subject: `New Booking ${bookingNumber}: ${serviceS} - ${nameS}`,
        html: bookingNotificationEmail(bookingData),
        replyTo: emailS,
      }),
    ]);

    if (mailResults[0].status === 'rejected') {
      console.error('Customer confirmation email failed:', mailResults[0].reason);
    }
    if (mailResults[1].status === 'rejected') {
      console.error('Business notification email failed:', mailResults[1].reason);
    }

    return res.status(200).json({
      success: true,
      booking_id: bookingId,
      booking_number: bookingNumber,
      email_sent: mailResults[0].status === 'fulfilled',
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
