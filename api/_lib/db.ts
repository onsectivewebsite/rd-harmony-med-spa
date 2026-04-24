import { neon } from '@neondatabase/serverless';
import { hashPassword } from './auth';

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  '';

if (!connectionString) {
  console.warn('No Postgres connection string set (POSTGRES_URL / DATABASE_URL).');
}

export const sql = neon(connectionString);

let schemaReady: Promise<void> | null = null;

export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS bookings (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          service TEXT NOT NULL,
          service_type TEXT NOT NULL DEFAULT 'In-Clinic',
          appointment_date DATE NOT NULL,
          appointment_time TIME NOT NULL,
          price TEXT,
          notes TEXT,
          status TEXT NOT NULL DEFAULT 'confirmed',
          reminder_30d_sent_at TIMESTAMPTZ,
          reminder_7d_sent_at TIMESTAMPTZ,
          reminder_1d_sent_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS bookings_appointment_date_idx ON bookings(appointment_date)`;
      await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_number TEXT`;
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS bookings_booking_number_idx ON bookings(booking_number) WHERE booking_number IS NOT NULL`;

      await sql`
        CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS admin_otps (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
          code_hash TEXT NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          consumed_at TIMESTAMPTZ,
          attempts INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS admin_reset_tokens (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
          token_hash TEXT NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          consumed_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      const username = process.env.ADMIN_USERNAME || 'admin';
      const email = process.env.ADMIN_EMAIL || process.env.MAIL_TO_BIZ || '';
      const existing = (await sql`SELECT id FROM admin_users WHERE username = ${username} LIMIT 1`) as Array<{ id: number }>;
      if (existing.length === 0 && email) {
        const initial = process.env.ADMIN_INITIAL_PASSWORD || 'ChangeMe!123';
        await sql`
          INSERT INTO admin_users (username, email, password_hash)
          VALUES (${username}, ${email}, ${hashPassword(initial)})
        `;
      }
    })().catch(err => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

export function generateBookingNumber(id: number, dateYmd: string): string {
  const compact = dateYmd.replace(/-/g, '');
  return `RDH-${compact}-${String(id).padStart(4, '0')}`;
}
