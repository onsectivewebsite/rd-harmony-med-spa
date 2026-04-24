const BIZ_NAME = 'RD Harmony Med Spa';
const BIZ_PHONE = '(647) 819-1892';
const BIZ_ADDRESS = '78 Jones St, Oakville, ON L6L 6C5';
const BIZ_EMAIL = 'info@rdharmonymedspa.com';
const BIZ_WEBSITE = 'https://rdharmonymedspa.com';

export interface BookingData {
  id?: number;
  booking_number?: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  service_type: string;
  appointment_date: string;
  appointment_time: string;
  price?: string;
  notes?: string;
}

export interface EnquiryData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

function esc(s: string): string {
  return String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!
  ));
}

function formatDate(input: string | Date): string {
  const d = input instanceof Date ? input : new Date(`${input}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Toronto',
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }).format(d);
}

function formatTime(t: string): string {
  const [hStr, mStr = '00'] = t.split(':');
  const h = Number(hStr);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${mStr.padStart(2, '0')} ${period}`;
}

function layout(heading: string, body: string, accent = '#10b981'): string {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${esc(heading)}</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;">
<tr><td align="center" style="padding:40px 20px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
<tr><td style="height:4px;background:${accent};"></td></tr>
<tr><td style="padding:40px;">
<h1 style="margin:0 0 20px;font-size:24px;color:#111827;font-weight:700;">${esc(heading)}</h1>
${body}
</td></tr>
<tr><td style="padding:24px 40px;background:#f9fafb;border-top:1px solid #f3f4f6;font-size:12px;color:#6b7280;text-align:center;line-height:1.6;">
<strong>${esc(BIZ_NAME)}</strong><br>
${esc(BIZ_ADDRESS)}<br>
${esc(BIZ_PHONE)} &bull; <a href="mailto:${esc(BIZ_EMAIL)}" style="color:#6b7280;">${esc(BIZ_EMAIL)}</a><br>
<a href="${esc(BIZ_WEBSITE)}" style="color:#6b7280;">${esc(BIZ_WEBSITE)}</a>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function detailsTable(rows: Array<[string, string]>): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;background:#f9fafb;border-radius:8px;overflow:hidden;">
${rows.map(([k, v]) => `<tr>
<td style="padding:12px 16px;border-bottom:1px solid #f3f4f6;font-size:14px;color:#6b7280;width:140px;">${esc(k)}</td>
<td style="padding:12px 16px;border-bottom:1px solid #f3f4f6;font-size:14px;color:#111827;font-weight:600;">${esc(v)}</td>
</tr>`).join('')}
</table>`;
}

export function bookingConfirmationEmail(b: BookingData): string {
  const rows: Array<[string, string]> = [];
  if (b.booking_number) rows.push(['Booking #', b.booking_number]);
  rows.push(
    ['Service', b.service],
    ['Type', b.service_type],
    ['Date', formatDate(b.appointment_date)],
    ['Time', formatTime(b.appointment_time)],
    ['Price', b.price || 'To be confirmed'],
  );
  return layout('Booking Confirmed', `
<p style="margin:0 0 12px;font-size:16px;color:#111827;">Hi ${esc(b.name)},</p>
<p style="margin:0 0 12px;font-size:15px;color:#374151;line-height:1.6;">
Thank you for booking with <strong>${esc(BIZ_NAME)}</strong>. Your appointment has been confirmed &mdash; we look forward to seeing you!
</p>
${b.booking_number ? `<p style="margin:0 0 12px;font-size:14px;color:#374151;">Please keep your booking number for reference: <strong>${esc(b.booking_number)}</strong>.</p>` : ''}
${detailsTable(rows)}
<p style="margin:16px 0 0;font-size:13px;color:#6b7280;line-height:1.6;">
Need to reschedule or cancel? Please call us at <strong>${esc(BIZ_PHONE)}</strong> at least 24 hours before your appointment.
</p>
  `);
}

export function bookingNotificationEmail(b: BookingData): string {
  const rows: Array<[string, string]> = [];
  if (b.booking_number) rows.push(['Booking #', b.booking_number]);
  rows.push(
    ['Name', b.name],
    ['Email', b.email],
    ['Phone', b.phone],
    ['Service', b.service],
    ['Type', b.service_type],
    ['Date', formatDate(b.appointment_date)],
    ['Time', formatTime(b.appointment_time)],
    ['Price', b.price || '(not set)'],
    ['Notes', b.notes || '(none)'],
  );
  return layout('New Booking Received', `
<p style="margin:0 0 12px;font-size:15px;color:#374151;">A new booking has just come through the website:</p>
${detailsTable(rows)}
  `, '#8B5CF6');
}

export function enquiryConfirmationEmail(e: EnquiryData): string {
  return layout('We got your message', `
<p style="margin:0 0 12px;font-size:16px;color:#111827;">Hi ${esc(e.name)},</p>
<p style="margin:0 0 12px;font-size:15px;color:#374151;line-height:1.6;">
Thanks for reaching out to <strong>${esc(BIZ_NAME)}</strong>. We have received your message and will get back to you within one business day.
</p>
<p style="margin:16px 0 8px;font-size:14px;color:#6b7280;">Your message:</p>
<div style="padding:16px;background:#f9fafb;border-radius:8px;font-size:14px;color:#374151;line-height:1.6;white-space:pre-wrap;">${esc(e.message)}</div>
<p style="margin:16px 0 0;font-size:13px;color:#6b7280;">
If it&rsquo;s urgent, please call us at <strong>${esc(BIZ_PHONE)}</strong>.
</p>
  `);
}

export function enquiryNotificationEmail(e: EnquiryData): string {
  return layout('New Enquiry Received', `
${detailsTable([
  ['Name', e.name],
  ['Email', e.email],
  ['Phone', e.phone || '(not provided)'],
])}
<p style="margin:16px 0 8px;font-size:14px;color:#6b7280;">Message:</p>
<div style="padding:16px;background:#f9fafb;border-radius:8px;font-size:14px;color:#374151;line-height:1.6;white-space:pre-wrap;">${esc(e.message)}</div>
  `, '#8B5CF6');
}

export function adminOtpEmail(code: string, ttlMinutes: number): string {
  return layout('Your Admin Login Code', `
<p style="margin:0 0 12px;font-size:15px;color:#374151;line-height:1.6;">
Use the code below to complete your sign-in to the <strong>${esc(BIZ_NAME)}</strong> admin portal.
</p>
<div style="margin:24px 0;padding:20px;background:#f9fafb;border-radius:12px;text-align:center;font-family:'SFMono-Regular',Consolas,monospace;font-size:32px;letter-spacing:8px;font-weight:700;color:#111827;">
${esc(code)}
</div>
<p style="margin:16px 0 0;font-size:13px;color:#6b7280;line-height:1.6;">
This code expires in ${ttlMinutes} minutes. If you did not attempt to sign in, you can safely ignore this email &mdash; but consider rotating your password.
</p>
  `, '#2563eb');
}

export function adminResetEmail(resetUrl: string, ttlMinutes: number): string {
  return layout('Reset Your Admin Password', `
<p style="margin:0 0 12px;font-size:15px;color:#374151;line-height:1.6;">
We received a request to reset the password on your <strong>${esc(BIZ_NAME)}</strong> admin account.
</p>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
Click the button below to choose a new password. This link is valid for ${ttlMinutes} minutes.
</p>
<p style="text-align:center;margin:24px 0;">
<a href="${esc(resetUrl)}" style="display:inline-block;padding:14px 28px;background:#10b981;color:#ffffff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Reset Password</a>
</p>
<p style="margin:0 0 12px;font-size:12px;color:#6b7280;line-height:1.6;word-break:break-all;">
Or paste this link into your browser: <br>${esc(resetUrl)}
</p>
<p style="margin:16px 0 0;font-size:12px;color:#6b7280;line-height:1.6;">
If you did not request a reset, you can ignore this email and your password will remain unchanged.
</p>
  `, '#10b981');
}

export function reminderEmail(b: BookingData, window: '30d' | '7d' | '1d'): string {
  const labels = { '30d': 'in 1 month', '7d': 'in 1 week', '1d': 'tomorrow' } as const;
  const accents = { '30d': '#6366f1', '7d': '#f59e0b', '1d': '#ef4444' } as const;
  const rows: Array<[string, string]> = [];
  if (b.booking_number) rows.push(['Booking #', b.booking_number]);
  rows.push(
    ['Service', b.service],
    ['Date', formatDate(b.appointment_date)],
    ['Time', formatTime(b.appointment_time)],
    ['Location', b.service_type === 'Mobile' ? 'Mobile Service (we come to you)' : BIZ_ADDRESS],
  );
  return layout(`Your appointment is ${labels[window]}`, `
<p style="margin:0 0 12px;font-size:16px;color:#111827;">Hi ${esc(b.name)},</p>
<p style="margin:0 0 12px;font-size:15px;color:#374151;line-height:1.6;">
A friendly reminder that your appointment at <strong>${esc(BIZ_NAME)}</strong> is <strong>${labels[window]}</strong>.
</p>
${detailsTable(rows)}
<p style="margin:16px 0 0;font-size:13px;color:#6b7280;line-height:1.6;">
Need to reschedule? Call us at <strong>${esc(BIZ_PHONE)}</strong>.
</p>
  `, accents[window]);
}
