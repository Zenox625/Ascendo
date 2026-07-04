# Ascendo

Personal life tracker — Next.js 16 + Supabase + Spotify.

This is the foundation: real project, Supabase schema, and a **fully working Spotify
connection + in-browser player**. The four tracking views (Daily / Long-term / Calendar /
Notes) are stubbed for now — that's the next step, porting them over from the previous
version.

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com) (free tier is fine).
2. Open **SQL Editor** in the dashboard, paste the contents of `supabase/schema.sql`, run it.
3. Go to **Project Settings > API**. You'll need two values in a moment:
   - **Project URL**
   - The **secret key** (starts with `sb_secret_...` on new projects — this replaced
     the older "service_role" key, same purpose: full server-side access, bypasses
     RLS, never sent to the browser). If your dashboard still shows a legacy
     "service_role" key instead, that works too.

## 2. Set up Spotify

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard),
   log in with your Premium account, click **Create app**.
2. Add a Redirect URI: `http://127.0.0.1:3000/api/spotify/callback` (Spotify requires
   `127.0.0.1`, not `localhost`, for loopback addresses).
3. Check **Web API** and **Web Playback SDK** under "Which API/SDKs are you planning to use".
4. Save. Open **Settings** on the app you just created — you'll find the **Client ID**
   and can reveal the **Client Secret** there.

Note: as of Spotify's February 2026 policy update, Development Mode apps require the
app owner to have an active Premium subscription, and are capped at 5 authorized users
— both are non-issues for personal use.

## 3. Configure the app

```bash
cp .env.local.example .env.local
```

Fill in the four values (Supabase URL + service role key, Spotify client ID + secret).
`SPOTIFY_REDIRECT_URI` is already set correctly for local dev.

## 4. Run it

```bash
npm install
npm run dev
```

Open **http://127.0.0.1:3000** (use `127.0.0.1`, not `localhost` — Spotify's redirect
won't match otherwise). Go to **Settings > Connect Spotify**, log in, approve access.
You should land back on Settings showing "Connected", with a search box and player
underneath.

## 5. Deploy

1. Push this repo to GitHub.
2. Import it on [vercel.com](https://vercel.com) (New Project > select the repo).
3. In the Vercel project's **Environment Variables**, add the same four variables from
   `.env.local`, except set `SPOTIFY_REDIRECT_URI` to your real domain, e.g.
   `https://ascendo.vercel.app/api/spotify/callback`.
4. On Spotify's dashboard, add that same production URL as a second Redirect URI
   (you can have both the local and production ones registered at once).
5. Deploy. Optionally turn on **Deployment Protection** (password) in Vercel's project
   settings — this app has no login system of its own; it assumes only you can reach it.

## Why no login system?

This is a single-person app talking to a single-row database — there's only ever one
"user". Rather than build a full auth system nothing else needs, the app is protected
at the edge (Vercel's password protection) instead. If that ever changes, Supabase Auth
can be layered in later without touching the data model.

## What's next

Porting the Daily / Long-term / Calendar / Notes views from the previous artifact
version into this app, backed by the `subcategories` / `trackers` / `tracker_entries` /
`notes` / `events` tables already defined in `supabase/schema.sql`.
