import { json } from '@/lib/responses';

export function GET() {
  return json({ ok: true, service: 'PlastiGold Next.js API' });
}
