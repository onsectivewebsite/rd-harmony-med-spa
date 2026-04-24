import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomNumericCode } from './_lib/auth';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ ok: true, sample: randomNumericCode(6) });
}
