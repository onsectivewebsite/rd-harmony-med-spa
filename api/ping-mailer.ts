import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendMail } from './_lib/mailer';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ ok: true, has: typeof sendMail });
}
