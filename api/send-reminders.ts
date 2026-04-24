import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureSchema } from './_db.js';
import { sendMail } from './_mailer.js';
import { reminderEmail, type BookingData } from './_templates.js';

type ReminderKey = '30d' | '7d' | '1d';
type BookingRow = BookingData & { id: number };

function torontoDateOffset(days: number): string {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const target = new Date(Date.now() + days * 86_400_000);
  return fmt.format(target); // YYYY-MM-DD
}

async function fetchDue(key: ReminderKey, date: string): Promise<BookingRow[]> {
  if (key === '30d') {
    return (await sql`
      SELECT id, name, email, phone, service, service_type,
             to_char(appointment_date, 'YYYY-MM-DD') AS appointment_date,
             to_char(appointment_time, 'HH24:MI')   AS appointment_time,
             price, notes
        FROM bookings
       WHERE appointment_date = ${date}::date
         AND status = 'confirmed'
         AND reminder_30d_sent_at IS NULL
    `) as BookingRow[];
  }
  if (key === '7d') {
    return (await sql`
      SELECT id, name, email, phone, service, service_type,
             to_char(appointment_date, 'YYYY-MM-DD') AS appointment_date,
             to_char(appointment_time, 'HH24:MI')   AS appointment_time,
             price, notes
        FROM bookings
       WHERE appointment_date = ${date}::date
         AND status = 'confirmed'
         AND reminder_7d_sent_at IS NULL
    `) as BookingRow[];
  }
  return (await sql`
    SELECT id, name, email, phone, service, service_type,
           to_char(appointment_date, 'YYYY-MM-DD') AS appointment_date,
           to_char(appointment_time, 'HH24:MI')   AS appointment_time,
           price, notes
      FROM bookings
     WHERE appointment_date = ${date}::date
       AND status = 'confirmed'
       AND reminder_1d_sent_at IS NULL
  `) as BookingRow[];
}

async function markSent(key: ReminderKey, id: number): Promise<void> {
  if (key === '30d') {
    await sql`UPDATE bookings SET reminder_30d_sent_at = NOW() WHERE id = ${id}`;
    return;
  }
  if (key === '7d') {
    await sql`UPDATE bookings SET reminder_7d_sent_at = NOW() WHERE id = ${id}`;
    return;
  }
  await sql`UPDATE bookings SET reminder_1d_sent_at = NOW() WHERE id = ${id}`;
}

function subjectFor(key: ReminderKey): string {
  switch (key) {
    case '30d': return 'Appointment Reminder: 1 Month Away - RD Harmony Med Spa';
    case '7d':  return 'Appointment Reminder: 1 Week Away - RD Harmony Med Spa';
    case '1d':  return 'Appointment Reminder: Tomorrow - RD Harmony Med Spa';
  }
}

const WINDOWS: Array<{ days: number; key: ReminderKey }> = [
  { days: 30, key: '30d' },
  { days: 7,  key: '7d' },
  { days: 1,  key: '1d' },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const expected = process.env.CRON_SECRET;
  if (expected && req.headers.authorization !== `Bearer ${expected}`) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    await ensureSchema();

    const results: Array<{ id: number; window: ReminderKey; ok: boolean; error?: string }> = [];

    for (const w of WINDOWS) {
      const targetDate = torontoDateOffset(w.days);
      const due = await fetchDue(w.key, targetDate);

      for (const booking of due) {
        try {
          await sendMail({
            to: booking.email,
            subject: subjectFor(w.key),
            html: reminderEmail(booking, w.key),
          });
          await markSent(w.key, booking.id);
          results.push({ id: booking.id, window: w.key, ok: true });
        } catch (err) {
          console.error(`Reminder failed for booking ${booking.id} (${w.key}):`, err);
          results.push({
            id: booking.id,
            window: w.key,
            ok: false,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
    }

    return res.status(200).json({ success: true, processed: results.length, results });
  } catch (err) {
    console.error('send-reminders error:', err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}
