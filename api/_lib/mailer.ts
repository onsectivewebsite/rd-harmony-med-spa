import { Resend } from 'resend';

let client: Resend | null = null;

function getClient(): Resend {
  if (client) return client;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set.');
  client = new Resend(key);
  return client;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const from = process.env.MAIL_FROM;
  if (!from) throw new Error('MAIL_FROM is not set.');

  const { error } = await getClient().emails.send({
    from,
    to: [opts.to],
    subject: opts.subject,
    html: opts.html,
    replyTo: opts.replyTo,
  });
  if (error) {
    throw new Error(`Resend error: ${error.message || JSON.stringify(error)}`);
  }
}
