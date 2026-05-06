import fs from 'node:fs/promises';
import path from 'node:path';
import { requireAdmin } from '@/lib/auth';
import { ensureStorage, saveImageFile, uploadsDir } from '@/lib/content';
import { errorResponse, json, unauthorized } from '@/lib/responses';

export async function GET() {
  try {
    await ensureStorage();
    const files = await fs.readdir(uploadsDir, { withFileTypes: true });
    const images = files
      .filter((file) => file.isFile())
      .map((file) => ({
        filename: file.name,
        url: `/api/images/${file.name}`,
      }))
      .sort((a, b) => b.filename.localeCompare(a.filename));
    return json(images);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get('image');
    if (!file || typeof file === 'string') {
      return json({ message: 'No image file uploaded.' }, { status: 400 });
    }
    const url = await saveImageFile(file);
    return json({ filename: path.basename(url), url }, { status: 201 });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
