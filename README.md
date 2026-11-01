# MVH Kiosk

Showroom kiosk for Mountain View Homes of Bremerton: floorplan catalog, 3D tours,
spec sheets, appointment scheduling, and the HOM̂ER guide.

This version is a **fully static site** that deploys to GitHub Pages.

## Deploy on GitHub Pages

1. Create a new repo (the default base path assumes it is named `MVH-Kiosk`).
2. Upload/push this folder's contents to the `main` branch.
3. In the repo go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
4. Push (or run the workflow from the **Actions** tab). The site appears at
   `https://<your-username>.github.io/MVH-Kiosk/`.

If you use a different repo name, edit `REPO_BASE` in `vite.config.ts`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs dist/
npm run preview    # test the production build
```

## HOM̂ER AI guide

HOM̂ER runs in the browser using the built-in rules engine (`src/lib/homerEngine.ts`),
so no server or API key is needed. To use Gemini again, host a small proxy (Cloud Run,
Cloudflare Worker, etc.) that holds your key and accepts
`POST { query, conversationHistory, clientDossier }` → `AiQueryResult` JSON, then build with
`VITE_HOMER_AI_URL=https://your-proxy.example.com/ai`. If the proxy is down, the app falls
back to the built-in engine. Never put a Gemini key in the frontend; static sites are public.

## Notes

- Floorplan PDFs load from `raw.githubusercontent.com` (CORS-enabled) and local PDFs from `public/assets/aistudio/`.
- Catalog data lives in `src/data/floorplans.json`; `parse_pricing.py` and `update_catalog_prices.py` are the original data-maintenance scripts.
