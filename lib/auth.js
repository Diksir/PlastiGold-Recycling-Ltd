import crypto from 'node:crypto';

const sessions = globalThis.__plastigoldSessions || new Map();
globalThis.__plastigoldSessions = sessions;

export function createSession(email) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, {
    email,
    expiresAt: Date.now() + 1000 * 60 * 60 * 8,
  });
  return token;
}

export function deleteSession(token) {
  if (token) sessions.delete(token);
}

export function requireAdmin(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  const session = token ? sessions.get(token) : null;

  if (!session || session.expiresAt < Date.now()) {
    if (token) sessions.delete(token);
    return null;
  }

  return { token, session };
}
