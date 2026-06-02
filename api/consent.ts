import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureSchema } from './_db.js';
import { TEMPLATES, templateForServiceName, type ConsentTemplate } from './_consent.js';
import { decodeDataUrl, uploadBytes, fetchBlob } from './_blob.js';
import { buildConsentPdf } from './_pdf.js';
import { parseBody } from './_http.js';

interface ConsentRow {
  id: number;
  booking_id: number;
  token: string;
  template_id: string;
  status: string;
  form_data: Record<string, unknown> | null;
  signature_url: string | null;
  file_url: string | null;
  file_mime: string | null;
  filled_at: string | null;
}

interface BookingRow {
  id: number;
  booking_number: string | null;
  name: string;
  email: string;
  phone: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
}

function clientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string') return fwd.split(',')[0].trim();
  if (Array.isArray(fwd)) return fwd[0];
  return (req.socket as unknown as { remoteAddress?: string })?.remoteAddress || '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureSchema();
    const token = String(req.query.token || '').trim();
    if (!token || !/^[a-f0-9]{32,}$/.test(token)) {
      return res.status(400).json({ success: false, message: 'Invalid consent token' });
    }

    const consents = (await sql`
      SELECT id, booking_id, token, template_id, status, form_data,
             signature_url, file_url, file_mime, filled_at
        FROM consents WHERE token = ${token} LIMIT 1
    `) as ConsentRow[];
    const consent = consents[0];
    if (!consent) {
      return res.status(404).json({ success: false, message: 'Consent link not found or expired' });
    }

    // Stream the completed consent file (private blob) to the form owner. The
    // valid consent token is the authorization here.
    if (req.method === 'GET' && (req.query.file === '1' || req.query.file === 'true')) {
      if (!consent.file_url) {
        return res.status(404).json({ success: false, message: 'No file is attached to this consent yet' });
      }
      const fetched = await fetchBlob(consent.file_url);
      if (!fetched) {
        return res.status(404).json({ success: false, message: 'File not found' });
      }
      res.setHeader('Content-Type', consent.file_mime || fetched.contentType);
      res.setHeader('Content-Disposition', 'inline; filename="consent-form.pdf"');
      res.setHeader('Cache-Control', 'private, no-store');
      return res.status(200).send(fetched.bytes);
    }

    const bookings = (await sql`
      SELECT id, booking_number, name, email, phone, service,
             to_char(appointment_date, 'YYYY-MM-DD') AS appointment_date,
             to_char(appointment_time, 'HH24:MI')   AS appointment_time
        FROM bookings WHERE id = ${consent.booking_id} LIMIT 1
    `) as BookingRow[];
    const booking = bookings[0];
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking no longer exists' });
    }

    const template: ConsentTemplate | null =
      TEMPLATES[consent.template_id] || templateForServiceName(booking.service).template;

    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        booking: {
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          service: booking.service,
          booking_number: booking.booking_number,
          appointment_date: booking.appointment_date,
          appointment_time: booking.appointment_time,
        },
        template,
        status: consent.status,
        file_url: consent.file_url,
      });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    if (consent.status !== 'pending') {
      return res.status(409).json({ success: false, message: 'This consent form has already been completed.' });
    }
    if (!template) {
      return res.status(400).json({ success: false, message: 'No consent template configured for this service.' });
    }

    const body = parseBody(req);
    const answers = (body?.answers && typeof body.answers === 'object') ? body.answers as Record<string, unknown> : null;
    const signatureDataUrl = typeof body?.signature === 'string' ? body.signature : '';
    if (!answers) {
      return res.status(400).json({ success: false, message: 'Missing form answers' });
    }
    if (!signatureDataUrl.startsWith('data:image/png;base64,')) {
      return res.status(400).json({ success: false, message: 'Signature is required' });
    }

    for (const f of template.fields) {
      if (f.type === 'note') continue;
      if (f.type === 'checklist') continue;
      if (!f.required) continue;
      const v = answers[f.key];
      if (v == null || (typeof v === 'string' && !v.trim())) {
        return res.status(400).json({ success: false, message: `Missing required field: ${f.label}` });
      }
    }

    const sig = decodeDataUrl(signatureDataUrl);
    if (!sig || sig.mime !== 'image/png') {
      return res.status(400).json({ success: false, message: 'Invalid signature image' });
    }
    if (sig.bytes.length > 2_000_000) {
      return res.status(413).json({ success: false, message: 'Signature image too large' });
    }

    const filledAt = new Date();
    const sigUrl = await uploadBytes(
      `consents/${booking.id}/signature-${Date.now()}.png`,
      sig.bytes,
      'image/png',
    );

    const pdfBytes = await buildConsentPdf({
      template,
      bookingNumber: booking.booking_number || `RDH-${booking.id}`,
      serviceName: booking.service,
      appointmentDate: booking.appointment_date,
      appointmentTime: booking.appointment_time,
      answers,
      signaturePngBytes: sig.bytes,
      filledAt,
    });

    const pdfUrl = await uploadBytes(
      `consents/${booking.id}/consent-${Date.now()}.pdf`,
      pdfBytes,
      'application/pdf',
    );

    await sql`
      UPDATE consents SET
        status = 'filled',
        form_data = ${JSON.stringify(answers)}::jsonb,
        signature_url = ${sigUrl},
        file_url = ${pdfUrl},
        file_mime = 'application/pdf',
        filled_at = ${filledAt.toISOString()},
        filled_ip = ${clientIp(req)}
      WHERE id = ${consent.id}
    `;

    return res.status(200).json({ success: true, file_url: pdfUrl });
  } catch (err) {
    console.error('Consent endpoint error:', err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Consent request failed',
    });
  }
}
