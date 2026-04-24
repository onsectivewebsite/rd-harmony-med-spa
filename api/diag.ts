import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as templates from './_templates.js';
import * as mailer from './_mailer.js';
import * as http from './_http.js';
import * as auth from './_auth.js';
import * as db from './_db.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    node: process.version,
    env: {
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      SMTP_HOST: process.env.SMTP_HOST || null,
      SMTP_USER: !!process.env.SMTP_USER,
      SMTP_PASS: !!process.env.SMTP_PASS,
      MAIL_FROM: !!process.env.MAIL_FROM,
      MAIL_TO_BIZ: !!process.env.MAIL_TO_BIZ,
      ADMIN_SECRET: !!process.env.ADMIN_SECRET,
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
      ADMIN_USERNAME: process.env.ADMIN_USERNAME || null,
      APP_URL: process.env.APP_URL || null,
    },
    modules: {
      templates: Object.keys(templates).slice(0, 3),
      mailer: Object.keys(mailer).slice(0, 3),
      http: Object.keys(http).slice(0, 3),
      auth: Object.keys(auth).slice(0, 3),
      db: Object.keys(db).slice(0, 3),
    },
  });
}
