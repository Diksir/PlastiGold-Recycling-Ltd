import HomePage from '@/components/HomePage';
import { readContent } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const content = await readContent();
  return <HomePage initialContent={content} />;
}
