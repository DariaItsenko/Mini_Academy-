# Elementary Learning Hub

A playful learning app for elementary students with Math, English, and Ukrainian subjects.

## Run locally

```bash
npm install
cd client && npm install
cd ../server && npm install
cd ..
npm run dev
```

- App: http://localhost:5173
- API: http://localhost:3001

## Install on laptop, phone, or tablet (PWA)

The app is a **Progressive Web App**. After you open it in a browser:

| Device | How to install |
|--------|----------------|
| **Android (Chrome)** | Menu → **Install app** or **Add to Home screen** |
| **iPhone / iPad (Safari)** | Share → **Add to Home Screen** |
| **Windows / Mac (Chrome or Edge)** | Address bar install icon, or use the in-app **Install App** banner |

Installed, it opens in its own window like a native app and caches assets for faster loads.

## Pages

- **Home** — subject picker with language switcher
- **Profile** — points, streak, grade, achievements, avatar shop
- **Statistics** — progress charts and study metrics

Sign up with email to save progress across devices when the server is running.

## Public link (not localhost)

### Option A — Permanent hosting (recommended)

Deploy to **[Render](https://render.com)** so the site stays online and data syncs for everyone:

1. Push this folder to **GitHub** (create a repo and upload the project).
2. On Render: **New → Blueprint** → connect the repo (Render reads `render.yaml`).
3. After deploy, open your app URL (e.g. `https://elementary-learning-hub.onrender.com`).

New users, curriculum edits, and progress are stored on the server (`data.json` on a persistent disk).

### Option B — Temporary public URL (your PC must stay on)

With the API running locally (`npm run build` then `NODE_ENV=production node server/index.js`):

```bash
npx localtunnel --port 3001
```

Use the printed `https://….loca.lt` link. The first visit may show a tunnel reminder page — click **Continue**. The link changes each time you restart the tunnel.

**Install as PWA:** open the public **https** link (not localhost), then use **Install app** or **Add to Home Screen**.
