# PlastiGold Recycling Ltd Website

Modern full-stack website for PlastiGold Recycling Ltd, a plastic recycling company in Kano, Nigeria.

## Project Structure

```text
client/   React + Vite single-page website and admin image manager
server/   Node.js + Express API for uploaded images
```

## Install Dependencies

```bash
npm run install:all
npm install
```

## Run Backend

```bash
npm run dev --prefix server
```

Backend runs on `http://localhost:5000` by default.

## Run Frontend

```bash
npm run dev --prefix client
```

Frontend runs on `http://localhost:5173` by default.

You can also run both together:

```bash
npm run dev
```

## Environment Variables

Create `client/.env` from `client/.env.example`:

```bash
VITE_API_BASE_URL=http://localhost:5000
```

Create `server/.env` from `server/.env.example`:

```bash
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
ADMIN_EMAIL=admin@plastigoldrecycling.com
ADMIN_PASSWORD=change-this-password
```

## Admin Login and Website Editing

1. Start the backend and frontend.
2. Open `http://localhost:5173/admin`.
3. Login with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from `server/.env`.
4. Edit the homepage title/tagline, upload hero slider images, reorder slides, and manage gallery captions.
5. Uploaded files are stored in `server/uploads`.
6. Editable website content is stored in `server/data/content.json`.

Default development credentials are `admin@plastigoldrecycling.com` and `admin123` if environment variables are not set. Change these before using the site publicly.

## Changing Logo and Images

- Logo: replace `client/public/assets/plastigold-logo.svg`.
- Product placeholders: replace files in `client/public/assets/`.
- Hero slides and uploaded gallery images: manage them from `/admin`.
- Manual content backup: copy `server/data/content.json` and `server/uploads`.

## Production Build

```bash
npm run build
```

The production frontend output is generated in `client/dist`.

## Deployment

Deploy the frontend to Vercel from the repository root. The included `vercel.json` builds `client/` and serves `client/dist`.

Deploy the backend as a Node web service separately, for example on Render with the included `render.yaml`. Set these backend environment variables:

```bash
CLIENT_ORIGIN=https://your-vercel-site.vercel.app
ADMIN_EMAIL=admin@plastigoldrecycling.com
ADMIN_PASSWORD=use-a-strong-password
UPLOADS_DIR=/var/data/uploads
DATA_DIR=/var/data/data
```

After the backend is live, add this frontend environment variable in Vercel and redeploy:

```bash
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```
