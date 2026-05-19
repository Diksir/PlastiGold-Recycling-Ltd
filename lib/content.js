import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { defaultContent, mergeContent } from './defaultContent.js';

export { defaultContent };

const runtimeRoot = path.join(os.tmpdir(), 'plastigold-recycling-ltd');
const isVercel = Boolean(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT);
const contentBlobPath = 'plastigold/content.json';
const contentBlobPrefix = 'plastigold/content/';
const mongoUri = normalizeMongoUri(process.env.MONGODB_URI);
const useMongoContent = Boolean(mongoUri);
const useBlobStorage = Boolean(process.env.BLOB_READ_WRITE_TOKEN) && !useMongoContent;
const mongoDbName = process.env.MONGODB_DB || 'Plasticgold';
const mongoContentCollection = process.env.MONGODB_CONTENT_COLLECTION || 'site_content';
const mongoMediaBucket = process.env.MONGODB_MEDIA_BUCKET || 'media_files';
const mongoContentId = 'homepage';

function normalizeMongoUri(value) {
  let uri = String(value || '').trim();
  if (uri.startsWith('MONGODB_URI=')) {
    uri = uri.slice('MONGODB_URI='.length).trim();
  }
  return uri.replace(/^['"]|['"]$/g, '').trim();
}

function resolveWritableDir(envValue, localPath, runtimePath) {
  const resolved = envValue ? path.resolve(envValue) : null;
  if (isVercel && (!resolved || resolved.startsWith(process.cwd()))) {
    return runtimePath;
  }
  return resolved || (isVercel ? runtimePath : localPath);
}

export const uploadsDir = resolveWritableDir(
  process.env.UPLOADS_DIR,
  path.join(process.cwd(), 'public', 'uploads'),
  path.join(runtimeRoot, 'uploads'),
);
export const dataDir = resolveWritableDir(
  process.env.DATA_DIR,
  path.join(process.cwd(), 'data'),
  path.join(runtimeRoot, 'data'),
);
export const contentFile = path.join(dataDir, 'content.json');
const bundledContentFile = path.join(process.cwd(), 'data', 'content.json');

async function blobClient() {
  return import('@vercel/blob');
}

async function mongoContentStore() {
  const { MongoClient } = await import('mongodb');
  const globalCache = globalThis;

  if (!globalCache.__plastigoldMongoClientPromise) {
    const client = new MongoClient(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    });
    globalCache.__plastigoldMongoClientPromise = client.connect();
  }

  const client = await globalCache.__plastigoldMongoClientPromise;
  return client.db(mongoDbName).collection(mongoContentCollection);
}

async function mongoMediaStore() {
  const { GridFSBucket, MongoClient } = await import('mongodb');
  const globalCache = globalThis;

  if (!globalCache.__plastigoldMongoClientPromise) {
    const client = new MongoClient(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    });
    globalCache.__plastigoldMongoClientPromise = client.connect();
  }

  const client = await globalCache.__plastigoldMongoClientPromise;
  return new GridFSBucket(client.db(mongoDbName), { bucketName: mongoMediaBucket });
}

export async function ensureStorage() {
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.mkdir(dataDir, { recursive: true });
}

async function readContentFromBlobOrFile() {
  if (useBlobStorage) {
    const { list } = await blobClient();
    const { blobs: contentBlobs } = await list({ prefix: contentBlobPrefix, limit: 100 });
    const contentBlob = [...contentBlobs].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0];

    if (contentBlob) {
      const response = await fetch(contentBlob.url, { cache: 'no-store' });
      if (response.ok) {
        return mergeContent(await response.json());
      }
    }

    const { blobs: legacyBlobs } = await list({ prefix: contentBlobPath, limit: 1 });
    const legacyBlob = legacyBlobs.find((blob) => blob.pathname === contentBlobPath) || legacyBlobs[0];

    if (legacyBlob) {
      const cacheSafeUrl = `${legacyBlob.url}${legacyBlob.url.includes('?') ? '&' : '?'}v=${Date.now()}`;
      const response = await fetch(cacheSafeUrl, { cache: 'no-store' });
      if (response.ok) {
        return mergeContent(await response.json());
      }
    }

    const seedContent = await readBundledContent();
    await writeContent(seedContent);
    return mergeContent(seedContent);
  }

  await ensureStorage();
  try {
    const raw = await fs.readFile(contentFile, 'utf8');
    const data = JSON.parse(raw);
    return mergeContent(data);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const seedContent = await readBundledContent();
    await writeContent(seedContent);
    return mergeContent(seedContent);
  }
}

async function writeContentToBlobOrFile(content) {
  if (useBlobStorage) {
    const { del, list, put } = await blobClient();
    const pathname = `${contentBlobPrefix}${Date.now()}-${crypto.randomBytes(4).toString('hex')}.json`;
    await put(pathname, JSON.stringify(content, null, 2), {
      access: 'public',
      contentType: 'application/json',
      cacheControlMaxAge: 60,
    });

    const { blobs } = await list({ prefix: contentBlobPrefix, limit: 100 });
    const oldBlobs = [...blobs]
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .slice(5);

    if (oldBlobs.length) {
      await del(oldBlobs.map((blob) => blob.url)).catch(() => {});
    }
    return;
  }

  await ensureStorage();
  await fs.writeFile(contentFile, JSON.stringify(content, null, 2));
}

export async function readContent() {
  if (useMongoContent) {
    const collection = await mongoContentStore();
    const doc = await collection.findOne({ _id: mongoContentId });
    if (doc?.content) {
      return mergeContent(doc.content);
    }

    const seedContent = await readContentFromBlobOrFile();
    await writeContent(seedContent);
    return mergeContent(seedContent);
  }

  return readContentFromBlobOrFile();
}

export async function writeContent(content) {
  const nextContent = mergeContent(content);

  if (useMongoContent) {
    const collection = await mongoContentStore();
    await collection.updateOne(
      { _id: mongoContentId },
      {
        $set: {
          content: nextContent,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );
    return;
  }

  await writeContentToBlobOrFile(nextContent);
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

export async function saveMediaFile(file, { allowedPrefixes = ['image/'], maxSizeMb = 5, label = 'file' } = {}) {
  if (!file || !allowedPrefixes.some((prefix) => file.type?.startsWith(prefix))) {
    throw new Error(`Only ${label} uploads are allowed.`);
  }

  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new Error(`${label[0].toUpperCase()}${label.slice(1)} uploads must be ${maxSizeMb}MB or smaller.`);
  }

  const filename = safeFileName(file.name);
  const bytes = Buffer.from(await file.arrayBuffer());

  if (useMongoContent) {
    const bucket = await mongoMediaStore();
    await deleteMongoMediaFile(bucket, filename);
    await new Promise((resolve, reject) => {
      const stream = bucket.openUploadStream(filename, {
        contentType: file.type || 'application/octet-stream',
        metadata: {
          size: file.size,
          uploadedAt: new Date(),
        },
      });
      stream.on('error', reject);
      stream.on('finish', resolve);
      stream.end(bytes);
    });
    return `/api/images/${filename}`;
  }

  if (useBlobStorage) {
    const { put } = await blobClient();
    const blob = await put(`plastigold/uploads/${filename}`, bytes, {
      access: 'public',
      allowOverwrite: true,
      contentType: file.type || 'application/octet-stream',
    });
    return blob.url;
  }

  await ensureStorage();
  await fs.writeFile(path.join(uploadsDir, filename), bytes);
  return `/api/images/${filename}`;
}

export async function saveImageFile(file) {
  return saveMediaFile(file, { allowedPrefixes: ['image/'], maxSizeMb: 5, label: 'image' });
}

export async function removeUploadedFileIfUnused(image) {
  if (useMongoContent && isUploadedFilePath(image)) {
    const bucket = await mongoMediaStore();
    await deleteMongoMediaFile(bucket, path.basename(image));
    return;
  }

  if (isBlobUrl(image)) {
    const { del } = await blobClient();
    await del(image).catch(() => {});
    return;
  }

  if (!isUploadedFilePath(image)) return;
  const filename = path.basename(image);
  await fs.unlink(path.join(uploadsDir, filename)).catch(() => {});
}

export function isUploadedFilePath(value) {
  return value?.startsWith('/uploads/') || value?.startsWith('/api/images/') || isBlobUrl(value);
}

export function isBlobUrl(value) {
  return typeof value === 'string' && value.includes('.public.blob.vercel-storage.com/');
}

export async function readUploadedFile(filename) {
  if (useMongoContent) {
    const bucket = await mongoMediaStore();
    return readMongoMediaFile(bucket, path.basename(filename));
  }

  return fs.readFile(path.join(uploadsDir, path.basename(filename)));
}

async function deleteMongoMediaFile(bucket, filename) {
  const files = await bucket.find({ filename }).toArray();
  await Promise.all(files.map((file) => bucket.delete(file._id).catch(() => {})));
}

async function readMongoMediaFile(bucket, filename) {
  const files = await bucket.find({ filename }).sort({ uploadDate: -1 }).limit(1).toArray();
  const file = files[0];
  if (!file) {
    const error = new Error('Image not found.');
    error.code = 'ENOENT';
    throw error;
  }

  return new Promise((resolve, reject) => {
    const chunks = [];
    const stream = bucket.openDownloadStream(file._id);
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

export async function readBundledContent() {
  try {
    const raw = await fs.readFile(bundledContentFile, 'utf8');
    return JSON.parse(raw);
  } catch {
    return defaultContent;
  }
}
