import crypto from 'node:crypto';

// Server-side Google Calendar integration. When a Google service account is
// configured, every confirmed booking is inserted as an event on the spa's
// calendar automatically. If the env vars are absent the helpers no-op so
// bookings still succeed.
//
// Setup (one time):
//  1. Google Cloud Console -> create a project -> enable "Google Calendar API".
//  2. Create a Service Account, then a JSON key for it.
//  3. In Google Calendar settings for the target calendar, "Share with specific
//     people" and add the service account email with "Make changes to events".
//  4. Set these env vars (in Vercel + local .env):
//       GOOGLE_SERVICE_ACCOUNT_EMAIL   = ...@...iam.gserviceaccount.com
//       GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\n...   (from the JSON key)
//       GOOGLE_CALENDAR_ID             = the calendar's ID (often the Gmail address)
//     Optional: GOOGLE_CALENDAR_TZ (defaults to America/Toronto).

const SCOPE = 'https://www.googleapis.com/auth/calendar.events';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

export function isCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY &&
    process.env.GOOGLE_CALENDAR_ID,
  );
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function getAccessToken(): Promise<string> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  // PEM keys stored in env usually have literal "\n" sequences; restore them.
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, '\n');
  const now = Math.floor(Date.now() / 1000);

  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(JSON.stringify({
    iss: email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }));
  const signingInput = `${header}.${claim}`;
  const signature = crypto.createSign('RSA-SHA256').update(signingInput).sign(key);
  const assertion = `${signingInput}.${base64url(signature)}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  if (!res.ok) {
    throw new Error(`Google token error ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('No access_token in Google token response');
  return data.access_token;
}

// Builds a naive local datetime string 'YYYY-MM-DDTHH:MM:SS' for the given
// wall-clock, offset by `addMinutes`. Paired with an explicit timeZone so Google
// interprets it correctly regardless of the server's timezone.
function localDateTime(date: string, time: string, addMinutes = 0): string {
  const [y, mo, d] = date.split('-').map(Number);
  const [h, mi] = time.split(':').map(Number);
  const dt = new Date(Date.UTC(y, mo - 1, d, h, mi) + addMinutes * 60000);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${dt.getUTCFullYear()}-${p(dt.getUTCMonth() + 1)}-${p(dt.getUTCDate())}T${p(dt.getUTCHours())}:${p(dt.getUTCMinutes())}:00`;
}

export interface CalendarEventInput {
  summary: string;
  description?: string;
  location?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
}

export async function createCalendarEvent(input: CalendarEventInput): Promise<string> {
  const token = await getAccessToken();
  const calendarId = process.env.GOOGLE_CALENDAR_ID!;
  const timeZone = process.env.GOOGLE_CALENDAR_TZ || 'America/Toronto';

  const event = {
    summary: input.summary,
    description: input.description,
    location: input.location,
    start: { dateTime: localDateTime(input.date, input.time), timeZone },
    end: { dateTime: localDateTime(input.date, input.time, input.durationMinutes), timeZone },
    reminders: { useDefault: true },
  };

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    },
  );
  if (!res.ok) {
    throw new Error(`Google Calendar insert error ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { id?: string };
  return data.id || '';
}
