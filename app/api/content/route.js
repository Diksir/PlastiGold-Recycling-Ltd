import { readContent } from '@/lib/content';
import { errorResponse, json } from '@/lib/responses';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return json(await readContent());
  } catch (error) {
    return errorResponse(error);
  }
}
