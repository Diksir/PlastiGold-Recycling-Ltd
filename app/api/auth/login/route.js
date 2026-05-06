import { createSession } from '@/lib/auth';
import { json } from '@/lib/responses';

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim();
  const password = String(body.password || '').trim();
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@plastigoldrecycling.com').trim();
  const adminPassword = (process.env.ADMIN_PASSWORD || 'admin123').trim();

  if (email !== adminEmail || password !== adminPassword) {
    return json({ message: 'Invalid email or password.' }, { status: 401 });
  }

  return json({ token: createSession(email), email });
}
