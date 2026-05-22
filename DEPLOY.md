# Deploy Elementary Learning Hub (real website)

The app is one Node server that serves the React build + API + uploaded videos.

## Option A: Render.com (recommended, free tier)

1. Push this folder to **GitHub** (create a repo and push).
2. Go to [https://render.com](https://render.com) → **New** → **Blueprint** (or Web Service).
3. Connect your GitHub repo.
4. Use these settings if not using `render.yaml`:
   - **Build:** `cd client && npm install && npm run build && cd ../server && npm install`
   - **Start:** `cd server && node index.js`
   - **Environment:** `NODE_ENV=production`, `JWT_SECRET` = any long random string
5. After deploy you get a URL like `https://elementary-learning-hub.onrender.com` — that is your **real website**.

**PWA install** works on HTTPS (Render provides it). Open the site in Chrome → Account → **Install App**, or use the browser install icon in the address bar.

## Option B: Railway / Fly.io

Same idea: build client, run `server/index.js`, set `PORT` from the platform.

## Data persistence

- User accounts, progress, curriculum, and assignments are stored in `server/data.json`.
- Uploaded videos are in `server/uploads/`.
- On Render, attach a **disk** (see `render.yaml`) so data survives redeploys.

## Admin after deploy

- URL: `https://YOUR-SITE.onrender.com/admin-login`
- Email: `admin@learninghub.local`
- Password: `admin123` (change in production by editing code or adding env-based admin)

## Local development

```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
npm run dev
```

Frontend: http://localhost:5173  
API: http://localhost:3001
