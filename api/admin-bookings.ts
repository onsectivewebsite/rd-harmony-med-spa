import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureSchema, generateBookingNumber } from './_lib/db';
import { readBearer, verifySession } from './_lib/auth';
import { parseBody } from './_lib/http';

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

function requireAuth(req: VercelRequest): boolean {
  return Boolean(verifySession(readBearer(req.headers.authorization)));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    await ensureSchema();

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
    if (!id) {
      return res.status(400).json({ success: false, message: 'Missing booking id' });
    }

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
  } catch (err) {
    console.error('admin/bookings error:', err);
    return res.status(500).json({ success: false, message: 'Request failed. Please try again.' });
  }
}
