import fs from 'node:fs/promises';
import path from 'node:path';
import { requireAdmin } from '@/lib/auth';
import { uploadsDir } from '@/lib/content';
import { errorResponse, json, unauthorized } from '@/lib/responses';

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
