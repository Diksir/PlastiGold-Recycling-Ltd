import { requireAdmin } from '@/lib/auth';
import { readContent, writeContent } from '@/lib/content';
import { errorResponse, json, unauthorized } from '@/lib/responses';

export async function PATCH(request) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const body = await request.json().catch(() => ({}));
    const ids = Array.isArray(body.ids) ? body.ids : [];
    const content = await readContent();
    const byId = new Map(content.slides.map((slide) => [slide.id, slide]));
    const ordered = ids.map((id) => byId.get(id)).filter(Boolean);
    const missing = content.slides.filter((slide) => !ids.includes(slide.id));
    content.slides = [...ordered, ...missing];
    await writeContent(content);
    return json(content.slides);
  } catch (error) {
    return errorResponse(error);
  }
}
