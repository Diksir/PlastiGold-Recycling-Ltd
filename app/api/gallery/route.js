import { requireAdmin } from '@/lib/auth';
import { makeId, readContent, saveImageFile, writeContent } from '@/lib/content';
import { errorResponse, json, unauthorized } from '@/lib/responses';

export async function POST(request) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get('image');
    if (!file || typeof file === 'string') {
      return json({ message: 'No gallery image uploaded.' }, { status: 400 });
    }

    const content = await readContent();
    const item = {
      id: makeId('gallery'),
      title: String(formData.get('title') || 'Gallery image').trim(),
      caption: String(formData.get('caption') || '').trim(),
      image: await saveImageFile(file),
    };
    content.gallery.unshift(item);
    await writeContent(content);
    return json(item, { status: 201 });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
