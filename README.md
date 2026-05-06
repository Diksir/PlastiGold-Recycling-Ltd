# PlastiGold Recycling Ltd Website

Modern full-stack Next.js website for PlastiGold Recycling Ltd, a plastic recycling company in Kano, Nigeria.

## Project Structure

```text
app/        Next.js routes, pages, and API handlers
components/ Reusable React UI for the public site and admin forms
lib/        Shared content, auth, and upload helpers
public/     Static assets and uploaded images
data/       Editable homepage content
```

## Install Dependencies

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Next.js runs the website and API together on `http://localhost:3000`.

## Environment Variables

Create `.env.local` in the project root:

```bash
ADMIN_EMAIL=admin@plastigoldrecycling.com
ADMIN_PASSWORD=change-this-password
AUTH_SECRET=use-a-long-random-secret
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token-for-production
UPLOADS_DIR=./public/uploads
DATA_DIR=./data
```

## Admin Login and Website Editing

1. Start the Next.js app.
2. Open `http://localhost:3000/admin`.
3. Login with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from `.env.local`.
4. Edit the homepage title/tagline, upload hero slider images, reorder slides, edit the story write-up/image/video section, and manage gallery captions.
5. Uploaded files are stored in `public/uploads` locally, or in Vercel Blob when `BLOB_READ_WRITE_TOKEN` is configured.
6. Editable website content is stored in `data/content.json` locally, or in Vercel Blob when `BLOB_READ_WRITE_TOKEN` is configured.

Default development credentials are `admin@plastigoldrecycling.com` and `admin123` if environment variables are not set. Change these before using the site publicly.

## Changing Logo and Images

- Logo: replace `public/assets/plastigold-logo.svg`.
- Product placeholders: replace files in `public/assets/`.
- Hero slides, story section media, videos, and uploaded gallery images: manage them from `/admin`.
- Manual content backup: copy `data/content.json` and `public/uploads`.

## Production Build

```bash
npm run build
```

Next.js builds the website and API routes into `.next`.

## Deployment

Deploy the project to Vercel from the repository root. The included `vercel.json` uses the Next.js build. Set these environment variables:

```bash
ADMIN_EMAIL=admin@plastigoldrecycling.com
ADMIN_PASSWORD=use-a-strong-password
AUTH_SECRET=use-a-long-random-secret
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

Do not set `UPLOADS_DIR=./public/uploads` on Vercel. Vercel's deployed filesystem is read-only. For permanent admin edits and uploads on Vercel, connect Vercel Blob and set `BLOB_READ_WRITE_TOKEN`.
