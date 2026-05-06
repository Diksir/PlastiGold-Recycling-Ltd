import path from 'node:path';
import { requireAdmin } from '@/lib/auth';
import { saveMediaFile } from '@/lib/content';
import { errorResponse, json, unauthorized } from '@/lib/responses';

export async function POST(request) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return json({ message: 'No media file uploaded.' }, { status: 400 });
    }

    const url = await saveMediaFile(file, {
      allowedPrefixes: ['image/', 'video/'],
      maxSizeMb: file.type?.startsWith('video/') ? 50 : 5,
      label: file.type?.startsWith('video/') ? 'video' : 'image',
    });
    return json({ filename: path.basename(url), url }, { status: 201 });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
