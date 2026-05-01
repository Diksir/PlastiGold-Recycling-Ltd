import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const uploadsDir = path.join(rootDir, 'uploads');
const dataDir = path.join(rootDir, 'data');
const contentFile = path.join(dataDir, 'content.json');

await fs.mkdir(uploadsDir, { recursive: true });
await fs.mkdir(dataDir, { recursive: true });

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@plastigoldrecycling.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const sessions = new Map();

const defaultContent = {
  hero: {
    title: 'PlastiGold Recycling Ltd',
    tagline: 'Turning Plastic Waste into a Better Future',
  },
  slides: [
    { id: 'slide-1', title: 'Recycling facility', image: '/assets/recycling-plant.svg' },
    { id: 'slide-2', title: 'Green recycled pellets', image: '/assets/pellets-green.svg' },
    { id: 'slide-3', title: 'Clear recycled pellets', image: '/assets/pellets-clear.svg' },
    { id: 'slide-4', title: 'Collection yard', image: '/assets/gallery-yard.svg' },
    { id: 'slide-5', title: 'Plastic sorting', image: '/assets/sorting-line.svg' },
    { id: 'slide-6', title: 'Recycled material supply', image: '/assets/material-bags.svg' },
    { id: 'slide-7', title: 'Circular production', image: '/assets/circular-future.svg' },
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

const readContent = async () => {
  try {
    const raw = await fs.readFile(contentFile, 'utf8');
    return { ...defaultContent, ...JSON.parse(raw) };
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await writeContent(defaultContent);
    return defaultContent;
  }
};

const writeContent = async (content) => {
  await fs.writeFile(contentFile, JSON.stringify(content, null, 2));
};

const allowedOrigins = CLIENT_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
const isLocalDevOrigin = (origin) => /^http:\/\/(localhost|127\.0\.0\.1|\[::1\]|192\.168\.\d+\.\d+):5173$/.test(origin);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || isLocalDevOrigin(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Origin ${origin} is not allowed by CORS.`));
  },
}));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    const safeName = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, '-')
      .replace(/(^-|-$)/g, '');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
      return;
    }
    cb(new Error('Only image uploads are allowed.'));
  },
});

const imageUrl = (req, filename) => `${req.protocol}://${req.get('host')}/uploads/${filename}`;
const makeId = (prefix) => `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const session = token ? sessions.get(token) : null;

  if (!session || session.expiresAt < Date.now()) {
    if (token) sessions.delete(token);
    res.status(401).json({ message: 'Admin login required.' });
    return;
  }

  next();
};

const removeUploadedFileIfUnused = async (image) => {
  if (!image?.includes('/uploads/')) return;
  const filename = path.basename(new URL(image, 'http://localhost').pathname);
  await fs.unlink(path.join(uploadsDir, filename)).catch(() => {});
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'PlastiGold content API' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    res.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, {
    email,
    expiresAt: Date.now() + 1000 * 60 * 60 * 8,
  });

  res.json({ token, email });
});

app.post('/api/auth/logout', requireAdmin, (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  sessions.delete(token);
  res.json({ ok: true });
});

app.get('/api/content', async (_req, res, next) => {
  try {
    res.json(await readContent());
  } catch (error) {
    next(error);
  }
});

app.patch('/api/content/hero', requireAdmin, async (req, res, next) => {
  try {
    const content = await readContent();
    content.hero = {
      title: String(req.body.title || content.hero.title).trim(),
      tagline: String(req.body.tagline || content.hero.tagline).trim(),
    };
    await writeContent(content);
    res.json(content.hero);
  } catch (error) {
    next(error);
  }
});

app.post('/api/slides', requireAdmin, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No slide image uploaded.' });
      return;
    }

    const content = await readContent();
    const slide = {
      id: makeId('slide'),
      title: String(req.body.title || 'New slide').trim(),
      image: imageUrl(req, req.file.filename),
    };
    content.slides.push(slide);
    await writeContent(content);
    res.status(201).json(slide);
  } catch (error) {
    next(error);
  }
});

app.patch('/api/slides/order', requireAdmin, async (req, res, next) => {
  try {
    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
    const content = await readContent();
    const byId = new Map(content.slides.map((slide) => [slide.id, slide]));
    const ordered = ids.map((id) => byId.get(id)).filter(Boolean);
    const missing = content.slides.filter((slide) => !ids.includes(slide.id));
    content.slides = [...ordered, ...missing];
    await writeContent(content);
    res.json(content.slides);
  } catch (error) {
    next(error);
  }
});

app.patch('/api/slides/:id', requireAdmin, async (req, res, next) => {
  try {
    const content = await readContent();
    const slide = content.slides.find((item) => item.id === req.params.id);
    if (!slide) {
      res.status(404).json({ message: 'Slide not found.' });
      return;
    }
    slide.title = String(req.body.title || slide.title).trim();
    await writeContent(content);
    res.json(slide);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/slides/:id', requireAdmin, async (req, res, next) => {
  try {
    const content = await readContent();
    const slide = content.slides.find((item) => item.id === req.params.id);
    content.slides = content.slides.filter((item) => item.id !== req.params.id);
    await writeContent(content);
    await removeUploadedFileIfUnused(slide?.image);
    res.json({ deleted: req.params.id });
  } catch (error) {
    next(error);
  }
});

app.post('/api/gallery', requireAdmin, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No gallery image uploaded.' });
      return;
    }

    const content = await readContent();
    const item = {
      id: makeId('gallery'),
      title: String(req.body.title || 'Gallery image').trim(),
      caption: String(req.body.caption || '').trim(),
      image: imageUrl(req, req.file.filename),
    };
    content.gallery.unshift(item);
    await writeContent(content);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

app.patch('/api/gallery/:id', requireAdmin, async (req, res, next) => {
  try {
    const content = await readContent();
    const item = content.gallery.find((entry) => entry.id === req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Gallery image not found.' });
      return;
    }
    item.title = String(req.body.title || item.title).trim();
    item.caption = String(req.body.caption ?? item.caption).trim();
    await writeContent(content);
    res.json(item);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/gallery/:id', requireAdmin, async (req, res, next) => {
  try {
    const content = await readContent();
    const item = content.gallery.find((entry) => entry.id === req.params.id);
    content.gallery = content.gallery.filter((entry) => entry.id !== req.params.id);
    await writeContent(content);
    await removeUploadedFileIfUnused(item?.image);
    res.json({ deleted: req.params.id });
  } catch (error) {
    next(error);
  }
});

app.get('/api/images', async (req, res, next) => {
  try {
    const files = await fs.readdir(uploadsDir, { withFileTypes: true });
    const images = files
      .filter((file) => file.isFile())
      .map((file) => ({
        filename: file.name,
        url: imageUrl(req, file.name),
      }))
      .sort((a, b) => b.filename.localeCompare(a.filename));
    res.json(images);
  } catch (error) {
    next(error);
  }
});

app.post('/api/images', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: 'No image file uploaded.' });
    return;
  }

  res.status(201).json({
    filename: req.file.filename,
    url: imageUrl(req, req.file.filename),
  });
});

app.delete('/api/images/:filename', requireAdmin, async (req, res, next) => {
  try {
    const filename = path.basename(req.params.filename);
    const target = path.join(uploadsDir, filename);
    await fs.unlink(target);
    res.json({ deleted: filename });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ message: 'Image not found.' });
      return;
    }
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  const status = error instanceof multer.MulterError ? 400 : 500;
  res.status(status).json({ message: error.message || 'Server error.' });
});

app.listen(PORT, () => {
  console.log(`PlastiGold API running on http://localhost:${PORT}`);
});
