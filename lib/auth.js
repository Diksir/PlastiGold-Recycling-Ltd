import crypto from 'node:crypto';

const revokedTokens = globalThis.__plastigoldRevokedTokens || new Set();
globalThis.__plastigoldRevokedTokens = revokedTokens;

function signingSecret() {
  return process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || 'plastigold-local-dev-secret';
}

function sign(value) {
  return crypto.createHmac('sha256', signingSecret()).update(value).digest('base64url');
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function createSession(email) {
  const payload = Buffer.from(JSON.stringify({
    email,
    expiresAt: Date.now() + 1000 * 60 * 60 * 8,
  })).toString('base64url');

  return `${payload}.${sign(payload)}`;
}

export function deleteSession(token) {
  if (token) revokedTokens.add(token);
}

export function requireAdmin(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token || revokedTokens.has(token)) return null;

  const [payload, signature] = token.split('.');
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!session.email || session.expiresAt < Date.now()) {
      revokedTokens.add(token);
      return null;
    }
    return { token, session };
  } catch {
    return null;
  }
}
