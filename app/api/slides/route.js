import { requireAdmin } from '@/lib/auth';
import { makeId, readContent, saveImageFile, writeContent } from '@/lib/content';
import { errorResponse, json, unauthorized } from '@/lib/responses';

export async function POST(request) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get('image');
    if (!file || typeof file === 'string') {
      return json({ message: 'No slide image uploaded.' }, { status: 400 });
    }

    const content = await readContent();
    const slide = {
      id: makeId('slide'),
      title: String(formData.get('title') || 'New slide').trim(),
      image: await saveImageFile(file),
    };
    content.slides.push(slide);
    await writeContent(content);
    return json(slide, { status: 201 });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
