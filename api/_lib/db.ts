import { neon } from '@neondatabase/serverless';

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
    })().catch(err => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}
