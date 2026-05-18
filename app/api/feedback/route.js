import { makeId, readContent, writeContent } from '@/lib/content';
import { errorResponse, json } from '@/lib/responses';

export const dynamic = 'force-dynamic';

const cleanText = (value, maxLength) => String(value || '').trim().slice(0, maxLength);

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = cleanText(body.name, 80);
    const role = cleanText(body.role || 'Customer', 80);
    const text = cleanText(body.text, 500);
    const rating = Math.min(5, Math.max(1, Number.parseInt(body.rating, 10) || 5));

    if (!name || !text) {
      return json({ message: 'Name and feedback are required.' }, { status: 400 });
    }

    const content = await readContent();
    const testimonial = {
      id: makeId('testimonial'),
      name,
      role,
      text,
      rating,
    };

    content.testimonials = [testimonial, ...(content.testimonials || [])].slice(0, 24);
    await writeContent(content);
    return json(testimonial, { status: 201 });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
