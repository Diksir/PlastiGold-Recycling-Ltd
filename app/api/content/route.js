import { requireAdmin } from '@/lib/auth';
import { readContent, removeUploadedFileIfUnused, saveImageFile, writeContent } from '@/lib/content';
import { mergeContent } from '@/lib/defaultContent';
import { errorResponse, json, unauthorized } from '@/lib/responses';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return json(await readContent());
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const contentType = request.headers.get('content-type') || '';
    const formData = contentType.includes('multipart/form-data') ? await request.formData() : null;
    const body = formData
      ? JSON.parse(String(formData.get('content') || '{}'))
      : await request.json().catch(() => ({}));
    const current = await readContent();
    const replacedImages = [];

    if (formData && Array.isArray(body.services)) {
      body.services = [...body.services];
      for (const [key, value] of formData.entries()) {
        if (!key.startsWith('serviceImage-') || !value || typeof value === 'string') continue;
        const index = Number(key.replace('serviceImage-', ''));
        if (!Number.isInteger(index) || !body.services[index]) continue;

        const previousImage = current.services?.[index]?.image;
        body.services[index] = {
          ...body.services[index],
          image: await saveImageFile(value),
        };
        if (previousImage && previousImage !== body.services[index].image) {
          replacedImages.push(previousImage);
        }
      }
    }

    const nextContent = mergeContent({
      ...current,
      ...body,
      hero: { ...current.hero, ...(body.hero || {}) },
      sections: { ...current.sections, ...(body.sections || {}) },
      story: {
        about: { ...current.story.about, ...(body.story?.about || {}) },
        video: { ...current.story.video, ...(body.story?.video || {}) },
      },
      cta: { ...current.cta, ...(body.cta || {}) },
      contact: { ...current.contact, ...(body.contact || {}) },
      footer: {
        ...current.footer,
        ...(body.footer || {}),
        socialLinks: {
          ...(current.footer?.socialLinks || {}),
          ...(body.footer?.socialLinks || {}),
        },
      },
    });
    await writeContent(nextContent);
    await Promise.all(replacedImages.map((image) => removeUploadedFileIfUnused(image)));
    return json(nextContent);
  } catch (error) {
    return errorResponse(error, 400);
  }
}
