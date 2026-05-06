import { NextResponse } from 'next/server';

export function json(data, init) {
  return NextResponse.json(data, init);
}

export function errorResponse(error, status = 500) {
  return json({ message: error?.message || 'Server error.' }, { status });
}

export function unauthorized() {
  return json({ message: 'Admin login required.' }, { status: 401 });
}
