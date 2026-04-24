import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendMail } from './_mailer.js';
import {
  enquiryConfirmationEmail,
  enquiryNotificationEmail,
  type EnquiryData,
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

  const { name, email, phone, message } = body as Record<string, unknown>;
  for (const [k, v] of Object.entries({ name, email, message })) {
    if (typeof v !== 'string' || !v.trim()) {
      return res.status(400).json({ success: false, message: `Missing required field: ${k}` });
    }
  }

  const enquiry: EnquiryData = {
    name: (name as string).trim(),
    email: (email as string).trim().toLowerCase(),
    phone: typeof phone === 'string' ? phone.trim() : '',
    message: (message as string).trim(),
  };

  if (!EMAIL_RE.test(enquiry.email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  try {
    const results = await Promise.allSettled([
      sendMail({
        to: enquiry.email,
        subject: 'Thanks for reaching out - RD Harmony Med Spa',
        html: enquiryConfirmationEmail(enquiry),
      }),
      sendMail({
        to: process.env.MAIL_TO_BIZ || enquiry.email,
        subject: `New Enquiry from ${enquiry.name}`,
        html: enquiryNotificationEmail(enquiry),
        replyTo: enquiry.email,
      }),
    ]);

    if (results[0].status === 'rejected') {
      console.error('Enquiry customer email failed:', results[0].reason);
    }
    if (results[1].status === 'rejected') {
      console.error('Enquiry business email failed:', results[1].reason);
    }

    if (results[1].status === 'rejected' && results[0].status === 'rejected') {
      return res.status(502).json({ success: false, message: 'Failed to send. Please try again later.' });
    }

    return res.status(200).json({ success: true, message: 'Message sent.' });
  } catch (err) {
    console.error('Enquiry error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send. Please try again later.' });
  }
}

function safeParse(s: string): unknown {
  try { return JSON.parse(s); } catch { return null; }
}
