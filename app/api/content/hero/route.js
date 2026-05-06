import { requireAdmin } from '@/lib/auth';
import { readContent, writeContent } from '@/lib/content';
import { errorResponse, json, unauthorized } from '@/lib/responses';

export async function PATCH(request) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const body = await request.json().catch(() => ({}));
    const content = await readContent();
    content.hero = {
      ...content.hero,
      title: String(body.title || content.hero.title).trim(),
      tagline: String(body.tagline || content.hero.tagline).trim(),
      subtitle: String(body.subtitle ?? content.hero.subtitle).trim(),
      primaryCtaText: String(body.primaryCtaText ?? content.hero.primaryCtaText).trim(),
      primaryCtaHref: String(body.primaryCtaHref ?? content.hero.primaryCtaHref).trim(),
      secondaryCtaText: String(body.secondaryCtaText ?? content.hero.secondaryCtaText).trim(),
      secondaryCtaHref: String(body.secondaryCtaHref ?? content.hero.secondaryCtaHref).trim(),
    };
    await writeContent(content);
    return json(content.hero);
  } catch (error) {
    return errorResponse(error);
  }
}
