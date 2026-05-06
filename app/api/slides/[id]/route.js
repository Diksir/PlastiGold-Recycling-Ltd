import { requireAdmin } from '@/lib/auth';
import { readContent, removeUploadedFileIfUnused, writeContent } from '@/lib/content';
import { errorResponse, json, unauthorized } from '@/lib/responses';

export async function PATCH(request, { params }) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const content = await readContent();
    const slide = content.slides.find((item) => item.id === id);
    if (!slide) return json({ message: 'Slide not found.' }, { status: 404 });
    slide.title = String(body.title || slide.title).trim();
    await writeContent(content);
    return json(slide);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request, { params }) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const { id } = await params;
    const content = await readContent();
    const slide = content.slides.find((item) => item.id === id);
    content.slides = content.slides.filter((item) => item.id !== id);
    await writeContent(content);
    await removeUploadedFileIfUnused(slide?.image);
    return json({ deleted: id });
  } catch (error) {
    return errorResponse(error);
  }
}
