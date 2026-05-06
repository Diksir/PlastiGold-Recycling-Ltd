import { requireAdmin } from '@/lib/auth';
import { readContent, writeContent } from '@/lib/content';
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
    const body = await request.json().catch(() => ({}));
    const current = await readContent();
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
      footer: { ...current.footer, ...(body.footer || {}) },
    });
    await writeContent(nextContent);
    return json(nextContent);
  } catch (error) {
    return errorResponse(error, 400);
  }
}
