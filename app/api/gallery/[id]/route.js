import { requireAdmin } from '@/lib/auth';
import { readContent, removeUploadedFileIfUnused, saveImageFile, writeContent } from '@/lib/content';
import { errorResponse, json, unauthorized } from '@/lib/responses';

export async function PATCH(request, { params }) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const { id } = await params;
    const contentType = request.headers.get('content-type') || '';
    const body = contentType.includes('multipart/form-data') ? await request.formData() : await request.json().catch(() => ({}));
    const content = await readContent();
    const item = content.gallery.find((entry) => entry.id === id);
    if (!item) return json({ message: 'Gallery image not found.' }, { status: 404 });

    const nextTitle = body instanceof FormData ? body.get('title') : body.title;
    const nextCaption = body instanceof FormData ? body.get('caption') : body.caption;
    const nextImage = body instanceof FormData ? body.get('image') : null;
    const previousImage = item.image;

    item.title = String(nextTitle || item.title).trim();
    item.caption = String(nextCaption ?? item.caption).trim();
    if (nextImage && typeof nextImage !== 'string') {
      item.image = await saveImageFile(nextImage);
    }

    await writeContent(content);
    if (item.image !== previousImage) {
      await removeUploadedFileIfUnused(previousImage);
    }
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
