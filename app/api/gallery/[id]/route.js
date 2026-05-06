import { requireAdmin } from '@/lib/auth';
import { readContent, removeUploadedFileIfUnused, writeContent } from '@/lib/content';
import { errorResponse, json, unauthorized } from '@/lib/responses';

export async function PATCH(request, { params }) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const content = await readContent();
    const item = content.gallery.find((entry) => entry.id === id);
    if (!item) return json({ message: 'Gallery image not found.' }, { status: 404 });
    item.title = String(body.title || item.title).trim();
    item.caption = String(body.caption ?? item.caption).trim();
    await writeContent(content);
    return json(item);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request, { params }) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const { id } = await params;
    const content = await readContent();
    const item = content.gallery.find((entry) => entry.id === id);
    content.gallery = content.gallery.filter((entry) => entry.id !== id);
    await writeContent(content);
    await removeUploadedFileIfUnused(item?.image);
    return json({ deleted: id });
  } catch (error) {
    return errorResponse(error);
  }
}
