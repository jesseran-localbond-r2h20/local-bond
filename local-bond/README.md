# Local Bond

**Shop where you belong.** A mobile-first tool that helps neighbors find and buy
from local businesses first — starting in Petaluma, CA.

This repo is the whole website plus the search app. It's plain HTML/CSS/JS with
one small serverless function, so it deploys anywhere static and costs little to
nothing to run.

---

## What's in here

```
public/                     Everything the browser loads (this is what gets published)
  index.html                The search app
  why-local.html            "Why Local" page
  our-story.html            "Our Story" page
  data/seed.json            The vendors + products the app searches
  img/                      Petaluma photos
netlify/functions/
  match.js                  AI search fallback — runs only when keyword search misses.
                            Reads the API key from the server, never the browser.
scripts/
  sync-sheet.mjs            Optional: pull the published Google Sheet -> JSON
netlify.toml                Host config (publish public/, functions folder)
.env.example                The NAMES of secrets (copy to .env; never commit .env)
package.json                Handy commands (npm run preview / npm run sync)
```

---

## Deploy it (about 10 minutes, once)

1. **Push this folder to GitHub** (see below if the repo isn't there yet).
2. Go to **netlify.com**, sign in with GitHub, and click **Add new site → Import
   an existing project**. Pick this repository.
3. Netlify reads `netlify.toml` automatically — no build settings to fill in.
   Click **Deploy**. You'll have a live `*.netlify.app` URL in under a minute.
4. **Add your API key** (only needed for the AI fallback): Site settings →
   Environment variables → add `ANTHROPIC_API_KEY` with your real key.
5. After that, every `git push` to `main` redeploys automatically.

Vercel and Cloudflare Pages work the same way if you prefer them.

## Push to GitHub the first time

From this folder, in Terminal:

```bash
git init
git add .
git commit -m "Local Bond: initial site + search app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/local-bond.git
git push -u origin main
```

(Create the empty `local-bond` repo on github.com first, or let GitHub Desktop /
the `gh` CLI do it. Claude Code can run all of this for you.)

## Preview locally

Because the pages are self-contained, you can just open `public/index.html` in a
browser. To preview exactly as it'll deploy (and to test the function), run:

```bash
npm run preview        # serves public/ at http://localhost:3000
```

---

## How the search works

1. The browser loads `index.html` and matches your query against `data/seed.json`
   **instantly** — no server, no cost.
2. **Only if that finds nothing** does it call `/.netlify/functions/match`, which
   asks Claude to interpret the query and pick the best product.

Fast path stays local and free; the AI is just the safety net. (This is why the
API cost question is a small one — more on that when you're ready.)

## Notes to future you

- **Data today vs. later.** Right now `index.html` ships with its own copy of the
  catalog so it works with zero setup. `data/seed.json` is the same data as a
  standalone file — it's the source of truth to point the app at when you want
  edits to flow through without touching code. That switch is a few lines.
- **`sync-sheet.mjs` is optional.** It pulls your published Google Sheet into the
  repo so the data can stay current. You don't need it to launch.
- **Content pages.** If you host the marketing pages on WordPress instead, delete
  `why-local.html` / `our-story.html` from here and link to WordPress. Keeping
  them means this repo alone is the complete site.
- **The key is never in the code.** It lives in Netlify's dashboard (or a local
  `.env`), which is why `.env` is git-ignored.
