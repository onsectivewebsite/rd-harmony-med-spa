import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendMail } from './_mailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const expected = process.env.CRON_SECRET;
  const token = req.headers.authorization?.replace(/^Bearer\s+/, '') || String(req.query.token || '');
  if (!expected || token !== expected) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const to = String(req.query.to || process.env.MAIL_TO_BIZ || '');
  if (!to) {
    return res.status(400).json({ success: false, message: 'No recipient (set MAIL_TO_BIZ or pass ?to=)' });
  }

  try {
    await sendMail({
      to,
      subject: 'SMTP Test - RD Harmony Booking System',
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:500px;padding:24px;background:#f9fafb;">
          <h2 style="color:#10b981;margin:0 0 12px;">SMTP is working</h2>
          <p>If you received this, your booking system can now send confirmations, notifications, and reminder emails.</p>
          <ul style="color:#374151;font-size:14px;">
            <li><b>Host:</b> ${process.env.SMTP_HOST}</li>
            <li><b>Port:</b> ${process.env.SMTP_PORT}</li>
            <li><b>From:</b> ${process.env.MAIL_FROM}</li>
            <li><b>Sent:</b> ${new Date().toISOString()}</li>
          </ul>
          <p style="color:#6b7280;font-size:12px;">&mdash; Automated test from your Vercel deployment</p>
        </div>
      `,
    });
    return res.status(200).json({ success: true, message: `Test email sent to ${to}` });
  } catch (err) {
    console.error('SMTP test failed:', err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }
}
