import { deleteSession, requireAdmin } from '@/lib/auth';
import { json, unauthorized } from '@/lib/responses';

export function POST(request) {
  const admin = requireAdmin(request);
  if (!admin) return unauthorized();
  deleteSession(admin.token);
  return json({ ok: true });
}
