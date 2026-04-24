import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateBookingNumber } from './_lib/db';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ ok: true, sample: generateBookingNumber(1, '2026-04-24') });
}
