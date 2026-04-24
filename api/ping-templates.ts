import type { VercelRequest, VercelResponse } from '@vercel/node';
import { bookingConfirmationEmail } from './_lib/templates';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ ok: true, has: typeof bookingConfirmationEmail });
}
