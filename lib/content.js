import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export const uploadsDir = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(process.cwd(), 'public', 'uploads');
export const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), 'data');
export const contentFile = path.join(dataDir, 'content.json');

export const defaultContent = {
  hero: {
    title: 'PlastiGold Recycling Ltd',
    tagline: 'Turning Plastic Waste into a Better Future',
  },
  slides: [
    { id: 'slide-red-pellets-01', title: 'Red recycled plastic pellets', image: '/assets/slide-red-pellets-01.jpeg' },
    { id: 'slide-brown-pellets-01', title: 'Brown recycled plastic pellets', image: '/assets/slide-brown-pellets-01.jpeg' },
    { id: 'slide-dark-pellets-01', title: 'Dark recycled plastic pellets', image: '/assets/slide-dark-pellets-01.jpeg' },
    { id: 'slide-white-pellets-01', title: 'White recycled plastic pellets', image: '/assets/slide-white-pellets-01.jpeg' },
    { id: 'slide-dark-pellets-02', title: 'Sorted dark pellets', image: '/assets/slide-dark-pellets-02.jpeg' },
    { id: 'slide-brown-pellets-02', title: 'Sorted brown pellets', image: '/assets/slide-brown-pellets-02.jpeg' },
    { id: 'slide-red-pellets-02', title: 'Sorted red pellets', image: '/assets/slide-red-pellets-02.jpeg' },
  ],
  gallery: [
    {
      id: 'gallery-1',
      title: 'Recycling plant',
      caption: 'PlastiGold recycling operations and materials.',
      image: '/assets/recycling-plant.svg',
    },
    {
      id: 'gallery-2',
      title: 'Product pellets',
      caption: 'Processed recycled plastic materials for industry.',
      image: '/assets/pellets-green.svg',
    },
    {
      id: 'gallery-3',
      title: 'Collection yard',
      caption: 'Sorted plastic waste prepared for recycling.',
      image: '/assets/gallery-yard.svg',
    },
  ],
};

export async function ensureStorage() {
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.mkdir(dataDir, { recursive: true });
}

export async function readContent() {
  await ensureStorage();
  try {
    const raw = await fs.readFile(contentFile, 'utf8');
    const data = JSON.parse(raw);
    return {
      hero: data.hero || defaultContent.hero,
      slides: Array.isArray(data.slides) && data.slides.length ? data.slides : defaultContent.slides,
      gallery: Array.isArray(data.gallery) && data.gallery.length ? data.gallery : defaultContent.gallery,
    };
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await writeContent(defaultContent);
    return defaultContent;
  }
}

export async function writeContent(content) {
  await ensureStorage();
  await fs.writeFile(contentFile, JSON.stringify(content, null, 2));
}

export function makeId(prefix) {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
}

export function safeFileName(name) {
  const cleaned = String(name || 'upload')
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${Date.now()}-${cleaned || 'image'}`;
}

export async function saveImageFile(file) {
  if (!file || !file.type?.startsWith('image/')) {
    throw new Error('Only image uploads are allowed.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image uploads must be 5MB or smaller.');
  }

  await ensureStorage();
  const filename = safeFileName(file.name);
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadsDir, filename), bytes);
  return `/uploads/${filename}`;
}

export async function removeUploadedFileIfUnused(image) {
  if (!image?.startsWith('/uploads/')) return;
  const filename = path.basename(image);
  await fs.unlink(path.join(uploadsDir, filename)).catch(() => {});
}
