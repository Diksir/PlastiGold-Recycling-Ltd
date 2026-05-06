import { requireAdmin } from '@/lib/auth';
import { readContent, writeContent } from '@/lib/content';
import { errorResponse, json, unauthorized } from '@/lib/responses';

export async function PATCH(request) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const body = await request.json().catch(() => ({}));
    const content = await readContent();
    content.hero = {
      title: String(body.title || content.hero.title).trim(),
      tagline: String(body.tagline || content.hero.tagline).trim(),
    };
    await writeContent(content);
    return json(content.hero);
  } catch (error) {
    return errorResponse(error);
  }
}
