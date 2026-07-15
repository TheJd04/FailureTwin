# FailureTwin — deployment (Gemini backend)

This folder is a complete app: a static frontend (`index.html`) plus one backend
endpoint (`api/analyze.js`) that holds your **free Google Gemini API key**
server-side. Visitors never see or need their own key — the server handles
every request.

## Get a free Gemini API key (no credit card)

1. Go to **aistudio.google.com** and sign in with any Google account.
2. Click **Get API key** → **Create API key**.
3. Copy the key — you won't be able to see it again after closing the dialog.

This uses the `gemini-2.5-flash` model by default, which is on Gemini's free
tier: no billing required, rate-limited but generous enough for personal use.

## Deploy (Vercel)

This needs a real project deploy, not the Vercel Drop drag-and-drop box —
Drop is static-files-only and has no way to set an environment variable.

**Option A — Vercel CLI (fastest)**
```
npm install -g vercel
cd this-folder
vercel
```
Follow the prompts to create a project, then set your key:
```
vercel env add GEMINI_API_KEY production
```
Paste your Gemini key when prompted, then deploy to production:
```
vercel --prod
```

**Option B — GitHub + Vercel dashboard**
1. Push this folder to a new GitHub repo.
2. On vercel.com, "Add New Project" → import that repo.
3. Before the first deploy, open Project Settings → Environment Variables →
   add `GEMINI_API_KEY` with your key, for the Production environment.
4. Deploy.

## Deploy (other Node hosts)

Any host that runs Node and lets you set environment variables works the
same way in spirit: serve `index.html` as a static file, run `api/analyze.js`
as a server endpoint reachable at `/api/analyze`, and set `GEMINI_API_KEY`
in that host's environment variable settings.

## Optional: switch models

Set a `GEMINI_MODEL` environment variable (e.g. `gemini-2.5-flash-lite`) to
use a different free-tier model without touching code. Pro models are not
on the free tier — check ai.google.dev/pricing before switching to one.

## Before you make this public

Every visitor to your deployed URL can trigger API calls against **your**
key. Gemini's free tier has real per-day and per-minute limits, so heavy
traffic can exhaust the day's quota for everyone, not just cost you money.
The backend caps how long a single request's text can be, but that's not
the same as a rate limit. If you're sharing this URL beyond yourself or a
trusted few, consider adding a simple shared password check in
`api/analyze.js` (an `X-Site-Secret` header checked against another
environment variable) before it goes fully public.
