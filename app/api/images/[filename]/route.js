import fs from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { readUploadedFile, uploadsDir } from '@/lib/content';
import { errorResponse, json, unauthorized } from '@/lib/responses';

const contentTypes = {
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

export async function GET(_request, { params }) {
  try {
    const { filename: rawFilename } = await params;
    const filename = path.basename(rawFilename);
    const file = await readUploadedFile(filename);
    return new NextResponse(file, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Type': contentTypes[path.extname(filename).toLowerCase()] || 'application/octet-stream',
      },
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return json({ message: 'Image not found.' }, { status: 404 });
    }
    return errorResponse(error);
  }
}

export async function DELETE(request, { params }) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const { filename: rawFilename } = await params;
    const filename = path.basename(rawFilename);
    await fs.unlink(path.join(uploadsDir, filename));
    return json({ deleted: filename });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return json({ message: 'Image not found.' }, { status: 404 });
    }
    return errorResponse(error);
  }
}
