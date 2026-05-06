import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { defaultContent, mergeContent } from './defaultContent.js';

export { defaultContent };

const runtimeRoot = path.join(os.tmpdir(), 'plastigold-recycling-ltd');
const isVercel = Boolean(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT);
const contentBlobPath = 'plastigold/content.json';
const useBlobStorage = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

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

export async function ensureStorage() {
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.mkdir(dataDir, { recursive: true });
}

export async function readContent() {
  if (useBlobStorage) {
    const { list } = await blobClient();
    const { blobs } = await list({ prefix: contentBlobPath, limit: 1 });
    const contentBlob = blobs.find((blob) => blob.pathname === contentBlobPath) || blobs[0];

    if (contentBlob) {
      const response = await fetch(contentBlob.url, { cache: 'no-store' });
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

export async function writeContent(content) {
  if (useBlobStorage) {
    const { put } = await blobClient();
    await put(contentBlobPath, JSON.stringify(content, null, 2), {
      access: 'public',
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 60,
    });
    return;
  }

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

export async function saveMediaFile(file, { allowedPrefixes = ['image/'], maxSizeMb = 5, label = 'file' } = {}) {
  if (!file || !allowedPrefixes.some((prefix) => file.type?.startsWith(prefix))) {
    throw new Error(`Only ${label} uploads are allowed.`);
  }

  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new Error(`${label[0].toUpperCase()}${label.slice(1)} uploads must be ${maxSizeMb}MB or smaller.`);
  }

  const filename = safeFileName(file.name);
  const bytes = Buffer.from(await file.arrayBuffer());

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
  return fs.readFile(path.join(uploadsDir, path.basename(filename)));
}

export async function readBundledContent() {
  try {
    const raw = await fs.readFile(bundledContentFile, 'utf8');
    return JSON.parse(raw);
  } catch {
    return defaultContent;
  }
}
